import uuid
import strawberry
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
        shift_ids = []
        for shift in shifts:
            id = str(uuid.uuid1())
            shift_ids.append(id)
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
        return shift_ids
    
    def get_shift_by_id(self, shift_id: strawberry.ID) -> Shift:
        # Use Couchbase DocRef to reference the document in the appropriate bucket and collection
        doc_ref = cb.DocRef(bucket=env.get_couchbase_bucket(), collection='shifts', key=shift_id)
        
        # Fetch the document using the doc_ref
        shift_data = cb.get(env.get_couchbase_conf(), doc_ref)

        # Access the content of the document
        shift_content = shift_data.value

        # Map the fetched data back to the Shift model
        return Shift(
            id=shift_id,
            start_time=datetime.fromisoformat(shift_content['start_time']),
            end_time=datetime.fromisoformat(shift_content['end_time']),
            specialities=[specialityRequirement(speciality=speciality['speciality'], num_required=speciality['num_required']) for speciality in shift_content['specialities']],
            location=shift_content.get('location', None),
            employee_ids=shift_content.get('employee_ids', [])
        )

    def update_shift(self, shift: Shift) -> Shift:
        # Prepare the shift data to be updated (convert to serializable format)
        shift_data = {
            'start_time': shift.start_time.isoformat(),
            'end_time': shift.end_time.isoformat(),
            'specialities': [
                {'speciality': speciality.speciality, 'num_required': speciality.num_required}
                for speciality in shift.specialities
            ],
            'location': shift.location,
            'employee_ids': shift.employee_ids
        }

        # Create a DocSpec object for upsert
        spec = cb.DocSpec(
            bucket=env.get_couchbase_bucket(),
            collection='shifts',
            key=shift.id,
            data=shift_data  # Serialized shift data
        )
        cb.upsert(env.get_couchbase_conf(), spec)
        
        return shift


    def update_speciality(self, shift: Shift, new_speciality: specialityRequirement) -> Shift:
        # Prepare the shift data to be updated (convert to serializable format)
        
        new_specialities = []
        for speciality in shift.specialities:
            should_update = speciality.speciality == new_speciality.speciality
            new_specialities.append({
                'speciality': speciality.speciality,
                'num_required': new_speciality.num_required if should_update else speciality.num_required,
            })
        
        shift_data = {
            'start_time': shift.start_time.isoformat(),
            'end_time': shift.end_time.isoformat(),
            'specialities': new_specialities,
            'location': shift.location,
            'employee_ids': shift.employee_ids
        }

        # Create a DocSpec object for upsert
        spec = cb.DocSpec(
            bucket=env.get_couchbase_bucket(),
            collection='shifts',
            key=shift.id,
            data=shift_data  # Serialized shift data
        )
        cb.upsert(env.get_couchbase_conf(), spec)
        
        return shift


    def add_employees_to_shift(self, shift: Shift, employee_ids = List[strawberry.ID]) -> Shift:
        # Prepare the shift data to be updated (convert to serializable format)
        shift_data = {
            'start_time': shift.start_time.isoformat(),
            'end_time': shift.end_time.isoformat(),
            'specialities': [
                {'speciality': speciality.speciality, 'num_required': speciality.num_required}
                for speciality in shift.specialities
            ],
            'location': shift.location,
            'employee_ids': employee_ids
        }

        # Create a DocSpec object for upsert
        spec = cb.DocSpec(
            bucket=env.get_couchbase_bucket(),
            collection='shifts',
            key=shift.id,
            data=shift_data  # Serialized shift data
        )
        cb.upsert(env.get_couchbase_conf(), spec)
        
        return shift
    

    def remove_shifts(self, ids: List[strawberry.ID]) -> List[strawberry.ID]:
        # Remove each shift by its ID
        for shift_id in ids:
            cb.remove(env.get_couchbase_conf(),
                      cb.DocRef(bucket=env.get_couchbase_bucket(),
                                collection='shifts',
                                key=shift_id))
        return ids

    def delete_all_shifts(self) -> List[strawberry.ID]:
        # List all shifts to get their IDs
        all_shifts = self.list_shifts()

        # Extract the IDs of all shifts
        shift_ids = [shift.id for shift in all_shifts]

        # Use the remove_shifts function to delete all shifts by ID
        return self.remove_shifts(shift_ids)