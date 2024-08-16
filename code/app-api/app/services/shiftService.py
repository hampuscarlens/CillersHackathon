import uuid
from typing import List
from datetime import datetime
from .. import couchbase as cb, env
from ..models.models import Shift, ShiftInput, specialityRequirement, specialityRequirementInput

class ShiftService:
    """Service for interacting with shifts."""

    def list_shifts(self) -> List[Shift]:
        # Query to fetch all the relevant fields for shifts
        result = cb.exec(
            env.get_couchbase_conf(),
            f"""
            SELECT META().id, start_time, end_time, specialities, location, employee_ids
            FROM {env.get_couchbase_bucket()}._default.shifts
            """
        )
        # Map the result to the Shift model
        return [
            Shift(
                id=r['id'],
                start_time=datetime.fromisoformat(r['start_time']),
                end_time=datetime.fromisoformat(r['end_time']),
                specialities=[specialityRequirement(speciality=speciality['speciality'], num_required=speciality['num_required']) for speciality in r['specialities']],
                location=r.get('location', None),
                employee_ids=r.get('employee_ids', [])
            ) for r in result
        ]

    def create_shifts(self, shifts: List[ShiftInput]) -> List[Shift]:
        created_shifts = []
        for shift in shifts:
            id = str(uuid.uuid1())

            # Prepare specialities data to be inserted into Couchbase
            specialities_data = [
                {
                    'speciality': speciality.speciality,
                    'num_required': speciality.num_required,
                }
                for speciality in shift.specialities
            ]

            # Insert new shift data into Couchbase
            cb.insert(env.get_couchbase_conf(),
                      cb.DocSpec(bucket=env.get_couchbase_bucket(),
                                 collection='shifts',
                                 key=id,
                                 data={
                                     'start_time': shift.start_time.isoformat(),
                                     'end_time': shift.end_time.isoformat(),
                                     'specialities': specialities_data,
                                     'location': shift.location,
                                     'employee_ids': shift.employee_ids or []  # Store employee IDs, default to empty list
                                 }))
        return 1
      
