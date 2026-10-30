import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
import { accessTokenFrom, canEdit, keystaticEnabled } from "@/lib/keystatic";

// Built on the first request: in production makeRouteHandler throws when the GitHub app secrets are missing.
let handler: ReturnType<typeof makeRouteHandler> | undefined;

async function handle(request: Request) {
  if (!keystaticEnabled()) return new Response("Not found", { status: 404 });
  try {
    handler ??= makeRouteHandler({ config });
    const response = await handler[request.method === "POST" ? "POST" : "GET"](request);
    // Sign-in and token refresh hand out session cookies; drop them unless the account can push to the repo.
    if (/\/github\/(oauth\/callback|refresh-token)$/.test(new URL(request.url).pathname)) {
      const token = accessTokenFrom(response.headers.getSetCookie());
      if (token && !(await canEdit(token))) {
        return new Response(
          "Only SCESA editors can use the content editor. Ask the site owner to add your GitHub account to the scesa-su editors team.",
          { status: 403 },
        );
      }
    }
    return response;
  } catch (error) {
    console.error("Keystatic API error", error);
    return new Response("The content editor could not complete that request. Try again, or ask the site owner.", { status: 500 });
  }
}

export { handle as GET, handle as POST };
