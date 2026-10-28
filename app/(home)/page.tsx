import Link from 'next/link';
import { docsPath, githubUrl, siteName } from '@/lib/shared';
import { source } from '@/lib/source';

export default function Home() {
  const intro = source.getPage(['introduction']);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 py-16 text-center md:py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{siteName}</h1>
      {intro?.data.description && (
        <p className="mt-4 max-w-2xl text-lg text-fd-muted-foreground">{intro.data.description}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`${docsPath}/quickstart`}
          className="rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground"
        >
          Get started
        </Link>
        <Link href={`${docsPath}/introduction`} className="rounded-lg border px-5 py-2.5 text-sm font-medium">
          Read the docs
        </Link>
        {githubUrl && (
          <a href={githubUrl} className="rounded-lg border px-5 py-2.5 text-sm font-medium">
            GitHub
          </a>
        )}
      </div>
      <img
        src={`${docsPath}/images/workbench/hero.svg`}
        alt="Debugging a plan in the Dive workbench"
        className="mt-12 w-full rounded-xl border"
      />
    </main>
  );
}
