import createClient from "openapi-fetch";
import createQueryClient from "openapi-react-query";
import type { paths } from "../../openapi/types.js";

const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

export const $api = createQueryClient(client);
