import fs from "fs";
import path from "path";

const ROOTS = [
  "./apps",
  "./packages"
];

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      if (["node_modules", "dist", ".turbo"].includes(file)) continue;
      walk(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fixFile(fullPath);
    }
  }
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  // 🔥 CONVERSÃO DE CAMINHOS RELATIVOS → ALIAS
  content = content
    .replace(/(\.\.\/)+modules\//g, "@modules/")
    .replace(/(\.\.\/)+shared\//g, "@shared/")
    .replace(/(\.\.\/)+config\//g, "@config/")
    .replace(/(\.\.\/)+infra\//g, "@infra/");

  // 🔥 GARANTE EXTENSÃO .js (NodeNext)
  content = content.replace(
    /from\s+['"](@[^'"]+)(?<!\.js)['"]/g,
    (match, p1) => `from "${p1}.js"`
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log("✔ atualizado:", filePath);
  }
}

// 🚀 EXECUTA
for (const root of ROOTS) {
  walk(root);
}

console.log("\n🔥 TODOS OS IMPORTS FORAM CORRIGIDOS!");