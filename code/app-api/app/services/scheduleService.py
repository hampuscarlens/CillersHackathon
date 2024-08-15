# service.py
import uuid
from typing import List
import datetime
from .. import couchbase as cb, env
from ..services.employeeService import EmployeeService
from ..models.models import Employee, EmployeeCreateInput, Schedule



class SchedulingService:
    """Service for generating and managing employee schedules."""

    def __init__(self, employee_service: EmployeeService):
        self.employee_service = employee_service

    def generate_shifts(self) -> List[dict]:
        """Generate a basic set of shifts."""
        today = datetime.datetime.now()
        shifts = [
            {"start": (today + datetime.timedelta(hours=8)).isoformat(),
             "end": (today + datetime.timedelta(hours=16)).isoformat()},
            {"start": (today + datetime.timedelta(hours=16)).isoformat(),
             "end": (today + datetime.timedelta(hours=24)).isoformat()},
            {"start": (today + datetime.timedelta(hours=0)).isoformat(),
             "end": (today + datetime.timedelta(hours=8)).isoformat()}
        ]
        return shifts

    def create_schedule(self) -> List[Schedule]:
        """Generate a schedule for employees."""
        employees = self.employee_service.list_employees()
        shifts = self.generate_shifts()
        schedule = []

        for i, employee in enumerate(employees):
            shift = shifts[i % len(shifts)]
            schedule.append(Schedule(
                employee_id=employee.id,
                shift_start=shift['start'],
                shift_end=shift['end'],
                location=employee.location
            ))
        return schedule

    def save_schedule(self, schedule: List[Schedule]):
        """Save the generated schedule into Couchbase."""
        for entry in schedule:
            cb.insert(env.get_couchbase_conf(),
                      cb.DocSpec(bucket=env.get_couchbase_bucket(),
                                 collection='schedules',
                                 key=f"{entry.employee_id}-{entry.shift_start}",
                                 data={
                                     'employee_id': entry.employee_id,
                                     'shift_start': entry.shift_start,
                                     'shift_end': entry.shift_end,
                                     'location': entry.location
                                 }))
