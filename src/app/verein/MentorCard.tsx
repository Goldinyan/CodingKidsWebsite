import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function MentorCard({
  name,
  description1,
  description2,
  picture,
  onExpand,
  isFirst,
  isExpanded,
}: {
  name: string;
  description1: string;
  description2?: string;
  picture: string;
  onExpand?: () => void;
  isFirst?: boolean;
  isExpanded?: boolean;
}) {
  return (
    <Card
      className={`!rounded-none 1:min-w-70 flex flex-col w-full ${isExpanded && isFirst ? "md:px-20 lg:px-30 col-span-full" : ""
        } ${onExpand ? "min-h-50" : "h-60"} transition-all duration-300 hover:-translate-y-2 hover:shadow-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8`}
    >
      <CardHeader className="w-full flex flex-col items-center gap-4 pt-2">
        <div className="flex flex-row items-center gap-4 w-full">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={picture} className="object-cover rounded-full" />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-white leading-tight">
              {name}
            </h3>
            <h3 className="text-xs font-normal text-gray2text">role</h3>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <p className="text-sm text-gray-400">{description1}</p>
          {isExpanded && (
            <p className="text-sm text-gray-400">{description2}</p>
          )}
        </div>
      </CardHeader>

      <CardFooter className="mt-auto pb-6">
        {onExpand ? (
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
            className="bg-white text-black hover:bg-gray-100 border-white"
          >
            {isExpanded ? "Weniger" : "Mehr erfahren"}
          </Button>
        ) : (
          <p className="text-gray-400">{description2}</p>
        )}
      </CardFooter>
    </Card>
  );
}
