import fs from "fs";
import path from "path";
import inquirer from "inquirer";

// Load package.json
const packageJsonPath = path.resolve("package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

// Function to increment version
function incrementVersion(version, type) {
  const versionParts = version.split(".").map(Number);

  switch (type) {
    case "major":
      versionParts[0]++;
      versionParts[1] = 0; // Reset minor
      versionParts[2] = 0; // Reset patch
      break;
    case "minor":
      versionParts[1]++;
      versionParts[2] = 0; // Reset patch
      break;
    case "patch":
      versionParts[2]++;
      break;
    default:
      throw new Error("Invalid version type.");
  }

  return versionParts.join(".");
}

// Function to prompt for version change type
async function promptForVersionChange() {
  const questions = [
    {
      type: "list",
      name: "versionType",
      message: "Select the type of version change:",
      choices: [
        { name: "No change", value: null },
        { name: "Patch (x.x.1)", value: "patch" },
        { name: "Minor (x.1.x)", value: "minor" },
        { name: "Major (1.x.x)", value: "major" },
      ],
    },
  ];
  return inquirer.prompt(questions);
}

async function main() {
  // Prompt the user for the version change type
  const { versionType } = await promptForVersionChange();

  if (!versionType) {
    console.log("No version change made.");
    return;
  }

  // Log the current version before updating
  console.log("Current version in package.json:", packageJson.version);

  // Update the version dynamically
  const newVersion = incrementVersion(packageJson.version, versionType);
  packageJson.version = newVersion;

  // Write the updated package.json back to the file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Log the updated version
  console.log("Updated version in package.json:", packageJson.version);

  // Update the controller.js file
  const controllerPath = path.resolve("controller.js");
  let controllerContent = fs.readFileSync(controllerPath, "utf-8");

  // Replace the existing POS_VERSION
  const updatedContent = controllerContent.replace(
    /POS_VERSION: "(\d+\.\d+\.\d+)"/,
    `POS_VERSION: "${packageJson.version}"`
  );

  // Write the updated controller.js back
  fs.writeFileSync(controllerPath, updatedContent);

  console.log("Updated version in controller.js:", packageJson.version);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
