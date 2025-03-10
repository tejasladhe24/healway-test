import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Get the environment from the command-line arguments
const envType = process.argv[2];
if (!envType || !["local", "prod"].includes(envType)) {
  console.error("Usage: bun link-envs.ts <local|prod>");
  process.exit(1);
}

const envFile = `.env.${envType}`;
const envTypesFile = "env.d.ts";
const appsDir = path.join(__dirname, "apps");
const sourceEnvPath = path.join(__dirname, envFile);
const sourceEnvTypesPath = path.join(__dirname, envTypesFile);

// Check if the specified env file exists at the root
if (!fs.existsSync(sourceEnvPath)) {
  console.error(`Environment file ${envFile} does not exist at the root.`);
  process.exit(1);
}

// Generate env.d.ts using gen-env-types
try {
  execSync(`npx gen-env-types ${envFile}`, { stdio: "inherit" });
} catch (error) {
  console.error("Failed to generate env.d.ts:", error);
  process.exit(1);
}

// Ensure env.d.ts was created
if (!fs.existsSync(sourceEnvTypesPath)) {
  console.error("Failed to find generated env.d.ts at the root.");
  process.exit(1);
}

// Get all apps inside the apps/ directory
const apps = fs.readdirSync(appsDir).filter((app) => {
  const appPath = path.join(appsDir, app);
  return fs.statSync(appPath).isDirectory();
});

// Link both .env and env.d.ts to each app directory
apps.forEach((app) => {
  const appPath = path.join(appsDir, app);
  const envDestination = path.join(appPath, ".env");
  const envTypesDestination = path.join(appPath, "env.d.ts");

  try {
    // Remove existing symlink if it exists
    if (fs.existsSync(envDestination)) {
      fs.unlinkSync(envDestination);
    }
    if (fs.existsSync(envTypesDestination)) {
      fs.unlinkSync(envTypesDestination);
    }

    // Create new symlinks
    fs.symlinkSync(sourceEnvPath, envDestination);
    fs.symlinkSync(sourceEnvTypesPath, envTypesDestination);

    console.log(`Linked ${envFile} -> ${envDestination}`);
    console.log(`Linked ${envTypesFile} -> ${envTypesDestination}`);
  } catch (err) {
    console.error(`Failed to link files for ${app}: ${err}`);
  }
});
