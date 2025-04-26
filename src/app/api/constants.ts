export const API_HOST = "https://prt-tracker-zing.deno.dev"
export const API_KEY = process.env.API_KEY;
  
if (!API_HOST) {
    throw new Error("API_HOST not set");
}

if (!API_KEY) {
    throw new Error("API_KEY not set");
}