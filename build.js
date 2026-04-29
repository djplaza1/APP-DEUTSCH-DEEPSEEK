const fs = require("fs");
const babel = require("@babel/core");

const CHUNKS = [
  "src/a-core.jsx",
  "src/hooks/useOnboarding.js",
  "src/hooks/useHistoriaAudioOnly.js",
  "src/hooks/useEscritura.js",
  "src/hooks/usePdfStudy.js",
  "src/features/ruta/ruta-panel.jsx",
  "src/b-app1.jsx",
  "src/b-app2.jsx",
  "src/c-extra.jsx"
];

let code = "";
for (const file of CHUNKS) {
  if (!fs.existsSync(file)) throw new Error("Missing: " + file);
  code += fs.readFileSync(file, "utf8").trim() + "\n";
}

const result = babel.transformSync(code, {
  presets: [["@babel/preset-env", { modules: false }], "@babel/preset-react"],
  compact: true,
  comments: false,
  minified: true
});
fs.writeFileSync("dist/app.js", result.code);
console.log("? Build completo -> dist/app.js");

