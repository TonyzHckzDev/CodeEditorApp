const axios = require("axios");

const API_URL = "http://localhost:3000";

async function testPythonEndpoint() {
  try {
    console.log("Test de l'endpoint Python...");
    const response = await axios.post(`${API_URL}/run/python`, {
      code: 'print("Hello from Python!")',
    });
    console.log("Résultat Python:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur Python:", error.message);
    return null;
  }
}

async function testJavaEndpoint() {
  try {
    console.log("Test de l'endpoint Java...");
    const response = await axios.post(`${API_URL}/run/java`, {
      code: 'System.out.println("Hello from Java!");',
    });
    console.log("Résultat Java:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur Java:", error.message);
    return null;
  }
}

async function runTests() {
  console.log("Démarrage des tests...");
  await testPythonEndpoint();
  await testJavaEndpoint();
  console.log("Tests terminés.");
}

runTests();
