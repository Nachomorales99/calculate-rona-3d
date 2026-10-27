import { Link, useParams } from "react-router";
import { findPost } from "@/content/posts";
import { formatShortDate } from "@/lib/dates";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { Component as NotFound } from "./NotFoundPage";

export function Component() {
  const { slug = "" } = useParams();
  const post = findPost(slug);
  useDocumentTitle(post?.title ?? "Nota no encontrada");
  if (!post) return <NotFound />;
  return (
    <article className="mx-auto max-w-[68ch] py-10">
      <Link to="/blog" className="text-sm text-muted hover:text-ink">
        ← Todas las notas
      </Link>
      <p className="mt-6 text-xs font-bold tracking-[0.08em] text-muted uppercase">
        {post.category} · {post.minutes} min · {formatShortDate(post.date)}
      </p>
      <h1 className="mt-2 mb-6 text-[2.2rem] sm:text-[2.8rem]">{post.title}</h1>
      <p className="mb-6 text-[1.12rem] text-muted">{post.excerpt}</p>
      <div className="grid gap-4 text-[1.05rem] leading-[1.65]">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
