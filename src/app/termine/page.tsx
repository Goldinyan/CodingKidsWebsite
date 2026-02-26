console.log("is client?");
import EventView from "./EventView";

interface termineProps {
  searchParams: {
    selectedCourse?: string;
  };
}

export default function Home({ searchParams }: termineProps) {
  console.log("searchParams:", searchParams);
  return (
    <div className="flex flex-col ">
      <EventView searchParams={searchParams} />
    </div>
  );
}
