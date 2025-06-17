# Start the backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd packages/backend; .\venv\Scripts\activate; python start_server.py"

# Start the frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd packages/web; npm run dev" 