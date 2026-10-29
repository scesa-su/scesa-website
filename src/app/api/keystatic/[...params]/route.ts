import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
import { keystaticEnabled } from "@/lib/keystatic";

// Built on the first request: in production makeRouteHandler throws when the GitHub app secrets are missing.
let handler: ReturnType<typeof makeRouteHandler> | undefined;

async function handle(request: Request) {
  if (!keystaticEnabled()) return new Response("Not found", { status: 404 });
  try {
    handler ??= makeRouteHandler({ config });
    return await handler[request.method === "POST" ? "POST" : "GET"](request);
  } catch (error) {
    console.error("Keystatic API error", error);
    return new Response("The content editor could not complete that request. Try again, or ask the site owner.", { status: 500 });
  }
}

export { handle as GET, handle as POST };
