import EventView from "./EventView";

export default function Home() {
	return (
		<div
			className={`min-h-screen  w-full relative main-view-container  py-22 
        }`}
		>
			{/*<div className="absolute inset-0 bg-grid-pattern z-0" />*/}

			<EventView />
		</div>
	);
}
