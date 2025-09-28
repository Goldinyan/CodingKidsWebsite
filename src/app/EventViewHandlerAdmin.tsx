"use client"
import { useState, useEffect } from "react";
import {
  typeOfEvent,
  typeOfPlaces,
  getAllEvents,
  addEvent,
  addUserToEvent,
  removeUserFromEvent,
  isUserInEvent
} from "@/lib/db";
import { user } from "@/lib/firebase"


interface Event {
  uid: string;
  // Add other fields as needed, e.g.:
  name: string;
  date: string;
  length: number;
  memberCount: number;
  place: typeOfPlaces;
  typeOfEvent: typeOfEvent;
  users: [],
  queue: [],
}
 

export default function EventViewHandlerAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  
  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getAllEvents();
      const filEvents = events.slice(0, 10);
      setEvents(filEvents);
    
      

    const statusMap: Record<string, string> = {};
      for (const event of filEvents) {
        statusMap[event.uid] = "loading"; // Initialstatus
        try {
          const status = await isUserInEvent(event.uid);
          statusMap[event.uid] = status;
        } catch(error) {
            console.log(error);
          statusMap[event.uid] = "error";
        }
      }
      setStatuses({ ...statusMap });
    };

    fetchEvents();
  }, []);



  return (
  
  <div>
   {events.map((event) => (
       <div key={event.uid}> 
        <h3>{event.name}</h3>
    <p>{event.date} — {event.place}</p>
    <p>
         {statuses[event.uid] === "loading" && "⏳ Lade Status..."}
            {statuses[event.uid] === "User" && "✅ Du bist im Event"}
            {statuses[event.uid] === "Queue" && "🕓 Du bist in der Warteschlange"}
            {statuses[event.uid] === "false" && "❌ Du bist nicht angemeldet"}
            {statuses[event.uid] === "error" && "⚠️ Fehler beim Laden"}
    </p> 
       </div> 
    ))}
  </div>

  );
}
