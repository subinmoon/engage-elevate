import { useState } from "react";
import { Home, Heart, Star, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HeaderNav = () => {
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const favorites = [
    { id: "approval", label: "전자결재", href: "#" },
    { id: "helpdesk", label: "IT 헬프데스크", href: "#" },
    { id: "hr", label: "HR 시스템", href: "#" },
    { id: "mail", label: "메일", href: "#" },
    { id: "calendar", label: "캘린더", href: "#" },
  ];

  const filteredFavorites = favorites.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1">
        {/* AI 포탈로 이동 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="#"
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-muted-foreground" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-card border border-border">
            <p>AI 포탈</p>
          </TooltipContent>
        </Tooltip>

        {/* 즐겨찾기 드롭다운 */}
        <DropdownMenu open={favoritesOpen} onOpenChange={setFavoritesOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {!favoritesOpen && (
              <TooltipContent side="bottom" className="bg-card border border-border">
                <p>즐겨찾기</p>
              </TooltipContent>
            )}
          </Tooltip>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-card border border-border z-50"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="서비스 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted/50 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            {/* Favorites List */}
            <div className="max-h-48 overflow-y-auto py-1">
              {filteredFavorites.length > 0 ? (
                filteredFavorites.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <a href={item.href} className="flex items-center justify-between w-full cursor-pointer">
                      <span>{item.label}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </a>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
};

export default HeaderNav;