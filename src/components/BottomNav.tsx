import { Newspaper, Layers, MessageCircle, Settings, FileText, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const isBusiness = profile?.account_type === "business";

  const navItems = [
    { icon: Newspaper, label: "Feed", path: "/feed" },
    { icon: Layers, label: "Spaces", path: "/spaces" },
    ...(isBusiness ? [
      { icon: ShieldCheck, label: "Compliance", path: "/compliance" },
      { icon: FileText, label: "Reports", path: "/reports" },
    ] : []),
    { icon: MessageCircle, label: "BuddyChat", path: "/chat" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="mx-auto max-w-lg flex items-center justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path || (path === "/feed" && location.pathname === "/newsletter");
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              <span className={`text-[10px] ${active ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
