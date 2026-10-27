import { AtSign, Mail } from "lucide-react";

import { CONTACT } from "@/content/contact";

export function Footer() {
  return (
    <footer className="gutter mt-12 border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted">
        <span>
          Rona 3D · {CONTACT.place} · parte de{" "}
          <a
            href="https://ronagames.com.ar"
            className="underline-offset-2 hover:text-ink hover:underline"
          >
            RONA GAMES
          </a>
        </span>
        <span className="flex flex-wrap items-center gap-4">
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-ink"
          >
            <AtSign className="size-4" aria-hidden="true" /> {CONTACT.instagramHandle}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-1.5 hover:text-ink"
          >
            <Mail className="size-4" aria-hidden="true" /> {CONTACT.email}
          </a>
        </span>
      </div>
    </footer>
  );
}
