import strawberry
from typing import List, Optional
from ..auth import IsAuthenticated
from ..models.models import Employee, EmployeeInput, Schedule  # Import from models
from ..services.scheduleService import SchedulingService
from ..services.shiftService import ShiftService
from ..services.employeeService import EmployeeService
from datetime import datetime


# Initialize the services
employee_service = EmployeeService()
shift_service = ShiftService()
scheduling_service = SchedulingService(employee_service, shift_service)


@strawberry.type
class Query:
    @strawberry.field
    def get_schedule(self, schedule_id: Optional[strawberry.ID] = None) -> Optional[Schedule]:
        """
        Fetch a specific schedule based on the provided schedule ID, or the latest schedule if no ID is provided.
        """
        return scheduling_service.get_schedule_by_id(schedule_id)



@strawberry.type
class Mutation:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def create_schedule(self) -> Schedule:
        """
        Create a new schedule and return it.
        """
        # Create the schedule
        problem_status = scheduling_service.create_schedule()

        if problem_status:
            # Fetch and return the latest schedule (the one just created)
            latest_schedule = scheduling_service.get_schedule_by_id()

            return latest_schedule
        else:
            return Schedule(
                id=str(0),
                name="Schedule not feasible",
                start_date=datetime.now(),
                end_date=datetime.now(),
                shift_ids=[]
            )