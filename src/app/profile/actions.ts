// src/app/profile/actions.ts
"use server";

import * as fs from 'fs/promises';
import * as path from 'path';

export async function getAvatarNames(): Promise<string[]> {
  const folderPath = path.join(process.cwd(), 'public', 'avatars');
  try {
    const files = await fs.readdir(folderPath);
    return files.filter(file => file.toLowerCase().endsWith('.png'));
  } catch (error) {
    console.error("Fehler beim Lesen der Avatare auf dem Server:", error);
    return [];
  }
}
