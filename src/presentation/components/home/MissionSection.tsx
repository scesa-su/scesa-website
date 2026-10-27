export function MissionSection() {
  return (
    <section aria-label="Our mission" className="mx-auto w-full max-w-360 px-4 py-12 text-center md:px-8 lg:px-14">
      <p className="text-xl text-brand-primary">
        The official digital home of the{" "}
        <span className="font-semibold text-brand-accent">
          Strathmore Computing and Engineering Students Association.
        </span>
      </p>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
        We bridge the gap between classroom theory and real-world engineering.
      </p>
      <hr className="mx-auto mt-14 max-w-300 border-brand-border" />
    </section>
  );
}
