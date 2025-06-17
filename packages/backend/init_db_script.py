import asyncio
import sys
from pathlib import Path

# Add the src directory to Python path
current_dir = Path(__file__).parent.absolute()
sys.path.append(str(current_dir))

from src.database.init_db import init_db

async def main():
    print("Initializing database...")
    await init_db()
    print("Database initialized successfully!")

if __name__ == "__main__":
    asyncio.run(main()) 