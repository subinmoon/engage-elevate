import { useState } from "react";
import { Home, Star, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { chatbotServices } from "@/data/chatbotServices";

const HeaderNav = () => {
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const favoriteServices = chatbotServices.filter((s) => s.isFavorite);
  const allServices = chatbotServices;

  const filteredFavorites = favoriteServices.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAll = allServices.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
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
            className="w-64 bg-card border border-border z-50"
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
            
            {/* Favorites Section */}
            {filteredFavorites.length > 0 && (
              <>
                <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-400" />
                  즐겨찾기
                </DropdownMenuLabel>
                <div className="max-h-32 overflow-y-auto">
                  {filteredFavorites.map((item) => (
                    <DropdownMenuItem key={item.id} asChild>
                      <a href={item.url || "#"} className="flex items-center gap-2 w-full cursor-pointer">
                        <span className="text-base">{item.icon}</span>
                        <span className="flex-1">{item.name}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-400" />
                      </a>
                    </DropdownMenuItem>
                  ))}
                </div>
              </>
            )}

            {filteredFavorites.length > 0 && filteredAll.length > filteredFavorites.length && (
              <DropdownMenuSeparator />
            )}

            {/* All Services Section */}
            {filteredAll.filter(s => !s.isFavorite).length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  전체 서비스
                </DropdownMenuLabel>
                <div className="max-h-40 overflow-y-auto">
                  {filteredAll
                    .filter((s) => !s.isFavorite)
                    .map((item) => (
                      <DropdownMenuItem key={item.id} asChild>
                        <a href={item.url || "#"} className="flex items-center gap-2 w-full cursor-pointer">
                          <span className="text-base">{item.icon}</span>
                          <span className="flex-1">{item.name}</span>
                        </a>
                      </DropdownMenuItem>
                    ))}
                </div>
              </>
            )}

            {filteredFavorites.length === 0 && filteredAll.filter(s => !s.isFavorite).length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                검색 결과가 없습니다
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
};

export default HeaderNav;