import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

if (!process.env.PORT) {
  process.env.PORT = "3001";
}

await import("../.next/standalone/server.js");
