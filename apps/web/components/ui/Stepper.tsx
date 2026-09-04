import { CheckIcon } from "./icons";

export interface Step {
  id: string;
  label: string;
}

/** A numbered step progress row — done steps get a checkmark, the current
 *  step gets an outlined accent circle, upcoming steps stay neutral.
 *  Generic: any multi-step flow can reuse it (the create wizard today). */
export function Stepper({ steps, currentIndex }: { steps: Step[]; currentIndex: number }) {
  return (
    <ol className="flex items-center">
      {steps.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <span className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold tabular ${
                  state === "done"
                    ? "bg-primary text-on-primary"
                    : state === "current"
                      ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary"
                      : "bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {state === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={`hidden text-[13px] font-medium sm:block ${
                  state === "upcoming" ? "text-on-surface-variant" : "text-on-surface"
                }`}
              >
                {step.label}
              </span>
            </span>
            {i < steps.length - 1 && <span className="mx-3 h-px flex-1 bg-outline-variant" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
