// "use server";
//
// import { updateUser } from ".";
// import { UserRole } from "@/BackEnd/type";
// import { arrayUnion } from "firebase/firestore";
//
// export async function uploadScratchAction(
//   formData: FormData,
//   userId: string,
//   userRole: UserRole,
// ) {
//   const file = formData.get("file") as File;
//   if (!file) throw new Error("Keine Datei gefunden.");
//
//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);
//
//   const bucketName = "codingkidswebsite.firebasestorage.app";
//   const filePath = `scratch_projects/${userId}/${Date.now()}_${file.name}`;
//
//   // Wir codieren den Pfad für die URL
//   const encodedPath = encodeURIComponent(filePath);
//
//   // 1. Direkt über die Google Cloud Storage API auf dem Server hochladen (umgeht alle SDKs)
//   const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${encodedPath}`;
//
//   const uploadResponse = await fetch(uploadUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-scratch",
//     },
//     body: buffer,
//   });
//
//   if (!uploadResponse.ok && uploadResponse.status !== 200) {
//     const errorText = await uploadResponse.text();
//     console.error("Firebase Storage Server-Upload Fehler:", errorText);
//     throw new Error("Upload fehlgeschlagen.");
//   }
//
//   // 2. Generiere die öffentliche Firebase Download-URL mit einem Download-Token
//   const downloadToken = crypto.randomUUID();
//   const finalDownloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${downloadToken}`;
//
//   // 3. Firestore Dokument updaten
//   const payload: any = {
//     projects: arrayUnion({
//       name: file.name,
//       downloadUrl: finalDownloadUrl,
//       createdAt: Date.now(),
//       size: file.size,
//     }),
//   };
//
//   await updateUser(userId, payload, userId, userRole);
//
//   return finalDownloadUrl;
// }
//
//
//

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { updateUser } from ".";
import { UserRole } from "@/BackEnd/type";
import { arrayUnion } from "firebase/firestore";

export async function uploadScratchProject(
  file: File,
  userId: string,
  userRole: UserRole,
): Promise<string> {
  // Wir erstellen eine saubere Referenz
  const fileRef = ref(
    storage,
    `scratch_projects/${userId}/${Date.now()}_${file.name}`,
  );

  // WICHTIG: Wir konvertieren das File in ein sauberes Blob mit passendem Content-Type.
  // Das verhindert, dass der Browser seltsame Metadaten mitsendet, die CORS blockieren.
  const blob = new Blob([file], { type: "application/x-scratch" });

  const snapshot = await uploadBytes(fileRef, blob);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  const payload: any = {
    projects: arrayUnion({
      name: file.name,
      downloadUrl: downloadUrl,
      createdAt: Date.now(),
      size: file.size,
    }),
  };

  await updateUser(userId, payload, userId, userRole);

  return downloadUrl;
}
