@echo off
echo 🚀 Starting Pokémon Game API...
echo.
echo 📁 Changing to project directory...
cd /d "C:\Users\35g\Desktop\NowLedgeable\pokemon-game-api"

echo 🔧 Setting port to 3001...
set PORT=3001

echo 🎮 Starting server...
echo.
echo ✅ Server will be available at: http://localhost:3001
echo ✅ Press Ctrl+C to stop the server
echo.
npx ts-node src/index.ts

pause
