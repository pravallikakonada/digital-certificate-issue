import { execSync } from 'child_process';
import { platform } from 'os';

const ports = [3000, 5173, 5174, 5175, 5176, 5177, 5178];

console.log('🔍 Checking for processes using common dev ports...');

ports.forEach(port => {
  try {
    // Check if port is in use
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const lines = output.trim().split('\n');

    lines.forEach(line => {
      if (line.includes(`:${port}`) && line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];

        console.log(`📍 Port ${port} is in use by process ${pid}`);
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
          console.log(`✅ Killed process ${pid} using port ${port}`);
        } catch (killError) {
          console.log(`❌ Failed to kill process ${pid}: ${killError.message}`);
        }
      }
    });
  } catch (error) {
    // Port is not in use, which is fine
  }
});

console.log('🎉 Port cleanup completed!');