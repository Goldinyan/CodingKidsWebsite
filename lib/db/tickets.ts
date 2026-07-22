import { db } from "../firebase";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  arrayUnion, 
  doc, 
  query, 
  where, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import type { DocumentData, Query } from "firebase/firestore"; // Importiert den Query Typ
import type { TicketData, TicketMessage, UserRole, UserData } from "@/BackEnd/type";
import { enforceRateLimit } from "./db";
import { sendTriggerEmailToMultipleUsers } from "./emailTriggers";

export async function getAllTickets(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<TicketData[]> {
  try {
    // declare as overall query type to avoid type conflicts with 'collection'
    let q: Query<DocumentData, DocumentData> = collection(db, "tickets");

    if (userRole !== "admin" && userRole !== "mentor") {
      q = query(collection(db, "tickets"), where("userUid", "==", userId));
    }

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id, 
    })) as TicketData[];
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}

export async function getTicketById(
  uid: string,
  userId: string = "anonymous",
  userRole: UserRole = "user"
): Promise<TicketData | null> {
  try {
    const ref = doc(db, "tickets", uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    
    // secury check
    if (data.userUid !== userId && !["admin", "mentor"].includes(userRole)) {
      throw new Error("Unauthorized to view this ticket");
    }

    return {
      ...data,
      uid: snapshot.id,
    } as TicketData;
  } catch (error) {
    console.error("Error fetching single ticket:", error);
    throw error;
  }
}

export async function addTicket(
  newTicket: Omit<TicketData, "uid" | "createdAt" | "updatedAt" | "messages" | "internalNotes">,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("addTicket", userId, userRole);

  try {
    const ticketUid = new Date().toISOString() + "_" + Math.random().toString(36).substr(2, 9);
    const now = new Date(); // firebase converts date automatically to Timestamp

    await setDoc(doc(db, "tickets", ticketUid), {
      ticketNumber: newTicket.ticketNumber,
      userUid: newTicket.userUid,
      userName: newTicket.userName,
      userEmail: newTicket.userEmail,
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "new", 
      createdAt: now,
      updatedAt: now,
      messages: [],
      internalNotes: []
    });

    const usersSnapshot = await getDocs(collection(db, "users"));
    const staffUsers: UserData[] = usersSnapshot.docs
      .map((doc) => doc.data() as UserData)
      .filter((user) => ["admin", "mentor", "staff"].includes(user.role));

    if (staffUsers.length > 0) {
      await sendTriggerEmailToMultipleUsers("newTicket", staffUsers, {
        ticketNumber: newTicket.ticketNumber,
        ticketSubject: newTicket.subject,
        ticketCustomer: newTicket.userName,
      });
    }

    return ticketUid;
  } catch (error) {
    console.error("Error adding ticket:", error);
    throw error;
  }
}

export async function updateTicket(
  uid: string,
  updates: Partial<Omit<TicketData, "messages" | "internalNotes">>,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("updateTicket", userId, userRole);

  try {
    const ref = doc(db, "tickets", uid);
    
    const finalUpdates = {
      ...updates,
      updatedAt: new Date() // Automatisch das globale 'updatedAt' Feld aktualisieren
    };

    await updateDoc(ref, finalUpdates);
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
}

// ── ADD MESSAGE TO TICKET ───────────────────────────────────────────────────
export async function addMessageToTicket(
  ticketUid: string,
  messageText: string,
  sender: { uid: string; name: string; role: "customer" | "staff" },
  userId: string = "anonymous",
  userRole: UserRole = "user"
) {
  enforceRateLimit("addMessageToTicket", userId, userRole);

  try {
    const ref = doc(db, "tickets", ticketUid);
    const messageUid = new Date().toISOString() + "_" + Math.random().toString(36).substr(2, 5);
    
    const newMessage: TicketMessage = {
      uid: messageUid,
      senderUid: sender.uid,
      senderName: sender.name,
      senderRole: sender.role,
      message: messageText,
      createdAt: new Date() as any // Firebase konvertiert JS-Date automatisch in Timestamp
    };

    // Ermittle den neuen Status basierend darauf, wer antwortet
    const nextStatus = sender.role === "staff" ? "pending_customer" : "pending_staff";

    await updateDoc(ref, {
      messages: arrayUnion(newMessage),
      status: nextStatus,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error adding message to ticket:", error);
    throw error;
  }
}

// ── ADD INTERNAL NOTE ───────────────────────────────────────────────────────
export async function addInternalNoteToTicket(
  ticketUid: string,
  noteText: string,
  sender: { uid: string; name: string },
  userId: string = "anonymous",
  userRole: UserRole = "user"
) {
  if (!["admin", "mentor", "staff"].includes(userRole)) {
    throw new Error("Unauthorized to add internal notes");
  }

  enforceRateLimit("addInternalNoteToTicket", userId, userRole);

  try {
    const ref = doc(db, "tickets", ticketUid);
    const noteUid = new Date().toISOString() + "_" + Math.random().toString(36).substr(2, 5);

    const newNote: TicketMessage = {
      uid: noteUid,
      senderUid: sender.uid,
      senderName: sender.name,
      senderRole: "staff",
      message: noteText,
      createdAt: new Date() as any
    };

    await updateDoc(ref, {
      internalNotes: arrayUnion(newNote),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error adding internal note:", error);
    throw error;
  }
}

// ── DELETE TICKET ───────────────────────────────────────────────────────────
export async function deleteTicket(
  uid: string,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("deleteTicket", userId, userRole);

  try {
    const ref = doc(db, "tickets", uid);
    const ticketSnapshot = await getDoc(ref);

    if (!ticketSnapshot.exists()) {
      console.log("No ticket found to delete");
      return;
    }

    await deleteDoc(ref);
    console.log("Ticket successfully deleted");
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
}
