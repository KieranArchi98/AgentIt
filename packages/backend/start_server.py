import os
import sys
import uvicorn
from pathlib import Path

# Get the absolute path of the current file
current_dir = Path(__file__).parent.absolute()

# Add the current directory to the Python path
sys.path.append(str(current_dir))

if __name__ == "__main__":
    # Change to the backend directory
    os.chdir(current_dir)
    # Start the server
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True) 