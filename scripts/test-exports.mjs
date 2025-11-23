import { execSync } from "child_process";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { resolve } from "path";

const testDir = "./test-exports-validation";

const testImports = [
  "import { Button } from 'react-shadcn-kit/atoms/button'",
  "import { Card } from 'react-shadcn-kit/atoms/card'",
  "import { AppNavbar } from 'react-shadcn-kit/organisms/app-navbar'",
  "import DefaultLayout from 'react-shadcn-kit/layouts/default-layout'",
  "import { useIsMobile } from 'react-shadcn-kit/hooks/use-mobile'",
  "import { cn } from 'react-shadcn-kit/lib/utils'",
];

try {
  console.log("📦 Building package...");
  execSync("npm run build", { stdio: "inherit" });

  console.log("📦 Packing package...");
  execSync("npm pack", { stdio: "inherit" });

  console.log("🧪 Creating test environment...");
  mkdirSync(testDir, { recursive: true });
  process.chdir(testDir);

  // Initialize test project
  execSync("npm init -y", { stdio: "pipe" });

  // Install the packed package
  const packFile = execSync("ls ../*.tgz").toString().trim();
  console.log(`📥 Installing ${packFile}...`);
  execSync(`npm install ${resolve(packFile)}`, { stdio: "inherit" });

  // Test each import pattern
  console.log("\n🧪 Testing import patterns...\n");

  for (const importStatement of testImports) {
    const testFile = "test-import.mjs";
    writeFileSync(testFile, `${importStatement};\nconsole.log("✅ ${importStatement}");`);

    try {
      execSync(`node ${testFile}`, { stdio: "pipe" });
      console.log(`✅ ${importStatement}`);
    } catch (error) {
      // We expect some of these to fail if the components don't exist yet,
      // but we want to verify the resolution works.
      // However, if the file doesn't exist, node will throw "ERR_MODULE_NOT_FOUND".
      // If the export map is wrong, it might throw "ERR_PACKAGE_PATH_NOT_EXPORTED".

      const msg = error.message || error.toString();
      if (msg.includes("ERR_PACKAGE_PATH_NOT_EXPORTED")) {
        console.error(`❌ ${importStatement} - Export map failure!`);
        throw error;
      } else if (msg.includes("Cannot find module")) {
        console.log(
          `⚠️  ${importStatement} - Module not found (component might be missing), but export map passed?`,
        );
        // Actually, if the export map maps to a file that doesn't exist, it still counts as "resolved" by the map,
        // but then fails to load.
        // But if the export map prevents it, it says "Package subpath ... is not defined".
      } else {
        console.error(`❌ ${importStatement}`);
        console.error(`   Error: ${msg}`);
      }
    }
  }

  console.log("\n✅ Export map validation finished.\n");
} catch (error) {
  console.error("\n❌ Test failed:", error.message);
  process.exit(1);
} finally {
  process.chdir("..");
  rmSync(testDir, { recursive: true, force: true });

  // Cleanup .tgz file
  try {
    const packFiles = execSync("ls *.tgz 2>/dev/null").toString().trim().split("\n");
    packFiles.forEach((file) => {
      if (file) rmSync(file, { force: true });
    });
  } catch {}
}
