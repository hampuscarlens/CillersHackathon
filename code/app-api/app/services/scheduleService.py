# service.py
import uuid
import logging
from typing import List
from datetime import datetime, timedelta, time
import cvxpy as cp
import numpy as np
from .. import couchbase as cb, env
from ..services.employeeService import EmployeeService
from ..services.shiftService import ShiftService
from ..models.models import Employee, EmployeeInput, Schedule, Shift, ShiftInput, specialityRequirementInput


logger = logging.getLogger(__name__)


class SchedulingService:
    """Service for generating and managing employee schedules."""

    def __init__(self, employee_service: EmployeeService, shift_serive: ShiftService):
        self.employee_service = employee_service
        self.shift_service = shift_serive

    def generate_shifts_for_schedule(self, start_date: datetime, end_date: datetime, shift_duration: int,
                                      num_shifts_per_day: int, specialities: List[specialityRequirementInput] = None, location: str = None) -> List[ShiftInput]:
        """
        Generate shifts for a given schedule period with shifts starting at 8 AM and ending by 5 PM.

        Args:
        - start_date (datetime): The starting date of the schedule.
        - end_date (datetime): The ending date of the schedule.
        - shift_duration (int): Duration of each shift in hours.
        - num_shifts_per_day (int): Number of shifts to generate per day.
        - specialities (List[specialityRequirementInput]): List of specialities required for each shift.
        - location (str, optional): Location of the shifts.

        Returns:
        - List[ShiftInput]: List of generated shifts without employees assigned.
        """

        """
        OBS currently we have the same speciality requirements for each shift and it is hardcoded 
        """

        specialities = [specialityRequirementInput(speciality="surgeon", num_required=3), 
                        specialityRequirementInput(speciality="nurse", num_required=7), 
                        specialityRequirementInput(speciality="secretary", num_required=2)]       # OBS hardcoded

        generated_shifts = []
        shift_start_time = time(8, 0)  # Shifts start at 8:00 AM
        shift_end_time = time(17, 0)  # Last shift must end by 5:00 PM (17:00)

        # Calculate the total number of days in the schedule period
        delta = end_date - start_date

        # Iterate through each day within the schedule period
        for day in range(delta.days + 1):
            current_date = start_date + timedelta(days=day)

            # The start of the first shift at 8:00 AM
            current_shift_start = datetime.combine(current_date, shift_start_time)

            # For each day, generate the specified number of shifts
            for shift_num in range(num_shifts_per_day):
                shift_start = current_shift_start + timedelta(hours=shift_num * shift_duration)
                shift_end = shift_start + timedelta(hours=shift_duration)

                # Ensure that the shift ends before or at 5 PM
                if shift_end.time() > shift_end_time:
                    break  # Don't generate a shift that would go beyond 5 PM

                # Create the ShiftInput object without employees
                shift = ShiftInput(
                    start_time=shift_start,
                    end_time=shift_end,
                    specialities=specialities,  # List of specialityRequirementInput
                    location=location,
                    employee_ids=[]  # No employees assigned yet
                )

                # Add the generated shift to the list
                generated_shifts.append(shift)

        # create shifts from shift inputs, store in database and return
        return self.shift_service.create_shifts(generated_shifts)
    

    def generate_schedule(self, employees: List[Employee], shifts: List[Shift], max_shifts_per_employee = 100):
        """
        Generate a schedule assigning employees to shifts using optimization.

        Args:
        - employees (List[Employee]): List of employees.
        - shifts (List[Shift]): List of shifts to be filled.
        - max_shifts_per_employee (int): Maximum number of shifts any employee can work.

        Returns:
        - A matrix where 1 means the employee is assigned to that shift, 0 means not assigned.
        """
        
        """OBS
        remember the following structure in models.py:
        @strawberry.type
        class specialityRequirement:
            speciality: str  # Name of the speciality (e.g., "Nurse", "Surgeon")
            num_required: int  # Number of employees required for the speciality
            
        @strawberry.input
        class specialityRequirementInput:
            speciality: str  # Name of the speciality (e.g., "Nurse", "Surgeon")
            num_required: int  # Number of employees required for the speciality


        @strawberry.type
        class Shift:
            id: strawberry.ID
            start_time: datetime
            end_time: datetime
            specialities: List[specialityRequirement]  # List of specialities and number of people required for each speciality
            location: Optional[str]
            employee_ids: List[strawberry.ID]  # Store employee IDs instead of full Employee objects
        """
        
        num_employees = len(employees)
        num_shifts = len(shifts)
        shift_requirements = []     # in the order that the shifts appear in the list
        
        for shift in shifts:
            shift_specialities = shift.specialities  # contains a list of {speciality (str), num_required (int)}
            for speciality in shift_specialities:
                shift_requirements.append([speciality.speciality, speciality.num_required])   # remember that a speciality contains 
                """
                speciality: str  # Name of the speciality (e.g., "Nurse", "Surgeon")
                num_required: int  # Number of employees required for the speciality
                """


        # the speciality of each employee in the order the employees appear in the list
        specialities = np.array([employee.speciality for employee in employees])

        # Decision variables: x[i, j] is 1 if employee i works shift j
        x = cp.Variable((num_employees, num_shifts), boolean=True)

        # Constraints
        constraints = []
        logger.info(msg=shift_requirements)

        # Each shift must be covered by the required number of employees for each speciality
        for j in range(num_shifts):
            
            for speciality_name, required_count in shift_requirements[j]:
                # Filter employees by their speciality and sum up their shift assignments
                constraints.append(
                    cp.sum(x[specialities == speciality_name, j]) == required_count
                )

        # Each employee works no more than their max shifts
        for i in range(num_employees):
            constraints.append(cp.sum(x[i, :]) <= max_shifts_per_employee)

        # Dummy objective function (since we don't care about optimization here)
        objective = cp.Minimize(0)

        # Solve the problem
        problem = cp.Problem(objective, constraints)
        problem.solve(solver=cp.GUROBI)  # Use any available solver

        # Output the results as a shift assignment matrix
        return x.value
    
    
    
    def create_schedule(self):
        """Generate a schedule for employees."""
        self.employees = self.employee_service.list_employees()
        start_date = datetime(2024, 8, 19)  # Start date (Monday)
        end_date = datetime(2024, 8, 25)    # End date (Sunday)

        self.shifts = self.generate_shifts_for_schedule(start_date=start_date, end_date=end_date, shift_duration=2, num_shifts_per_day=4)
        self.schedule = self.generate_schedule(self.employees, self.shifts)

        return self.schedule

    def save_schedule(self, schedule: List[Schedule]):
        """Save the generated schedule into Couchbase."""
        for entry in schedule:
            cb.insert(env.get_couchbase_conf(),
                      cb.DocSpec(bucket=env.get_couchbase_bucket(),
                                 collection='schedules',
                                 key=f"{entry.employee_id}-{entry.shift_start}",
                                 data={
                                     'employee_id': entry.employee_id,
                                     'shift_start': entry.shift_start,
                                     'shift_end': entry.shift_end,
                                     'location': entry.location
                                 }))
