import asyncio
import strawberry
from typing import List, AsyncGenerator
from ..services.employeeService import EmployeeService
from ..auth import IsAuthenticated
from ..models.models import Employee, EmployeeInput  # Updated Employee and EmployeeCreateInput imports

employee_service = EmployeeService()

@strawberry.type
class Query:
    @strawberry.field
    def employees(self) -> List[Employee]:
        return employee_service.list_employees()

@strawberry.type
class Mutation:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def employee_create(self, employees: List[EmployeeInput]) -> List[Employee]:
        return employee_service.create_employees(employees)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def employee_remove(self, ids: List[strawberry.ID]) -> List[strawberry.ID]:
        return employee_service.remove_employees(ids)


@strawberry.type
class Subscription:
    @strawberry.subscription(permission_classes=[IsAuthenticated])
    async def employee_created(self, info: strawberry.types.Info) -> AsyncGenerator[Employee, None]:
        seen = set(e.id for e in employee_service.list_employees())
        while True:
            for e in employee_service.list_employees():
                if e.id not in seen:
                    seen.add(e.id)
                    yield e
            await asyncio.sleep(0.5)
