import { Reveal } from "./Reveal";
import { cn } from "../ui/utils";

interface DispatchRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Legacy wrapper: aligns with the unified section reveal grammar. */
export function DispatchReveal({ children, className, delay = 0 }: DispatchRevealProps) {
  return (
    <Reveal className={cn(className)} delay={delay}>
      {children}
    </Reveal>
  );
}
