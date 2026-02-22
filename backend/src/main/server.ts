// CAMINHO COMPLETO: backend/src/main/server.ts
import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});