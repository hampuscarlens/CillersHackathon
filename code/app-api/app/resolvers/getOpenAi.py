import strawberry
import logging
from enum import Enum
from pydantic import BaseModel
import openai
from ..models.models import UnavailabilityInput
from openai import OpenAI
from .. import types
from ..auth import IsAuthenticated
from ..services.employeeService import EmployeeService
from datetime import datetime, time, date, timedelta


logger = logging.getLogger(__name__)

# Ensure you have set your OpenAI API key in your environment variables or another secure method
api_key = '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'
employee_service = EmployeeService()


class TimeRange(BaseModel):
    start_time: int
    end_time: int
    day: str

class ListOfTimeRanges(BaseModel):
    time_ranges: list[TimeRange]

class FurtherQuestionsNeeded(BaseModel):
    further_questions_needed: bool


# Add monday the 19th of August 2024 as a reference start day
REFERENCE_START_OF_WEEK_DAY = date(2024, 8, 19)

EMPLOYEE_ID = "53a9f6ba-5c81-11ef-8844-0242ac140002"

def convert_shift_time_into_datetime(shift_time: int, week_day: str, reference_start_day):
    """
    Given a weekday week_day and a shift time, create a datetime object.

    For example, if the shift time is 10 and the weekday is Tuesday,
    the time object should reference to Tuesday the 20th of August 2024 at 10 am.
    """
    # Mapping of weekday names to their corresponding integer value (Monday=0, Sunday=6)
    week_day_mapping = {
        'monday': 0,
        'tuesday': 1,
        'wednesday': 2,
        'thursday': 3,
        'friday': 4,
        'saturday': 5,
        'sunday': 6
    }
    
    # Get the day offset from the reference start day
    day_offset = week_day_mapping[week_day]  # E.g., 'Tuesday' -> 1
    
    # Calculate the exact date for the given weekday
    target_date = reference_start_day + timedelta(days=day_offset)
    
    # Create the datetime object for the target date with the given shift time
    result_datetime = datetime.combine(target_date, datetime.min.time()) + timedelta(hours=shift_time)
    
    return result_datetime


def convert_shift_time_ranges_to_unavailability_input(list_of_time_ranges: ListOfTimeRanges) -> list[UnavailabilityInput]:
    unavailability_input_list = []
    for time_range in list_of_time_ranges.time_ranges:
        unavailability_input_list.append(UnavailabilityInput(
            employee_id=EMPLOYEE_ID,
            start_time=convert_shift_time_into_datetime(time_range.start_time, time_range.day, REFERENCE_START_OF_WEEK_DAY),
            end_time=convert_shift_time_into_datetime(time_range.end_time, time_range.day, REFERENCE_START_OF_WEEK_DAY)
        ))
    return unavailability_input_list


def convert_to_shift_time_ranges(list_of_time_ranges: ListOfTimeRanges) -> ListOfTimeRanges:
    # Predefined time slots for shifts
    predefined_slots = [
        (8, 10),
        (10, 12),
        (12, 14),
        (14, 16)
    ]
    
    result_time_ranges = []

    for time_range in list_of_time_ranges.time_ranges:
        start_time = time_range.start_time
        end_time = time_range.end_time
        day = time_range.day.lower()  # Convert day to lowercase
        
        for slot_start, slot_end in predefined_slots:
            # Check if the input time range overlaps with the predefined slot
            if start_time < slot_end and end_time > slot_start:
                result_time_ranges.append(TimeRange(
                    start_time=slot_start,
                    end_time=slot_end,
                    day=day
                ))

    return ListOfTimeRanges(time_ranges=result_time_ranges)

def convert_list_of_time_ranges_to_string(time_ranges):
    time_ranges_string = ""
    for time_range in time_ranges:
        time_ranges_string += f"{time_range.day} from {time_range.start_time} to {time_range.end_time}\n"
    return time_ranges_string


def get_time_ranges(client, user_input):
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are an assistant that interprets when a user is unavailable during the week."},
            {"role": "system", "content": "You only give answers during the week days, not weekends. Your answers only lie between 8 and 16"},
            {"role": "user", "content": user_input},
        ],
        response_format=ListOfTimeRanges,
    )

    message = completion.choices[0].message
    if message.parsed:
        return message.parsed
    else:
        return None

def determine_if_further_questions_needed(client, user_input):
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are an assistant that interprets when a user is done with the conversation."},
            {"role": "user", "content": user_input},
        ],
        response_format=FurtherQuestionsNeeded,
    )

    return completion.choices[0].message.parsed


@strawberry.type
class Query:
    @strawberry.field(permission_classes=[IsAuthenticated])
    def getOpenAi(self, prompt: str) -> types.Message:
        try:
            client = OpenAI(api_key=api_key)

            logger.info(f"Received prompt: {prompt}")

            response = get_time_ranges(client, prompt)
            formatted_response = convert_to_shift_time_ranges(response)

            message_for_printing = convert_list_of_time_ranges_to_string(formatted_response.time_ranges)
            logger.info(f"OpenAI response: {message_for_printing}")

            unavailability_input_list = convert_shift_time_ranges_to_unavailability_input(formatted_response)
            all_employees = employee_service.list_employees()
            id_of_first_employee = all_employees[0].id
            employee_service.set_availability_of_employee(id_of_first_employee, unavailability_input_list)

            return types.Message(message=message_for_printing)

        except Exception as e:
            # Log the exception
            logger.error(f"Failed to get response from OpenAI: {e}")

            # Return a default error message to the client
            return types.Message(message="Sorry, there was an error processing your request.")

