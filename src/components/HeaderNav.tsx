import { useState } from "react";
import { Home, Heart, Star, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderNav = () => {
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const favorites = [
    { id: "approval", label: "전자결재", href: "#" },
    { id: "helpdesk", label: "IT 헬프데스크", href: "#" },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* AI 포탈로 이동 */}
      <a
        href="#"
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors"
      >
        <Home className="w-4 h-4 text-primary" />
        <span>AI 포탈</span>
      </a>

      {/* 즐겨찾기 드롭다운 */}
      <DropdownMenu open={favoritesOpen} onOpenChange={setFavoritesOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors">
            <Heart className="w-4 h-4 text-primary" />
            <span>즐겨찾기</span>
            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${favoritesOpen ? "rotate-180" : ""}`} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-card border border-border">
          {favorites.map((item) => (
            <DropdownMenuItem key={item.id} asChild>
              <a href={item.href} className="flex items-center justify-between w-full">
                <span>{item.label}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderNav;