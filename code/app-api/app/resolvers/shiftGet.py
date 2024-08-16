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