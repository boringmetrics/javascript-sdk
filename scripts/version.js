#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the version type from command line arguments
const versionType = process.argv[2];

if (!versionType || !['patch', 'minor', 'major'].includes(versionType)) {
  console.error('Usage: node scripts/version.js [patch|minor|major]');
  process.exit(1);
}

const workspaces = ['core', 'browser', 'node'];
const rootPackageJsonPath = path.join(__dirname, '..', 'package.json');

console.log(`🚀 Bumping ${versionType} version for all packages...`);

try {
  // Get current root version
  const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
  const currentVersion = rootPackageJson.version;

  // Calculate new version
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  let newVersion;

  switch (versionType) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }

  console.log(`📦 Updating version from ${currentVersion} to ${newVersion}`);

  // Update workspace packages first
  for (const workspace of workspaces) {
    const workspacePath = path.join(__dirname, '..', 'packages', workspace);
    const packageJsonPath = path.join(workspacePath, 'package.json');

    console.log(`  ✨ Updating @boringmetrics/${workspace}...`);

    // Read, update, and write package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  }

  // Update root package.json
  console.log(`  ✨ Updating root package...`);
  rootPackageJson.version = newVersion;
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2) + '\n');

  console.log(`✅ Successfully bumped all packages to version ${newVersion}`);
  console.log(`📋 Next steps:`);
  console.log(`   - Review changes: git show HEAD`);
  console.log(`   - Push changes: git push origin main --tags`);
  console.log(`   - Publish packages: yarn publish:all`);
} catch (error) {
  console.error('❌ Error during versioning:', error.message);
  process.exit(1);
}
