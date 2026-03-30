#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const argv = process.argv.slice(2);
const projectName = argv[0];

if (!projectName) {
  console.error('Usage: npx create-nest-fastify-app <project-name>');
  process.exit(1);
}

if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
  console.error(
    'Project name can only contain letters, numbers, dash, and underscore.',
  );
  process.exit(1);
}

const sourceRoot = path.resolve(__dirname, '..');
const targetRoot = path.resolve(process.cwd(), projectName);

if (fs.existsSync(targetRoot) && fs.readdirSync(targetRoot).length > 0) {
  console.error(
    `Target directory already exists and is not empty: ${targetRoot}`,
  );
  process.exit(1);
}

const IGNORE = new Set([
  '.git',
  'node_modules',
  'dist',
  '.vercel',
  'coverage',
  'bin',
  '.DS_Store',
  'npm-debug.log',
]);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    ensureDir(dest);

    for (const entry of fs.readdirSync(src)) {
      if (IGNORE.has(entry)) {
        continue;
      }

      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }

    return;
  }

  fs.copyFileSync(src, dest);
}

ensureDir(targetRoot);
copyRecursive(sourceRoot, targetRoot);

const packageJsonPath = path.join(targetRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkg.name = projectName.toLowerCase();
  pkg.private = true;
  delete pkg.bin;
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(pkg, null, 2)}\n`,
    'utf8',
  );
}

console.log('Project generated successfully.');
console.log('');
console.log(`Next steps:`);
console.log(`  cd ${projectName}`);
console.log('  npm install');
console.log('  cp .env.example .env');
console.log('  npm run dev');
