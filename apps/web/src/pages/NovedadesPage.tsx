import { Link } from "react-router";
import { Pill, SectionHeader } from "@/components/ui";
import { NEWS } from "@/content/news";
import { formatShortDate } from "@/lib/dates";
import { useReveal } from "@/lib/motion";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Component() {
  useDocumentTitle("Novedades");
  const list = useReveal<HTMLUListElement>();
  return (
    <div className="py-10">
      <SectionHeader
        as="h1"
        title="Novedades"
        text="Lo que va pasando en el taller y en la plataforma, de más nuevo a más viejo."
      />
      <ul ref={list} className="border-t border-line">
        {NEWS.map((n) => (
          <li key={n.date + n.title} className="border-b border-line">
            <Link
              to={n.href ?? "/novedades"}
              className="grid items-baseline gap-1 py-4 text-inherit no-underline sm:grid-cols-[7.5rem_1fr_auto] sm:gap-4 [&:hover_b]:text-accent"
            >
              <time dateTime={n.date} className="tabular text-[0.82rem] text-muted">
                {formatShortDate(n.date)}
              </time>
              <span>
                <b className="font-semibold">{n.title}</b>
                {n.body ? <span className="mt-1 block text-sm text-muted">{n.body}</span> : null}
              </span>
              <Pill tone="soon" className="justify-self-start border-solid text-muted">
                {n.tag}
              </Pill>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
