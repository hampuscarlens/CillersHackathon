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
    
    
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def employee_create_demo(self) -> List[Employee]:
        """
        This method creates demo employees with predefined data.
        """
        # Step 1: List all current employees to get their IDs
        existing_employees = employee_service.list_employees()
        existing_employee_ids = [employee.id for employee in existing_employees]
        
        # Step 2: Remove all existing employees by their IDs
        if existing_employee_ids:
            employee_service.remove_employees(existing_employee_ids)
        

        return employee_service.create_employees_for_demo()

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
