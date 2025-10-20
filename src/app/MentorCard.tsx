import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function MentorCard({ name, description, picture }: {
  name: string;
  description: string;
  picture: string;
}) {
  return (
    <Card className="w-[300px]">
      <CardHeader className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={picture} />
          
        </Avatar>
        <div>
          <h3 className="text-lg text-red-700 font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardHeader>
      <CardFooter>
        <Button variant="outline">Mehr erfahren</Button>
      </CardFooter>
    </Card>
  );
}
