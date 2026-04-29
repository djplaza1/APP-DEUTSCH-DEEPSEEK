const fs = require('fs');
const babel = require('@babel/core');

const CHUNKS = [
  "src/a-core.jsx",
  "src/hooks/useEscritura.js",
  "src/features/ruta/ruta-panel.jsx",
  "src/b-app1.jsx",
  "src/b-app2.jsx",
  "src/c-extra.jsx"
];

console.log("Iniciando build...");

let code = "";
for (const file of CHUNKS) {
  console.log("Leyendo: " + file);
  if (!fs.existsSync(file)) {
    console.error("ERROR: No existe " + file);
    process.exit(1);
  }
  code += fs.readFileSync(file, "utf8").trim() + "\n";
}

console.log("Compilando con Babel...");
try {
  const result = babel.transformSync(code, {
    presets: [["@babel/preset-env", { modules: false }], "@babel/preset-react"],
    compact: true,
    comments: false,
    minified: true
  });

  if (!fs.existsSync("dist")) fs.mkdirSync("dist");
  fs.writeFileSync("dist/app.js", result.code);
  console.log("Build completo -> dist/app.js");
} catch (e) {
  console.error("ERROR DE BABEL:", e.message);
  if (e.reasonCode) console.error("Reason:", e.reasonCode);
  if (e.loc) console.error("Linea:", e.loc.line, "Columna:", e.loc.column);
  process.exit(1);
}
