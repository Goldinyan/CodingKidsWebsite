import type { EmailTemplate, UserRole } from "./type";

const baseHtmlWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #1f2937; font-size: 24px; margin: 0 0 20px 0; }
    h2 { color: #22c55e; font-size: 20px; margin: 20px 0 15px 0; }
    p { color: #374151; line-height: 1.6; margin: 10px 0; }
    .highlight { background: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin: 15px 0; }
    .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>Viele Grüße,<br>Dein Coding Kids Team</p>
      <p style="margin: 10px 0 0 0;">© 2024 Coding Kids. Alle Rechte vorbehalten.</p>
    </div>
  </div>
</body>
</html>
`;

const templates: Record<string, EmailTemplate> = {
  newEvent_user: {
    triggerId: "newEvent",
    subject: "Neues Event verfügbar: {eventName}",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Neues Event verfügbar</h2>
      <p>Hallo {userName},</p>
      <p>ein neues Event wurde erstellt und könnte dich interessieren:</p>
      <div class="highlight">
        <p><strong>Event:</strong> {eventName}</p>
        <p><strong>Datum:</strong> {eventDate}</p>
        <p><strong>Schwierigkeitsgrad:</strong> {difficulty}</p>
        <p><strong>Beschreibung:</strong> {description}</p>
      </div>
      <p>Melde dich an, um deine Teilnahme zu bestätigen!</p>
    `),
    roles: ["user", "member", "mentor"],
    requiredFields: [
      "userName",
      "eventName",
      "eventDate",
      "difficulty",
      "description",
    ],
  },

  newEvent_admin: {
    triggerId: "newEvent",
    subject: "Neues Event erstellt: {eventName}",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Neues Event erstellt</h2>
      <p>Hallo Admin,</p>
      <p>ein neues Event wurde soeben erstellt:</p>
      <div class="highlight">
        <p><strong>Event:</strong> {eventName}</p>
        <p><strong>Mentor:</strong> {mentorName}</p>
        <p><strong>Datum:</strong> {eventDate}</p>
        <p><strong>Maximal Teilnehmer:</strong> {memberCount}</p>
      </div>
    `),
    roles: ["admin"],
    requiredFields: ["eventName", "mentorName", "eventDate", "memberCount"],
  },

  kicked_user: {
    triggerId: "kicked",
    subject: "Du wurdest aus {eventName} entfernt",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Entfernung aus Event</h2>
      <p>Hallo {userName},</p>
      <p>du wurdest aus dem Event {eventName} entfernt.</p>
      <div class="highlight">
        <p><strong>Event:</strong> {eventName}</p>
        <p><strong>Grund:</strong> {reason}</p>
      </div>
      <p>Falls dies ein Fehler war, kontaktiere bitte einen Administrator.</p>
    `),
    roles: ["user", "member"],
    requiredFields: ["userName", "eventName", "reason"],
  },

  queueToUser_user: {
    triggerId: "queueToUser",
    subject: "Du wurdest in {eventName} aufgenommen",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Aufnahme aus Warteliste</h2>
      <p>Hallo {userName},</p>
      <p>gute Nachrichten! Du wurdest von der Warteliste in das Event aufgenommen:</p>
      <div class="highlight">
        <p><strong>Event:</strong> {eventName}</p>
        <p><strong>Datum:</strong> {eventDate}</p>
      </div>
      <p>Wir freuen uns auf deine Teilnahme!</p>
    `),
    roles: ["user", "member"],
    requiredFields: ["userName", "eventName", "eventDate"],
  },

  understaffedWarning_admin: {
    triggerId: "understaffedWarning",
    subject: "Warnung: Zu wenige Mentoren in {eventName}",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Personalbesetzung niedrig</h2>
      <p>Hallo Admin,</p>
      <p>ein Event hat nicht genug Mentoren zugewiesen:</p>
      <div class="highlight">
        <p><strong>Event:</strong> {eventName}</p>
        <p><strong>Mentoren:</strong> {mentorCount}/{requiredMentors}</p>
        <p><strong>Datum:</strong> {eventDate}</p>
      </div>
      <p>Bitte füge weitere Mentoren hinzu oder verschiebe das Event.</p>
    `),
    roles: ["admin", "mentor"],
    requiredFields: [
      "eventName",
      "mentorCount",
      "requiredMentors",
      "eventDate",
    ],
  },

  announcement_user: {
    triggerId: "announcement",
    subject: "Ankündigung: {announcementTitle}",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>{announcementTitle}</h2>
      <p>Hallo {userName},</p>
      <div class="highlight">
        <p>{announcementContent}</p>
      </div>
      <p>Bei Fragen kontaktiere uns jederzeit!</p>
    `),
    roles: ["user", "member", "mentor", "admin"],
    requiredFields: ["userName", "announcementTitle", "announcementContent"],
  },

  accountCreated_user: {
    triggerId: "accountCreated",
    subject: "Willkommen bei Coding Kids",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Willkommen {userName}</h2>
      <p>Hallo {userName},</p>
      <p>dein Account wurde erfolgreich erstellt! Wir freuen uns, dich in unserer Community zu haben.</p>
      <div class="highlight">
        <p>Du kannst dich jetzt anmelden und an unseren Events teilnehmen.</p>
      </div>
      <p>Viel Spaß beim Lernen!</p>
    `),
    roles: ["user", "member"],
    requiredFields: ["userName"],
  },

  accountCreated_admin: {
    triggerId: "accountCreated",
    subject: "Neuer Account erstellt: {userName}",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Neuer Benutzer</h2>
      <p>Hallo Admin,</p>
      <p>ein neuer Account wurde erstellt:</p>
      <div class="highlight">
        <p><strong>Name:</strong> {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Registriert:</strong> {registrationDate}</p>
      </div>
    `),
    roles: ["admin"],
    requiredFields: ["userName", "userEmail", "registrationDate"],
  },

  accountDeleted_user: {
    triggerId: "accountDeleted",
    subject: "Dein Account wurde gelöscht",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Account Löschung</h2>
      <p>Hallo {userName},</p>
      <p>dein Account wurde gelöscht. Falls dies ein Fehler war, kontaktiere bitte einen Administrator.</p>
      <p>Wir hoffen dich bald wiederzusehen!</p>
    `),
    roles: ["user", "member"],
    requiredFields: ["userName"],
  },

  accountDeleted_admin: {
    triggerId: "accountDeleted",
    subject: "Account gelöscht: {userName}",
    htmlContent: baseHtmlWrapper(`
      <h1>Coding Kids</h1>
      <h2>Account gelöscht</h2>
      <p>Hallo Admin,</p>
      <p>ein Account wurde gelöscht:</p>
      <div class="highlight">
        <p><strong>Name:</strong> {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Gelöschte:</strong> {deletionDate}</p>
      </div>
    `),
    roles: ["admin"],
    requiredFields: ["userName", "userEmail", "deletionDate"],
  },
};

export function getEmailTemplate(
  trigger: string,
  role: string,
): EmailTemplate | null {
  const key = `${trigger}_${role}`;
  return templates[key] || null;
}

export function replaceTemplateVariables(
  template: string,
  variables: Record<string, any>,
): string {
  let result = template;
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    result = result.replace(new RegExp(`{${key}}`, "g"), String(value || ""));
  });
  return result;
}
