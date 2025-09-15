// Temporary workaround to launch Next.js
import { exec } from 'child_process';

console.log('Starting Next.js development server...');

const nextProcess = exec('next dev', { cwd: process.cwd() });

nextProcess.stdout?.on('data', (data) => {
  console.log(data.toString());
});

nextProcess.stderr?.on('data', (data) => {
  console.error(data.toString());
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});

process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit(0);
});