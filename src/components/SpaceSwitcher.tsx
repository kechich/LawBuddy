import { useState } from "react";
import { useSpaces } from "@/contexts/SpacesContext";
import { ChevronDown, Plus, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const spaceEmojis: Record<string, string> = {
  student: "🎓",
  renter: "🏠",
  freelancer: "💼",
  worker: "🔧",
};

const SpaceSwitcher = () => {
  const { spaces, activeSpace, switchSpace } = useSpaces();
  const [open, setOpen] = useState(false);

  if (!activeSpace) return null;

  const emoji = activeSpace.persona_type
    ? spaceEmojis[activeSpace.persona_type] || "📌"
    : "📌";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
          <span>{emoji}</span>
          <span className="capitalize">{activeSpace.name}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <AnimatePresence>
          {spaces.map((space) => (
            <DropdownMenuItem
              key={space.id}
              onClick={() => switchSpace(space.id)}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <span>{space.persona_type ? spaceEmojis[space.persona_type] || "📌" : "📌"}</span>
                <span className="capitalize">{space.name}</span>
              </span>
              {space.id === activeSpace.id && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </AnimatePresence>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="flex items-center gap-2 text-muted-foreground">
          <Plus className="h-3.5 w-3.5" />
          <span>Add space</span>
          <span className="ml-auto text-[10px] text-muted-foreground/60">Soon</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SpaceSwitcher;
