export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Hardcode for now to ensure it works
  professorPassword: process.env.PROFESSOR_PASSWORD || "profesor2026",
};

// Debug: log whether password is configured (without revealing the value)
console.log("[ENV] PROFESSOR_PASSWORD:", ENV.professorPassword ? "configured" : "using default");
