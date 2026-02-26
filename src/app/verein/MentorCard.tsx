import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  description2: string;
  picture: string;
  onExpand?: () => void;
  isFirst?: boolean;
  isExpanded?: boolean;
}) {
  return (
    <Card
      className={`1:min-w-70 min-h-100 flex items-center w-full ${isExpanded && isFirst ? " md:px-20 lg:px-30 col-span-full" : ""
        } transition-all duration-300 hover:-translate-y-5 hover:shadow-lg `}
    >
      <CardHeader className="flex w-full items-center flex-col gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={picture} className="object-cover rounded-full" />
        </Avatar>
        <div className="flex items-center flex-col">
          <h3 className="pt-4 pb-4 text-3xl font-bold text-black">{name}</h3>
          <p className="text-sm text-muted-foreground">{description1}</p>
          {isExpanded && (
            <p className="text-sm text-muted-foreground">{description2}</p>
          )}
        </div>
      </CardHeader>
      <CardFooter>
        <Button
          variant="outline"
          onClick={() => {
            if (onExpand) {
              onExpand();
            }
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
        >
          {isExpanded ? "Weniger" : "Mehr erfahren"}
        </Button>
      </CardFooter>
    </Card>
  );
}
