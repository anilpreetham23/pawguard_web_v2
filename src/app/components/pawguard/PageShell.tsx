import { DogSketchBackground } from "../DogSketchBackground";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`relative min-h-screen flex flex-col bg-background ${className}`}>
      <DogSketchBackground />
      {children}
    </div>
  );
}
