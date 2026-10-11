// Reads the same confirmed content as the website. Requires Python reportlab.
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/data/portfolio.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const data = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const temp = mkdtempSync(join(tmpdir(), "rohit-resume-"));
try {
  const input = join(temp, "content.json");
  writeFileSync(input, JSON.stringify(data));
  const result = spawnSync(
    "python3",
    [
      new URL("./prepare-resume.py", import.meta.url).pathname,
      input,
      process.argv[2] ?? "output/pdf/rohit-sonawane-resume-review.pdf",
    ],
    { stdio: "inherit" },
  );
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(temp, { recursive: true });
}
