/**
 * Combined Provider Proof
 *
 * Runs the direct verification for both Groq and Gemini independently.
 */
import { spawn } from "child_process";

async function runTest(scriptPath: string, name: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`\n======================================================`);
    console.log(` RUNNING ${name} TEST`);
    console.log(`======================================================\n`);
    
    const child = spawn("npx", ["tsx", scriptPath], { stdio: "inherit", shell: true });
    
    child.on("close", (code) => {
      resolve(code === 0);
    });
  });
}

async function main() {
  const groqPass = await runTest("scripts/ai/test-groq-direct.ts", "GROQ");
  const geminiPass = await runTest("scripts/ai/test-gemini-direct.ts", "GEMINI");
  
  console.log(`\n======================================================`);
  console.log(` COMBINED PROVIDER PROOF VERDICT`);
  console.log(`======================================================\n`);
  console.log(`GROQ TEST   : ${groqPass ? "PASS ✓" : "FAIL ✗"}`);
  console.log(`GEMINI TEST : ${geminiPass ? "PASS ✓" : "FAIL ✗"}`);
  
  const overall = groqPass && geminiPass;
  console.log(`\nOVERALL     : ${overall ? "PASS ✓" : "FAIL ✗"}`);
  
  process.exit(overall ? 0 : 1);
}

main().catch((err) => {
  console.error("Combined test failed:", err);
  process.exit(1);
});
