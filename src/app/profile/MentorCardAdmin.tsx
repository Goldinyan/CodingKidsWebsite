import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pen, X, Check} from "lucide-react";
import { updateMentor, Mentor } from "@/lib/db";

export default function MentorCardAdmin({
  uid,
  name,
  description1,
  description2,
  picture,
}: {
  uid: string,
  name: string;
  description1: string;
  description2: string;
  picture: string;
}) {
  const [showDes2, setShowDes2] = useState<boolean>(false);
  const [updateView, setUpdateView] = useState<boolean>(false);
  const [updates, setUpdates] = useState<Partial<Mentor>>({
    name: name,
    des1: description1,
    des2: description2
  });

  return (
    <Card className="w-[300px] flex items-center">
      <CardHeader className="flex min-w-full justify-center items-center flex-col gap-4 pt-6">
       <Avatar className="w-24 h-24">
  <AvatarImage src={picture} className="object-cover rounded-full" />
</Avatar>

        {updateView ? (
          <div className="flex flex-col w-50">
            <p className="block  text-sm font-bold mb-1 text-gray-900 dark:text-white">Name:</p>
            <input
              value={updates.name}
              className="bg-gray-50 border pl-3 mb-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setUpdates((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            ></input>
                        <p className="block  text-sm font-bold mb-1 text-gray-900 dark:text-white">Description 1:</p>

            <input
              className="bg-gray-50 border pl-3 mb-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={updates.des1}
              onChange={(e) =>
                setUpdates((prev) => ({
                  ...prev,
                  des1: e.target.value,
                }))
              }
            ></input>
                        <p className="block  text-sm font-bold mb-1 text-gray-900 dark:text-white">Description 2:</p>

            <input
              value={updates.des2}
              className="bg-gray-50 border pl-3 mb-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setUpdates((prev) => ({
                  ...prev,
                  des2: e.target.value,
                }))
              }
            ></input>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h3 className="text-3xl pb-4 pt-4 font-bold text-black ">{name}</h3>
            <p className="text-sm text-muted-foreground">{description1}</p>
            {showDes2 && <p>{description2}</p>}
          </div>
        )}
      </CardHeader>
      <CardFooter className="flex flex-row gap-4">
        <Button variant="outline" onClick={() => setShowDes2((prev) => !prev)}>
          Mehr erfahren
        </Button>
        {updateView && 
        <div>
        <Button variant="outline" onClick={() => (updateMentor(uid, updates), setUpdateView(false))}>
        <Check />
        </Button>
        </div> }
        <Button
          variant="outline"
          onClick={() => setUpdateView((prev) => !prev)}
        >
            
          {updateView ?   <X /> : <Pen />}
        </Button>
      </CardFooter>
    </Card>
  );
}
