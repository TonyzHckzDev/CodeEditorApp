// runcode.js - Express routes pour exécuter du code Python et Java

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Helper pour exécuter une commande et capturer la sortie
function runCommand(command, options = {}) {
  return new Promise((resolve) => {
    exec(command, options, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}

// Endpoint pour exécuter du code Python
router.post("/run/python", async (req, res) => {
  const { code } = req.body;
  const filename = `script_${Date.now()}.py`;
  const filepath = path.join(__dirname, filename);

  // Écriture du fichier Python
  fs.writeFileSync(filepath, code, "utf8");

  // Exécution avec timeout 5s
  const { error, stdout, stderr } = await runCommand(`python3 ${filepath}`, {
    timeout: 5000,
  });

  // Suppression du fichier temporaire
  fs.unlinkSync(filepath);

  // Envoi de la réponse
  res.json({
    output: stdout.trim(),
    error: stderr.trim() || (error ? error.message : ""),
  });
});

// Endpoint pour exécuter du code Java
router.post("/run/java", async (req, res) => {
  const { code } = req.body;
  const className = "Main";
  const tmpDir = path.join(__dirname, `tmp_${Date.now()}`);
  fs.mkdirSync(tmpDir);

  // Wrapping du code dans une classe Main
  const javaFile = path.join(tmpDir, `${className}.java`);
  const fullCode = `public class ${className} {
    public static void main(String[] args) {
      ${code}
    }
  }`;
  fs.writeFileSync(javaFile, fullCode, "utf8");

  // Compilation
  let result = await runCommand(`javac ${className}.java`, {
    cwd: tmpDir,
    timeout: 5000,
  });
  if (result.stderr || result.error) {
    // Erreur de compilation
    fs.rmSync(tmpDir, { recursive: true, force: true });
    return res.json({
      output: "",
      error: result.stderr || result.error.message,
    });
  }

  // Exécution
  result = await runCommand(`java -cp . ${className}`, {
    cwd: tmpDir,
    timeout: 5000,
  });

  // Nettoyage
  fs.rmSync(tmpDir, { recursive: true, force: true });

  // Réponse
  res.json({
    output: result.stdout.trim(),
    error: result.stderr.trim() || (result.error ? result.error.message : ""),
  });
});

module.exports = router;
