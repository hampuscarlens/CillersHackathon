import uuid
from typing import List
from .. import couchbase as cb, env
from ..models.models import Employee, EmployeeInput, UnavailabilityInput
import strawberry

class EmployeeService:
    """Service for interacting with employees."""

    def list_employees(self) -> List[Employee]:
        # Adjusted query to include new fields like speciality, salary, skill_level, shift_ids, and unavailability
        result = cb.exec(
            env.get_couchbase_conf(),
            f"""
            SELECT name, META().id, age, location, email, speciality, salary, skill_level, preferences, shift_ids, unavailability
            FROM {env.get_couchbase_bucket()}._default.employees
            """
        )
        # Map the result to the Employee model
        return [
            Employee(
                id=r['id'],
                name=r['name'],
                age=r['age'],
                location=r['location'],
                email=r['email'],
                speciality=r['speciality'],
                salary=r['salary'],
                skill_level=r.get('skill_level', 100),  # Default value if missing
                preferences=r.get('preferences', ''),
                shift_ids=r.get('shift_ids', []),
                unavailability=r.get('unavailability', [])
            ) for r in result
        ]

    def create_employees(self, employees: List[EmployeeInput]) -> List[Employee]:
        created_employees = []
        for employee in employees:
            id = str(uuid.uuid1())
            
            # Prepare availability data
            unavailability_data = [
                {
                    'day_of_week': avail.day_of_week,
                    'start_time': avail.start_time.isoformat(),
                    'end_time': avail.end_time.isoformat(),
                }
                for avail in employee.unavailability or []
            ]

            # Insert new employee data into Couchbase
            cb.insert(env.get_couchbase_conf(),
                      cb.DocSpec(bucket=env.get_couchbase_bucket(),
                                 collection='employees',
                                 key=id,
                                 data={
                                     'name': employee.name,
                                     'age': employee.age,
                                     'location': employee.location,
                                     'email': employee.email,
                                     'speciality': employee.speciality,
                                     'salary': employee.salary,
                                     'skill_level': employee.skill_level,
                                     'preferences': employee.preferences,
                                     'shift_ids': [],  # Default to empty list until shifts are assigned
                                     'unavailability': unavailability_data  # Store availability as list of dicts
                                 }))

            # Create Employee object to return
            created_employee = Employee(
                id=id,
                name=employee.name,
                age=employee.age,
                location=employee.location,
                email=employee.email,
                speciality=employee.speciality,
                salary=employee.salary,
                skill_level=employee.skill_level,
                preferences=employee.preferences,
                shift_ids=[],
                unavailability=[  # Map UnavailabilityInput to Unavailability
                    UnavailabilityInput(
                        day_of_week=avail.day_of_week,
                        start_time=avail.start_time,
                        end_time=avail.end_time
                    ) for avail in employee.unavailability
                ]
            )
            created_employees.append(created_employee)
        return created_employees

    def remove_employees(self, ids: List[strawberry.ID]) -> List[strawberry.ID]:
        # Removing employees from Couchbase by their ids
        for id in ids:
            cb.remove(env.get_couchbase_conf(),
                    cb.DocRef(bucket=env.get_couchbase_bucket(),
                                collection='employees',
                                key=str(id)))  # Convert the ID to string before using it in the Couchbase query
        return ids
