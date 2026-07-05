import { sendEmail } from "@/BackEnd/email";
import {
  getEmailTemplate,
  replaceTemplateVariables,
} from "@/BackEnd/emailTemplates";
import type { EmailTrigger, UserData } from "@/BackEnd/type";

export async function sendTriggerEmail(
  trigger: EmailTrigger,
  userData: UserData,
  variables: Record<string, any>,
) {
  const settings = userData.settings.notifications;

  const triggerEnabled = settings[trigger as keyof typeof settings] === true;
  if (!triggerEnabled) return;

  const template = getEmailTemplate(trigger, userData.role);
  if (!template) return;

  const missingFields = template.requiredFields.filter((f) => !variables[f]);
  if (missingFields.length > 0) {
    console.error(
      `Missing required fields for ${trigger}: ${missingFields.join(", ")}`,
    );
    return;
  }

  const subject = replaceTemplateVariables(template.subject, variables);
  const htmlContent = replaceTemplateVariables(template.htmlContent, variables);

  await sendEmail(userData.email, subject, htmlContent);
}

export async function sendTriggerEmailToMultipleUsers(
  trigger: EmailTrigger,
  users: UserData[],
  variables: Record<string, any>,
) {
  const promises = users.map((user) =>
    sendTriggerEmail(trigger, user, variables).catch((err) => {
      console.error(`Failed to send email to ${user.email}:`, err);
    }),
  );

  await Promise.all(promises);
}

export async function sendAdminNotification(
  trigger: EmailTrigger,
  adminEmails: string[],
  variables: Record<string, any>,
) {
  const template = getEmailTemplate(trigger, "admin");
  if (!template) return;

  const subject = replaceTemplateVariables(template.subject, variables);
  const htmlContent = replaceTemplateVariables(template.htmlContent, variables);

  const promises = adminEmails.map((email) =>
    sendEmail(email, subject, htmlContent).catch((err) => {
      console.error(`Failed to send admin email to ${email}:`, err);
    }),
  );

  await Promise.all(promises);
}
