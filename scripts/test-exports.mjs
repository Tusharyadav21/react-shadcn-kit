import { execSync } from "child_process";
import { mkdirSync, writeFileSync, rmSync, readFileSync, readdirSync, existsSync } from "fs";
import { resolve, join, basename, extname } from "path";

const testDir = "./test-exports-validation";
const packageJsonPath = resolve("package.json");

// Sanity check imports
const manualTestImports = [
  "import { Button } from 'react-shadcn-kit/atoms'",
  "import { Card } from 'react-shadcn-kit/atoms'",
  "import { AppNavbar } from 'react-shadcn-kit/organisms'",
  "import DefaultLayout from 'react-shadcn-kit/default-layout'",
  "import { useIsMobile } from 'react-shadcn-kit/hooks'",
  "import { cn } from 'react-shadcn-kit/lib'",
];

try {
  console.log("📦 Building package...");
  execSync("npm run build", { stdio: "inherit" });

  console.log("📦 Packing package...");
  execSync("npm pack", { stdio: "inherit" });

  console.log("🧪 Creating test environment...");
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
  }
  mkdirSync(testDir, { recursive: true });

  const originalCwd = process.cwd();
  process.chdir(testDir);

  // Initialize test project
  execSync("npm init -y", { stdio: "pipe" });

  // Install the packed package
  const packFile = execSync(`ls ${join(originalCwd, "*.tgz")}`)
    .toString()
    .trim();
  console.log(`📥 Installing ${packFile}...`);
  execSync(`npm install ${packFile}`, { stdio: "inherit" });

  // Read package.json to find exports
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  const exports = pkg.exports || {};

  const allTestImports = [...manualTestImports];

  console.log("\n🔍 Discovering exported components...");

  // Helper to find files in the installed package
  const installedPkgPath = resolve("node_modules/react-shadcn-kit");

  for (const [exportPath, exportConfig] of Object.entries(exports)) {
    if (exportPath === ".") continue; // Skip root export for now, tested via manual imports if needed
    if (exportPath === "./package.json") continue; // Skip package.json export

    // Direct export
    const subpath = exportPath.substring(1); // Remove leading .
    if (manualTestImports.some((i) => i.includes(`'react-shadcn-kit${subpath}'`))) continue;

    const safeName = subpath.replace(/[\/\.-]/g, "_");
    allTestImports.push(`import * as ${safeName} from 'react-shadcn-kit${subpath}'`);
  }

  console.log(`\n🧪 Testing ${allTestImports.length} import patterns...\n`);

  let failures = 0;

  for (const importStatement of allTestImports) {
    const testFile = "test-import.mjs";
    // We add a console log to verify the import actually executed
    writeFileSync(
      testFile,
      `${importStatement};\nconsole.log("✅ Verified: ${importStatement.replace(/"/g, "'")}");`,
    );

    try {
      execSync(`node ${testFile}`, { stdio: "pipe" });
      console.log(`✅ Success: ${importStatement}`);
    } catch (error) {
      failures++;
      const msg = error.message || error.toString();

      if (msg.includes("ERR_PACKAGE_PATH_NOT_EXPORTED")) {
        console.error(`❌ FAILED: ${importStatement} - Export map failure!`);
      } else if (msg.includes("Cannot find module")) {
        console.error(`❌ FAILED: ${importStatement} - Module not found!`);
      } else {
        console.error(`❌ FAILED: ${importStatement}`);
        console.error(`   Error: ${msg}`);
      }
    }
  }

  if (failures > 0) {
    console.error(`\n❌ ${failures} tests failed.`);
    process.exit(1);
  } else {
    console.log("\n✅ All export validations passed successfully.\n");
  }
} catch (error) {
  console.error("\n❌ Test failed:", error.message);
  process.exit(1);
} finally {
  // Cleanup
  try {
    if (process.cwd().endsWith("test-exports-validation")) {
      process.chdir("..");
    }
    rmSync(testDir, { recursive: true, force: true });

    const packFiles = execSync("ls *.tgz 2>/dev/null").toString().trim().split("\n");
    packFiles.forEach((file) => {
      if (file) rmSync(file, { force: true });
    });
  } catch {}
}
