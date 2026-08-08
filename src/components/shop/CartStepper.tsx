import { cn } from "@/lib/utils";

interface CartStepperProps {
  current: 1 | 2 | 3;
}

const STEPS = [
  { n: 1, label: "Liste" },
  { n: 2, label: "Bilgiler" },
  { n: 3, label: "Onay" },
] as const;

export function CartStepper({ current }: CartStepperProps) {
  return (
    <nav aria-label="Sepet adımları" className="mb-8">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, idx) => {
          const done = step.n < current;
          const active = step.n === current;
          return (
            <li key={step.n} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                    done && "bg-orange border-orange text-black",
                    active && "border-orange text-orange bg-orange/10",
                    !done && !active && "border-border text-muted"
                  )}
                >
                  {done ? "✓" : step.n}
                </span>
                <span
                  className={cn(
                    "text-xs uppercase tracking-wider",
                    active ? "text-orange font-semibold" : "text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "hidden sm:block w-12 h-0.5 mb-5",
                    done ? "bg-orange" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
