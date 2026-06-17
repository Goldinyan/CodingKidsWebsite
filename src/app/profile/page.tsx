import ProfileView from "./ProfileView";

export default function Home() {
  return (
    <div
      className={`min-h-screen w-full relative main-view-container px-4 py-22 
        }`}
    >
      <div className="absolute inset-0 bg-grid-pattern z-0" />

      <ProfileView />
    </div>
  );
}
