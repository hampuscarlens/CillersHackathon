# models.py
import strawberry
from typing import List, Optional
from datetime import datetime
from enum import Enum

"""A GraphQL type (strawberry.type) representing an employee in the system"""
@strawberry.type
class Employee:
    id: str
    name: str
    age: int
    location: str
    preferences: str
    shifts: Optional[List['Shift']] = strawberry.field(default_factory=list)  # Allow shifts to be optional


"""A GraphQL input type (strawberry.input) used when creating new employees."""
@strawberry.input
class EmployeeCreateInput:
    name: str
    age: int
    location: str
    preferences: str


@strawberry.type
class Shift:
    id: strawberry.ID
    start_time: datetime
    end_time: datetime
    role: str
    location: Optional[str]
    employees: List[Employee]  # List of employees on this shift, can be None


# Schedule model
@strawberry.type
class Schedule:
    id: strawberry.ID
    name: str
    start_date: datetime
    end_date: datetime
    shifts: List[Shift]
