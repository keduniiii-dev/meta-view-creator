import { FaArrowRight } from "react-icons/fa";
import { useDemoDialogStore } from "@/stores/demoDialogStore";

const MobileStickyCTA = () => {
  const { setOpen } = useDemoDialogStore();
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 bg-gradient-to-t from-background via-background/95 to-background/0 pointer-events-none"
      role="region"
      aria-label="Quick contact"
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pointer-events-auto w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold text-base px-6 py-3.5 shadow-glow active:scale-[0.98] transition-transform"
      >
        Book a Demo <FaArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default MobileStickyCTA;
