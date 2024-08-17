import strawberry
import asyncio
from typing import List
from typing import AsyncGenerator
from ..services.shiftService import ShiftService
from ..auth import IsAuthenticated
from ..models.models import Shift, ShiftInput

shift_service = ShiftService()

@strawberry.type
class Query:
    @strawberry.field
    def shifts(self) -> List[Shift]:
        return shift_service.list_shifts()

@strawberry.type
class Mutation:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def create_shifts(self, shifts: List[ShiftInput]) -> List[Shift]:
        created_shifts = shift_service.create_shifts(shifts)
        
        # Ensure it never returns None
        if not created_shifts:
            raise ValueError("No shifts were created.")
        
        return created_shifts

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def remove_shifts(self, ids: List[strawberry.ID]) -> List[strawberry.ID]:
        return shift_service.remove_shifts(ids)
    
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def add_employees_to_shift(self, shift_id: strawberry.ID, employee_ids: List[strawberry.ID]) -> Shift:
        # Fetch the shift by its ID
        shift = shift_service.get_shift_by_id(shift_id)
        
        # Add the new employee IDs to the shift, avoiding duplicates
        shift.employee_ids = list(set(shift.employee_ids + employee_ids))
        
        # Update the shift in the database or service
        shift_service.update_shift(shift)
        
        # Return the updated shift
        return shift
    
    
@strawberry.type
class Subscription:
    @strawberry.subscription(permission_classes=[IsAuthenticated])
    async def shift_created(self, info: strawberry.types.Info) -> AsyncGenerator[Shift, None]:
        seen = set(s.id for s in shift_service.list_shifts())
        while True:
            for s in shift_service.list_shifts():
                if s.id not in seen:
                    seen.add(s.id)
                    yield s
            await asyncio.sleep(0.5)