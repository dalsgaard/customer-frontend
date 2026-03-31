import createClient from "openapi-fetch";
import type { paths } from "../../openapi/types.js";

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});
