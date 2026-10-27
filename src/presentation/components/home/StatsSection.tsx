import { HOME_STATS } from "@/lib/constants";

export function StatsSection() {
  return (
    <section aria-labelledby="why-join" className="mx-auto w-full max-w-360 px-4 py-12 md:px-8 lg:px-14">
      <h2 id="why-join" className="text-center font-display text-display-sm font-semibold text-brand-primary">
        Why Join?
      </h2>
      <ul className="mt-12 grid gap-10 text-center md:grid-cols-3">
        {HOME_STATS.map((stat) => (
          <li key={stat.label} className="mx-auto flex max-w-60 flex-col gap-3">
            <span className="font-display text-display-sm font-semibold text-brand-primary">{stat.value}</span>
            <span className="text-xl text-brand-primary">{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
