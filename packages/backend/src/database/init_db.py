from sqlalchemy.ext.asyncio import AsyncSession
from ..models.database import Base, Forum
from .database import engine

async def init_db():
    """Initialize the database with tables and initial data"""
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    # Create initial forums
    async with AsyncSession(engine) as session:
        forums = [
            Forum(
                id="technology",
                name="Technology",
                description="Discuss the latest in tech and programming"
            ),
            Forum(
                id="gaming",
                name="Gaming",
                description="Gaming news and discussions"
            ),
            Forum(
                id="science",
                name="Science",
                description="Scientific discoveries and debates"
            ),
            Forum(
                id="movies",
                name="Movies",
                description="Film discussions and reviews"
            )
        ]
        
        session.add_all(forums)
        await session.commit() 