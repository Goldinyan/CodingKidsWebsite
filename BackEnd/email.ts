


export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });

    // Prüfe ob die Antwort JSON ist
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    console.log("Status:", res.status);
    console.log("Text:", text);
  } catch (err) {
    console.error("Fehler beim Senden:", err);
  }
}




const adminsEmail: string[] = ["seifert.ansgar@gmail.com"];



//Event sich selbst hinzufügen / entfernen

export async function addedToEvent(to: string, eventName: string){
    const subject = `Du hast dich zu ${eventName} hinzugefügt`;
    const html = `<p>Hallo,</p>
    <p>Du hast dich zu dem Event ${eventName} hinzugefügt. Wir freuen uns auf deine Teilnahme!</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    
    await sendEmail(to, subject, html);
}

export async function removedFromEventUserList(to: string, eventName: string){
    const subject = `Du hast dich von ${eventName} entfernt`;
    const html = `<p>Hallo,</p>
    <p>Du hast dich von dem Event ${eventName} entfernt. Falls dies ein Fehler war, kontaktiere bitte einen Administrator.</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    
    await sendEmail(to, subject, html);
}

export async function removedFromEventQueueList(to: string, eventName: string){
    const subject = `Du wurdest von der Warteliste für ${eventName} entfernt`;
    const html = `<p>Hallo,</p>
    <p>Du wurdest von der Warteliste für das Event ${eventName} entfernt. Falls dies ein Fehler war, kontaktiere bitte einen Administrator.</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    
    await sendEmail(to, subject, html);
}

//Event von Admin entfernen

export async function removedFromEventByAdmin(to: string, eventName: string, reason?: string){
    const subject = `Du wurdest von ${eventName} entfernt`;
    const html = `<p>Hallo,</p>
    <p>Du wurdest von dem Event ${eventName} entfernt. ${reason ? `Grund: ${reason}` : ""}</p>
    <p>Falls dies ein Fehler war, kontaktiere bitte einen Administrator.</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    
    await sendEmail(to, subject, html);
}

export async function eventGotDeleted(to: string, eventName: string, reason?: string){
    const subject = `Das Event ${eventName} wurde gelöscht`;
    const html = `<p>Hallo,</p>
    <p>Das Event ${eventName} wurde gelöscht. ${reason ? `Grund: ${reason}` : ""}</p>
    <p>Falls du Fragen hast, kontaktiere bitte einen Administrator.</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    
    await sendEmail(to, subject, html);
}


// User ist jetzt in Event List nicht mehr Queue

export async function movedFromQueueToEvent(to: string, eventName: string){
    const subject = `Du wurdest von der Warteliste in das Event ${eventName} aufgenommen`;
    const html = `<p>Hallo,</p>
    <p>Du wurdest von der Warteliste in das Event ${eventName} aufgenommen. Wir freuen uns auf deine Teilnahme!</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    
    await sendEmail(to, subject, html);
}

// Announcement Email an alle User

export async function sendAnnouncementEmail(to: string, announcement: string){
    const subject = `Wichtige Ankündigung von Coding Kids`;
    const html = `<p>Hallo,</p>
    <p>${announcement}</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    
    await sendEmail(to, subject, html);
}





// Account Creation oder Deletion Email an Admin

export async function sendAccountCreationEmailToAdmin(userName: string, userEmail: string){
    const subject = `Neuer Benutzeraccount erstellt: ${userName}`;
    const html = `<p>Hallo Admin,</p>
    <p>Ein neuer Benutzeraccount wurde erstellt.</p>
    <p>Name: ${userName}<br/>Email: ${userEmail}</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;

    for (const adminEmail of adminsEmail) {
        await sendEmail(adminEmail, subject, html);
    }
}

export async function sendAccountDeletionEmailToAdmin(userName: string, userEmail: string){
    const subject = `Benutzeraccount gelöscht: ${userName}`;
    const html = `<p>Hallo Admin,</p>
    <p>Der folgende Benutzeraccount wurde gelöscht.</p>
    <p>Name: ${userName}<br/>Email: ${userEmail}</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    
    for (const adminEmail of adminsEmail) {
        await sendEmail(adminEmail, subject, html);
    }
}

// Account Email an User

export async function sendWelcomeEmail(to: string, userName: string){
    const subject = `Willkommen bei Coding Kids, ${userName}!`;
    const html = `<p>Hallo ${userName},</p>
    <p>Willkommen bei Coding Kids! Wir freuen uns, dich in unserer Community zu haben.</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
    await sendEmail(to, subject, html);
}

export async function sendEmailDeletedUser(to: string, userName: string){

    const subject = `Dein Benutzeraccount wurde gelöscht, ${userName}`;   
    const html = `<p>Hallo ${userName},</p>
    <p>Dein Benutzeraccount wurde gelöscht. Falls dies ein Fehler war, kontaktiere bitte einen Administrator.</p>
    <p>Viele Grüße,<br/>Dein Coding Kids Team</p>`;
 
    await sendEmail(to, subject, html);
 }


  
