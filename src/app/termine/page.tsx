console.log("is client?");
import EventView from "./EventView";

interface termineProps {
  searchParams: {
    selectedCourse?: string;
  };
}

export default function Home() {
  return (
    <div className="flex flex-col ">
      <EventView />
    </div>
  );
}
