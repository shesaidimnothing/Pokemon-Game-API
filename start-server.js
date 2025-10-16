// Simple server starter with different port
const { spawn } = require('child_process');
const path = require('path');

// Set port to 3001 to avoid conflicts
process.env.PORT = '3001';

console.log('🚀 Starting Pokémon Game API on port 3001...');
console.log('🌐 Frontend will be available at: http://localhost:3001');
console.log('📚 API documentation at: http://localhost:3001');

const server = spawn('npx', ['ts-node', 'src/index.ts'], {
    cwd: path.join(__dirname),
    stdio: 'inherit',
    env: { ...process.env, PORT: '3001' }
});

server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
});

server.on('error', (err) => {
    console.error('Failed to start server:', err);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
});
