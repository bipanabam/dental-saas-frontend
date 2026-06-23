import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: `${process.env.API_BASE_URL}/openapi.json`,

  output: "src/lib/api",

  plugins: [
    "@hey-api/client-fetch",
    "@tanstack/react-query"
  ]
});