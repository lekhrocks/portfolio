/**
 * Key/value strip used at the top of panels — like a Datadog detail page header.
 *
 *   <MetaRow items={[
 *     { label: "Owner", value: "Lekhraj Kumar" },
 *     { label: "Region", value: "ap-south-1" },
 *   ]} />
 */
export default function MetaRow({
  items,
  dense,
}: {
  items: { label: string; value: React.ReactNode; href?: string }[];
  dense?: boolean;
}) {
  return (
    <dl
      className={`flex flex-wrap ${dense ? "gap-x-5 gap-y-2" : "gap-x-7 gap-y-3"}`}
    >
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="mono-label mb-0.5">{it.label}</dt>
          <dd className="text-sm text-slate-200 truncate">
            {it.href ? (
              <a
                href={it.href}
                target={it.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="console-link underline-offset-4 hover:underline"
              >
                {it.value}
              </a>
            ) : (
              it.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
