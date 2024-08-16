import strawberry
from typing import List
from ..auth import IsAuthenticated
from ..models.models import Employee, EmployeeInput, Schedule  # Import from models
from ..services.scheduleService import SchedulingService
from ..services.employeeService import EmployeeService


# Initialize the services
employee_service = EmployeeService()
scheduling_service = SchedulingService(employee_service)


# Schedule-related GraphQL Queries and Mutations
@strawberry.type
class Query:
    @strawberry.field
    def schedule(self) -> List[Schedule]:
        """Fetch the current employee schedule."""
        return scheduling_service.create_schedule()

@strawberry.type
class Mutation:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def regenerate_schedule(self) -> List[Schedule]:
        """Regenerate and save a new employee schedule."""
        schedule = scheduling_service.create_schedule()
        scheduling_service.save_schedule(schedule)
        return schedule
