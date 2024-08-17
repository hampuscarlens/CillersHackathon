import strawberry
from typing import List
from ..auth import IsAuthenticated
from ..models.models import Employee, EmployeeInput, Schedule  # Import from models
from ..services.scheduleService import SchedulingService
from ..services.shiftService import ShiftService
from ..services.employeeService import EmployeeService
import numpy as np


# Initialize the services
employee_service = EmployeeService()
shift_service = ShiftService()
scheduling_service = SchedulingService(employee_service, shift_service)


# Schedule-related GraphQL Queries and Mutations
@strawberry.type
class Query:
    @strawberry.field
    def schedule(self) -> List[List[int]]:
        # Convert np.ndarray to a list of lists (or an appropriate structure)
        schedule_array = scheduling_service.create_schedule()
        return schedule_array.tolist()  # Convert np.ndarray to a list

@strawberry.type
class Mutation:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def regenerate_schedule(self) -> List[Schedule]:
        """Regenerate and save a new employee schedule."""
        schedule = scheduling_service.create_schedule()
        scheduling_service.save_schedule(schedule)
        return schedule
