export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-wider text-sky-300">
          Phase 1 setup complete
        </p>
        <h1 className="text-4xl font-semibold tracking-normal text-white">
          AkasGatha
        </h1>
        <p className="text-lg leading-8 text-slate-300">
          Ancient sky stories explained with modern space science.
        </p>
        <p className="max-w-2xl text-base leading-7 text-slate-400">
          This foundation page confirms the Next.js App Router, TypeScript, and
          Tailwind CSS setup. Full product UI, backend routes, LLM integration,
          and 3D scenes will be added in later phases.
        </p>
      </section>
    </main>
  );
}
