import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export async function uploadUserProfilePicture(
  file: File,
  userId: string,
): Promise<string> {
  const storageRef = ref(storage, `avatars/${userId}`);

  // Metadaten mitsenden, damit die Security Rules den Content-Type validieren können
  const metadata = {
    contentType: file.type,
  };

  try {
    // In Firebase Storage hochladen
    await uploadBytes(storageRef, file, metadata);

    // Die öffentlich zugängliche URL abrufen
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (error) {
    console.error("Storage Upload fehlgeschlagen:", error);
    throw error;
  }
}
