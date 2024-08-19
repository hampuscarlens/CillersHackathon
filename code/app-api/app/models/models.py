# models.py
import strawberry
from typing import List, Optional
from datetime import datetime, time, date
from enum import Enum


@strawberry.type
class Unavailability:
    id: strawberry.ID
    employee_id: strawberry.ID
    start_time: datetime  # Start of unavailability
    end_time: datetime  # End of unavailability

@strawberry.input
class UnavailabilityInput:
    employee_id: strawberry.ID  # ID of the employee
    start_time: datetime  # Start time of unavailability
    end_time: datetime  # End time of unavailability


"""A GraphQL type (strawberry.type) representing an employee in the system"""
@strawberry.type
class Employee:
    id: strawberry.ID
    name: str
    age: int
    location: str
    email: str
    speciality: str
    salary: int
    skill_level: int = strawberry.field(default=100)  # Default skill level set to 100
    preferences: str
    shift_ids: Optional[List[strawberry.ID]] = strawberry.field(default_factory=list)  # Store shift IDs instead of full Shift objects
    unavailability: List[Unavailability] = strawberry.field(default_factory=list)  # List of availability periods



"""A GraphQL input type (strawberry.input) used when creating new employees."""
@strawberry.input
class EmployeeInput:
    name: str
    age: int
    location: str
    email: str
    speciality: str
    salary: int
    skill_level: int = strawberry.field(default=100)  # Default skill level set to 100
    preferences: Optional[str] = None  # Optional field, can be None
    shifts: Optional[List['ShiftInput']] = strawberry.field(default_factory=list)  # Optional, default empty list
    unavailability: Optional[List[UnavailabilityInput]] = strawberry.field(default_factory=list)  # Optional, default empty list


@strawberry.type
class specialityRequirement:
    speciality: str  # Name of the speciality (e.g., "Nurse", "Surgeon")
    num_required: int  # Number of employees required for the speciality
    
@strawberry.input
class specialityRequirementInput:
    speciality: str  # Name of the speciality (e.g., "Nurse", "Surgeon")
    num_required: int  # Number of employees required for the speciality


@strawberry.type
class Shift:
    id: strawberry.ID
    start_time: datetime
    end_time: datetime
    specialities: List[specialityRequirement]  # List of specialities and number of people required for each speciality
    location: Optional[str]
    employee_ids: List[strawberry.ID]  # Store employee IDs instead of full Employee objects


@strawberry.input
class ShiftInput:
    start_time: datetime
    end_time: datetime
    specialities: List[specialityRequirementInput]
    location: Optional[str] = None
    employee_ids: Optional[List[strawberry.ID]] = None


# Schedule model
@strawberry.type
class Schedule:
    id: strawberry.ID
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    shift_ids: List[strawberry.ID]  # Store a list of shift IDs
    created_at: datetime

