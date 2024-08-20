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
start_date = datetime(2024, 8, 19)  # Start date (Monday)
end_date = datetime(2024, 8, 19)    # End date (Monday)

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
    async def renew_shifts(self) -> List[strawberry.ID]:
        """
        Delete all shifts and create new empty shifts.
        """
        # Delete all shifts
        shift_service.delete_all_shifts()

        # Create new empty shifts
        shift_ids = scheduling_service.generate_shifts_for_schedule(
            start_date=start_date, end_date=end_date, shift_duration=2, num_shifts_per_day=4
        )

        return shift_ids
    
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def create_schedule(self) -> Schedule:
        """
        Create a new schedule and return it.
        """
        # Create the schedule
        problem_status = scheduling_service.create_schedule(start_date=start_date, end_date=end_date)

        if problem_status:
            # Fetch and return the latest schedule (the one just created)
            latest_schedule = scheduling_service.get_schedule_by_id()

            return latest_schedule
        else:
            return Schedule(
                id=str(0),
                name="Schedule not feasible",
                description="none",
                start_date=datetime.now(),
                end_date=datetime.now(),
                shift_ids=[],
                created_at =datetime.now()
            )