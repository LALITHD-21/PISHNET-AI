if (!process.env.PORT) {
  process.env.PORT = "3001";
}

await import("../.next/standalone/server.js");
