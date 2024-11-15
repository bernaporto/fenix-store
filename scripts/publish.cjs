/* eslint-disable */
const { execSync } = require('child_process');
const { join } = require('path');
const { mkdirSync, writeFileSync, unlinkSync } = require('fs');

// Read the original package.json
const packageJson = require('../package.json');

// Create a new package.json with only the desired fields
const newPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  author: packageJson.author,
  main: packageJson.main,
  module: packageJson.module,
  types: packageJson.types,
  files: packageJson.files,
  license: packageJson.license,
};

const tempDir = join(process.cwd(), 'temp');
mkdirSync(tempDir);
const tempFilepath = join(tempDir, 'package.json');

// Write the new package.json to a temporary file
writeFileSync(tempFilepath, JSON.stringify(newPackageJson, null, 2));

// Run npm publish with the temporary package.json
execSync(`npm publish --package-lock-only ${tempDir} --access public`);

// Clean up the temporary package.json
unlinkSync(tempFilepath);
