import { spawn } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('.env') });

function run(args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['vercel', ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => {
      out += d.toString();
    });
    child.stderr.on('data', (d) => {
      err += d.toString();
    });
    child.on('close', (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(err || out || `exit ${code}`));
    });
    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
}

const key = process.env.GEMINI_API_KEY?.trim();
if (!key) {
  console.error('GEMINI_API_KEY missing in .env');
  process.exit(1);
}

const targets = ['production', 'preview', 'development'];
for (const target of targets) {
  try {
    await run(['env', 'rm', 'GEMINI_API_KEY', target, '--yes']);
  } catch {
    // variable may not exist yet
  }
  await run(['env', 'add', 'GEMINI_API_KEY', target], key);
  console.log(`GEMINI_API_KEY set for ${target}`);
}
