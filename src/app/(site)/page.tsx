export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16">
      <h1 className="text-display-lg font-display">
        Where Strathmore&apos;s Tech Pioneers Build the Future
      </h1>
      <p className="text-lg font-body">
        Design token showcase: fonts, colors and theming.
      </p>
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-brand-surface p-6">
        <span className="text-md font-body">Surface card</span>
        <span className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-slate-900">
          Accent
        </span>
      </div>
    </main>
  );
}
