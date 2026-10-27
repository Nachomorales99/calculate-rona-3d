import { Link } from "react-router";
import { SectionHeader } from "@/components/ui";
import { POSTS } from "@/content/posts";
import { formatShortDate } from "@/lib/dates";
import { useHoverLift, useReveal } from "@/lib/motion";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Component() {
  useDocumentTitle("Blog");
  const lift = useHoverLift<HTMLDivElement>("[data-post]");
  const list = useReveal<HTMLDivElement>();
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div ref={lift} className="py-10">
      <SectionHeader
        as="h1"
        title="Lo que aprendemos"
        text="Notas cortas del taller: materiales, fallas, precios y trucos del laminador."
      />
      <div ref={list} className="grid gap-4 md:grid-cols-2">
        {sorted.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            data-post
            className="grid gap-2 rounded-lg border border-line bg-surface p-5 text-inherit no-underline transition-[box-shadow,border-color] duration-150 hover:border-ink hover:shadow-hard-lg"
          >
            <span className="text-xs font-bold tracking-[0.08em] text-muted uppercase">
              {p.category} · {p.minutes} min · {formatShortDate(p.date)}
            </span>
            <h2 className="text-[1.35rem]">{p.title}</h2>
            <p className="text-sm text-muted">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
