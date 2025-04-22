const express = require("express");
const cors = require("cors");
const path = require("path");
const runcodeRouter = require("./utils/runcode");
const { marked } = require("marked");
const sanitizeHtml = require("sanitize-html");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, "../public")));

// Routes pour l'exécution de code
app.use("/", runcodeRouter);

// Configuration de marked pour une sortie sécurisée
marked.setOptions({
  headerIds: false,
  mangle: false,
});

// Endpoint pour la conversion Markdown
app.post("/api/preview/markdown", (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Contenu manquant" });
    }

    // Convertir le Markdown en HTML
    const rawHtml = marked(content);

    // Nettoyer le HTML pour la sécurité
    const cleanHtml = sanitizeHtml(rawHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "title"],
      },
    });

    res.json({ html: cleanHtml });
  } catch (error) {
    console.error("Erreur lors de la conversion du Markdown:", error);
    res.status(500).json({ error: "Erreur lors de la conversion du Markdown" });
  }
});

// Route de test
app.get("/test", (req, res) => {
  res.json({ message: "Le serveur fonctionne correctement!" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
