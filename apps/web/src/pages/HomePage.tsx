import { Link } from "react-router";
import { AppBox } from "@/components/AppBox";
import { PieceTile } from "@/components/PieceTile";
import { Button, Ficha, GroupLabel, Pill, SectionHeader } from "@/components/ui";
import { APPS, APP_GROUPS } from "@/content/apps";
import { NEWS } from "@/content/news";
import { PIECES } from "@/content/pieces";
import { POSTS } from "@/content/posts";
import { formatShortDate } from "@/lib/dates";
import { useGridStagger, useHeadline, useHoverLift, useReveal } from "@/lib/motion";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const HEADLINE = "Le damos volumen a lo que se te ocurra.";

export function Component() {
  useDocumentTitle();
  const headline = useHeadline<HTMLHeadingElement>();
  const heroSide = useReveal<HTMLDivElement>();
  const mosaic = useGridStagger<HTMLDivElement>(0.15);
  const news = useReveal<HTMLElement>();
  const apps = useHoverLift<HTMLElement>("[data-app-box]");
  const pieces = useHoverLift<HTMLElement>("figure");
  const posts = useHoverLift<HTMLElement>("[data-post]");
  const [featured, ...rest] = NEWS;

  return (
    <>
      <header className="grid items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Pill tone="eyebrow">
            <Ficha className="size-[1.1rem]" /> Taller de impresión 3D · Mendoza
          </Pill>
          <h1
            ref={headline}
            className="mt-4 mb-4 text-[clamp(2.5rem,5.6vw,4.4rem)] tracking-[-0.01em]"
          >
            {HEADLINE.split(" ").map((w, i) => (
              <span key={i} data-word className="inline-block">
                {w}
                {i < HEADLINE.split(" ").length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <div ref={heroSide} className="grid gap-6">
            <p className="max-w-[50ch] text-[1.12rem] text-muted">
              Rona 3D es el taller de impresión de RONA GAMES. Imprimimos piezas, contamos lo que
              aprendemos y vamos abriendo las herramientas que usamos todos los días para que las
              use cualquier maker.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button to="/piezas" variant="primary">
                Ver las piezas
              </Button>
              <Button to="/apps" variant="ghost">
                Explorar las apps →
              </Button>
            </div>
            <dl className="flex flex-wrap gap-6 text-sm text-muted">
              <div>
                <dt className="sr-only">Desde</dt>
                <dd>
                  <b className="mr-1 font-slab text-[1.1rem] font-normal text-ink">2024</b>desde
                </dd>
              </div>
              <div>
                <dt className="sr-only">Capas impresas</dt>
                <dd>
                  <b className="mr-1 font-slab text-[1.1rem] font-normal text-ink">1,2 M</b>capas
                  impresas
                </dd>
              </div>
              <div>
                <dt className="sr-only">Apps</dt>
                <dd>
                  <b className="mr-1 font-slab text-[1.1rem] font-normal text-ink">1</b>app online,
                  5 en camino
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div
          ref={mosaic}
          className="relative grid grid-cols-3 gap-3"
          aria-label="Piezas del taller"
        >
          <figure className="layers relative row-span-2 grid place-items-center overflow-hidden rounded-xl border border-plate-edge bg-plate text-plate-ink">
            <Ficha className="size-[4.5rem]" />
            <figcaption className="absolute bottom-2 left-3 text-xs text-plate-muted">
              La ficha, extruida
            </figcaption>
          </figure>
          {PIECES.slice(0, 4).map((p) => (
            <PieceTile key={p.name} piece={p} className="rounded-xl" />
          ))}
          <div className="absolute -right-2 -bottom-3 grid gap-0.5 rounded-md border border-line bg-surface px-3 py-2.5 text-xs text-muted shadow-soft">
            <span>Última impresión</span>
            <b className="font-slab text-[1.2rem] font-normal text-ink">9 h 12 min</b>
            <span>PLA · 153 g</span>
          </div>
        </div>
      </header>

      <section ref={news} className="py-4" aria-labelledby="t-novedades">
        <h2 id="t-novedades" className="sr-only">
          Novedades
        </h2>
        {featured ? (
          <div className="grid items-center gap-5 rounded-xl border border-plate-edge bg-plate p-6 text-plate-ink md:grid-cols-[1fr_auto]">
            <div>
              <p className="flex items-center gap-2.5 text-xs font-bold tracking-[0.1em] text-plate-muted uppercase">
                <span>Novedad</span>
                <time dateTime={featured.date} className="text-accent">
                  {formatShortDate(featured.date)}
                </time>
              </p>
              <h3 className="my-1.5 text-[1.7rem]">{featured.title}</h3>
              <p className="max-w-[60ch] text-plate-muted">{featured.body}</p>
            </div>
            {featured.href && featured.cta ? (
              <Button
                to={featured.href}
                variant="primary"
                className="border-plate-ink shadow-[3px_3px_0_var(--color-plate-ink)] hover:shadow-[4px_4px_0_var(--color-plate-ink)]"
              >
                {featured.cta} →
              </Button>
            ) : null}
          </div>
        ) : null}
        <ul className="mt-4 border-t border-line">
          {rest.slice(0, 3).map((n) => (
            <li key={n.date + n.title} className="border-b border-line">
              <Link
                to={n.href ?? "/novedades"}
                className="grid items-baseline gap-1 py-3.5 text-inherit no-underline sm:grid-cols-[7.5rem_1fr_auto] sm:gap-4 [&:hover_b]:text-accent"
              >
                <time dateTime={n.date} className="tabular text-[0.82rem] text-muted">
                  {formatShortDate(n.date)}
                </time>
                <b className="font-semibold transition-colors">{n.title}</b>
                <Pill tone="soon" className="justify-self-start border-solid text-muted">
                  {n.tag}
                </Pill>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section ref={apps} className="py-10" aria-labelledby="t-apps">
        <SectionHeader
          title={<span id="t-apps">Apps para makers</span>}
          text="Herramientas que nacieron en el taller. Cada una vive en su propia dirección. Las Pro necesitan cuenta: 30 días gratis, después USD 5 al mes en tu moneda."
          link={{ to: "/apps", label: "Ver todas" }}
        />
        {(["tools", "business"] as const).map((g) => (
          <div key={g}>
            <GroupLabel>{APP_GROUPS[g]}</GroupLabel>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {APPS.filter((a) => a.group === g).map((a) => (
                <AppBox key={a.slug} app={a} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section ref={pieces} className="py-6" aria-labelledby="t-piezas">
        <SectionHeader
          title={<span id="t-piezas">Del taller</span>}
          text="Piezas que salieron bien y alguna que no."
          link={{ to: "/piezas", label: "Todas las piezas" }}
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          {PIECES.slice(0, 5).map((p) => (
            <PieceTile key={p.name} piece={p} />
          ))}
        </div>
      </section>

      <section ref={posts} className="py-6" aria-labelledby="t-blog">
        <SectionHeader
          title={<span id="t-blog">Lo que aprendemos</span>}
          text="Notas cortas del taller: materiales, fallas, precios y trucos del laminador."
          link={{ to: "/blog", label: "Todo el blog" }}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {POSTS.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              data-post
              className="grid gap-2 rounded-lg border border-line bg-surface p-4 text-inherit no-underline transition-[box-shadow,border-color] duration-150 hover:border-ink hover:shadow-hard-lg"
            >
              <span className="text-xs font-bold tracking-[0.08em] text-muted uppercase">
                {p.category} · {p.minutes} min
              </span>
              <h3 className="text-[1.15rem]">{p.title}</h3>
              <p className="text-sm text-muted">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
