import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://enj-311bb18d292c.herokuapp.com",
});