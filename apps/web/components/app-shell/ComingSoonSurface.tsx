import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Honest placeholder for a scoped-but-unbuilt surface (Dashboard, Add
 * Platform). Never dressed up as a working screen — Product Principle 3 is
 * "design ahead of build, honestly," so this states plainly what it is
 * rather than faking content.
 */
export function ComingSoonSurface({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-full bg-background">
      <header className="mx-auto max-w-[1200px] px-4 pb-6 pt-10 sm:px-16">
        <h1 className="text-[24px] font-semibold text-on-surface">{title}</h1>
        <p className="mt-1 text-[16px] text-on-surface-variant">{description}</p>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 sm:px-16">
        <EmptyState
          title="Not built yet"
          description="This surface is scoped in the product plan but hasn’t been designed or built."
        />
      </main>
    </div>
  );
}
