import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "../../app/components/ui/utils";
import { useSound } from "./SoundProvider";

/**
 * SoundToggle — the ambient sound switch shown in the Navbar and Footer.
 * Reflects the current state via aria-pressed and swaps the icon with a
 * soft pop so the switch itself feels alive.
 */
interface SoundToggleProps {
  className?: string;
  withLabel?: boolean;
}

export function SoundToggle({ className, withLabel = false }: SoundToggleProps) {
  const { soundOn, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={soundOn}
      aria-label="Toggle ambient sound"
      title={soundOn ? "Turn ambient sound off" : "Turn ambient sound on"}
      className={cn(
        "inline-flex items-center gap-2 text-muted-foreground transition-colors duration-200",
        "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
        className,
      )}
    >
      <motion.span
        key={soundOn ? "on" : "off"}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="grid place-items-center"
      >
        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </motion.span>
      {withLabel && (
        <span className="font-condensed text-xs font-semibold uppercase tracking-wider">
          {soundOn ? "Sound on" : "Sound off"}
        </span>
      )}
    </button>
  );
}
