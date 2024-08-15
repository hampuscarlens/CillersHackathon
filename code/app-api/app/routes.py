from fastapi import FastAPI, Request, APIRouter
import logging
from fastapi.middleware.cors import CORSMiddleware


# Import your existing modules
from . import graphql, init


logger = logging.getLogger(__name__)

#### Routes ####

app = FastAPI()



@app.on_event("startup")
async def reinit():
    init.init()

# Include the GraphQL router and the new text input router
app.include_router(graphql.get_app(), prefix="/api")

