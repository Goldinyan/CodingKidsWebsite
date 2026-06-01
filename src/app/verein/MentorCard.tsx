import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme, Theme } from "@/context/ThemeContext";

export function MentorCard({
  name,
  description1,
  description2,
  picture,
  onExpand,
  isFirst,
  isExpanded,
  theme,
}: {
  name: string;
  description1: string;
  description2?: string;
  picture: string;
  onExpand?: () => void;
  isFirst?: boolean;
  isExpanded?: boolean;
  theme: Theme;
}) {
  return (
    <Card
      className={`
        ${isExpanded && isFirst ? "md:px-20 lg:px-30 col-span-full" : ""} 
        !rounded-none 1:min-w-70 flex flex-col w-full 
        transition-all duration-300 
        hover:-translate-y-2 hover:shadow-lg backdrop-blur-2xl border
        ${theme === "dark"
          ? "bg-white/5 hover:bg-white/8 border-white/10 hover:border-green-600"
          : "bg-slate-100 hover:bg-green-50 border-green-300 hover:border-green-500"
        }
      `}
    >
      <CardHeader className="w-full flex flex-col items-center gap-4 pt-2">
        <div className="flex flex-row items-center gap-4 w-full">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={picture} className="object-cover rounded-full" />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3
              className={`text-2xl font-bold leading-tight ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              {name}
            </h3>
            <h3
              className={`text-xs font-normal ${theme === "dark" ? "text-gray2text" : "text-slate-500"
                }`}
            >
              role
            </h3>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"
              }`}
          >
            {description1}
          </p>
          {isExpanded && (
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                }`}
            >
              {description2}
            </p>
          )}
        </div>
      </CardHeader>

      <CardFooter className="mt-auto -pb-15">
        {onExpand && (
          <Button
            variant="outline"
            onClick={() => {
              onExpand?.();
              if (!isExpanded) {
                const section = document.getElementById("mentor");
                if (section) {
                  const yOffset = -100;
                  const y =
                    section.getBoundingClientRect().top +
                    window.pageYOffset +
                    yOffset;

                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }
            }}
            className={`transition-colors duration-300 ${theme === "dark"
                ? "bg-white text-black hover:bg-gray-100 border-white"
                : "bg-slate-900 text-white hover:bg-slate-800 border-slate-900"
              }`}
          >
            {isExpanded ? "Weniger" : "Mehr erfahren"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
