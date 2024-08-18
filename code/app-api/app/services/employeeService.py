import uuid
from typing import List
from .. import couchbase as cb, env
from ..models.models import Employee, EmployeeInput, UnavailabilityInput
import strawberry
from datetime import datetime

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
        employees = []
        for r in result:
            unavailability = []
            if 'unavailability' in r:
                unavailability = [
                    UnavailabilityInput(
                        employee_id=r['id'],
                        day_of_week=avail['day_of_week'],
                        # Convert string times (in start_time and end_time) to time objects
                        start_time=datetime.strptime(avail['start_time'], "%H:%M:%S").time(),
                        end_time=datetime.strptime(avail['end_time'], "%H:%M:%S").time()
                    ) for avail in r['unavailability']
                ]

            employee = Employee(
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
                unavailability=unavailability
            )
            employees.append(employee)
        return employees


    def set_availability_of_employee(self, employee_id: str, unavailability: List[UnavailabilityInput]) -> Employee:
        # Step 1: Retrieve the existing employee record by employee_id
        result = cb.get(
            env.get_couchbase_conf(),
            cb.DocRef(bucket=env.get_couchbase_bucket(),
                    collection='employees',
                    key=employee_id)
        )

        # Ensure the correct attribute is used to access the data
        if not result or not result.value:
            raise ValueError(f"Employee with id {employee_id} not found.")

        existing_employee_data = result.value  # Assuming 'value' holds the document content

        # Step 2: Prepare the new availability data
        unavailability_data = [
            {
                'day_of_week': avail.day_of_week,
                'start_time': avail.start_time.isoformat(),
                'end_time': avail.end_time.isoformat(),
            }
            for avail in unavailability
        ]

        # Step 3: Update the existing employee's unavailability
        updated_data = existing_employee_data
        updated_data['unavailability'] = unavailability_data

        # Step 4: Save the updated record back to Couchbase
        cb.upsert(env.get_couchbase_conf(),
                cb.DocSpec(bucket=env.get_couchbase_bucket(),
                            collection='employees',
                            key=employee_id,
                            data=updated_data))

        # Step 5: Return the updated Employee object
        return Employee(
            id=employee_id,
            name=updated_data['name'],
            age=updated_data['age'],
            location=updated_data['location'],
            email=updated_data['email'],
            speciality=updated_data['speciality'],
            salary=updated_data['salary'],
            skill_level=updated_data.get('skill_level', 100),  # Default value if missing
            preferences=updated_data.get('preferences', ''),
            shift_ids=updated_data.get('shift_ids', []),
            unavailability=unavailability  # Use the newly provided unavailability
        )



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
