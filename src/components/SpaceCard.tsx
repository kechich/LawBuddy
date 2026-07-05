import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const personaEmoji: Record<string, string> = {
  student: "🎓",
  renter: "🏠",
  freelancer: "💼",
  worker: "🔧",
};

interface SpaceCardProps {
  id: string;
  name: string;
  emoji?: string | null;
  personaType: string | null;
  city: string | null;
  isActive: boolean;
  onTap: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SpaceCard = ({ name, emoji: customEmoji, personaType, city, isActive, onTap, onEdit, onDelete }: SpaceCardProps) => {
  const emoji = customEmoji || (personaType ? personaEmoji[personaType] || "📌" : "📌");

  return (
    <Card
      className={`relative cursor-pointer p-5 transition-all hover:shadow-md ${
        isActive ? "ring-2 ring-accent border-accent" : "hover:border-foreground/20"
      }`}
      onClick={onTap}
    >
      {/* Three-dot menu */}
      <div className="absolute right-2 top-2" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">{name}</h3>
      {city && <p className="text-xs text-muted-foreground">{city}</p>}
      {isActive && (
        <Badge variant="secondary" className="mt-2 text-[10px] bg-accent/10 text-accent border-0">
          ● Active
        </Badge>
      )}
    </Card>
  );
};

export default SpaceCard;
