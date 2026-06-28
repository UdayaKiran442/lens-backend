import * as dotenv from "dotenv";

// Determine the current environment
const environment = process.env.NODE_ENV;

if (environment === "development") {
    dotenv.config({path: "../../.env.development"});
}
else {
    dotenv.config({path: "../../.env.production"});
}

export const ActiveConfig = {
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    ENVIRONMENT: process.env.ENVIRONMENT ?? "development"
}