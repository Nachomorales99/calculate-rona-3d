import { AppBox } from "@/components/AppBox";
import { GroupLabel, SectionHeader } from "@/components/ui";
import { APPS, APP_GROUPS } from "@/content/apps";
import { useHoverLift } from "@/lib/motion";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Component() {
  useDocumentTitle("Apps");
  const root = useHoverLift<HTMLDivElement>("[data-app-box]");
  return (
    <div ref={root} className="py-10">
      <SectionHeader
        as="h1"
        title="Apps para makers"
        text="Herramientas que nacieron en el taller y usamos todos los días. Las gratis no piden cuenta. Las Pro necesitan una cuenta Rona: 30 días de prueba y después USD 5 al mes, cobrado en tu moneda."
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
    </div>
  );
}
