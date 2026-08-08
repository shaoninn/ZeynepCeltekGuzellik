import { WORKFLOW_STEPS, workflowIndex } from "@/lib/order-workflow";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  current: string;
  compact?: boolean;
}

export function OrderTimeline({ current, compact }: OrderTimelineProps) {
  const activeIdx = workflowIndex(current);

  return (
    <ol className={cn("flex", compact ? "flex-col gap-2" : "flex-wrap gap-2 sm:gap-0 sm:flex-nowrap sm:justify-between")}>
      {WORKFLOW_STEPS.map((step, idx) => {
        const done = idx < activeIdx;
        const active = idx === activeIdx;
        return (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-2",
              !compact && "sm:flex-1 sm:flex-col sm:text-center sm:gap-1"
            )}
          >
            <span
              className={cn(
                "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2",
                done && "bg-orange border-orange text-black",
                active && "border-orange text-orange",
                !done && !active && "border-[#444] text-[#666]"
              )}
            >
              {done ? "✓" : idx + 1}
            </span>
            <span
              className={cn(
                "text-xs sm:text-sm",
                active ? "text-orange font-semibold" : done ? "text-white" : "text-[#666]"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
