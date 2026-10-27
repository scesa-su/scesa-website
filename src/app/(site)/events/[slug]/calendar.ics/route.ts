import { eventRepository } from "@/data/repositories/EventRepository";
import { SITE_URL } from "@/lib/constants";
import { buildIcs } from "@/lib/ics";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await eventRepository.getAll()).filter((e) => e.status !== "completed").map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, ctx: RouteContext<"/events/[slug]/calendar.ics">) {
  try {
    const { slug } = await ctx.params;
    const event = await eventRepository.getBySlug(slug);
    if (!event) return new Response("Event not found", { status: 404 });
    return new Response(buildIcs(event, `${SITE_URL}/events/${slug}`), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}.ics"`,
      },
    });
  } catch {
    return new Response("Could not build the calendar file", { status: 500 });
  }
}
