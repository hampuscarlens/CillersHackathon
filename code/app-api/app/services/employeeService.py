import uuid
from typing import List
from .. import couchbase as cb, env
from ..models.models import Employee, EmployeeCreateInput

class EmployeeService:
    """Service for interacting with employees."""

    def list_employees(self) -> List[Employee]:
        result = cb.exec(
            env.get_couchbase_conf(),
            f"SELECT name, META().id, age, location, preferences FROM {env.get_couchbase_bucket()}._default.employees"
        )
        return [Employee(**r) for r in result]

    def create_employees(self, employees: List[EmployeeCreateInput]) -> List[Employee]:
        created_employees = []
        for employee in employees:
            id = str(uuid.uuid1())
            cb.insert(env.get_couchbase_conf(),
                      cb.DocSpec(bucket=env.get_couchbase_bucket(),
                                 collection='employees',
                                 key=id,
                                 data={
                                     'name': employee.name,
                                     'age': employee.age,
                                     'location': employee.location,
                                     'preferences': employee.preferences
                                 }))
            created_employee = Employee(
                id=id,
                name=employee.name,
                age=employee.age,
                location=employee.location,
                preferences=employee.preferences
            )
            created_employees.append(created_employee)
        return created_employees

    def remove_employees(self, ids: List[str]) -> List[str]:
        for id in ids:
            cb.remove(env.get_couchbase_conf(),
                      cb.DocRef(bucket=env.get_couchbase_bucket(),
                                collection='employees',
                                key=id))
        return ids