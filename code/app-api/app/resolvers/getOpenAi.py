import strawberry
import logging
from openai import OpenAI
from .. import types
from ..auth import IsAuthenticated


logger = logging.getLogger(__name__)

# Ensure you have set your OpenAI API key in your environment variables or another secure method
api_key = ''

@strawberry.type
class Query:
    @strawberry.field(permission_classes=[IsAuthenticated])
    def getOpenAi(self, prompt: str) -> types.Message:
        try:
            # Send the prompt to OpenAI and get the response
            client = OpenAI(api_key=api_key)

            response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150  # Adjust this as needed
            )

            # Extract the generated message from the response
            generated_message = response.choices[0].message.content

            # Log the successful response
            logger.info(f"OpenAI response: {generated_message}")

            # Return the message as a types.Message object
            return types.Message(message=generated_message)

        except Exception as e:
            # Log the exception
            logger.error(f"Failed to get response from OpenAI: {e}")

            # Return a default error message to the client
            return types.Message(message="Sorry, there was an error processing your request.")

