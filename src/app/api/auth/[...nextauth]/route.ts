import { handlers } from "@/auth";
// all the req to "/api/auth" will be caught here
// and will be handled by the handlers defined in our "auth.ts file"
export const { GET, POST } = handlers;
