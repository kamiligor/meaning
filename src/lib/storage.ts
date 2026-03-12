import { writeFile, readFile, mkdir, unlink } from "fs/promises";
import { join, dirname } from "path";

export function getStorageDir() {
  return process.env.STORAGE_PATH || join(process.cwd(), "data", "slides");
}

export async function saveFile(filename: string, buffer: Buffer): Promise<string> {
  const filePath = join(getStorageDir(), filename);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
  return filePath;
}

export async function getFile(filename: string): Promise<Buffer> {
  return readFile(join(getStorageDir(), filename));
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    await unlink(join(getStorageDir(), filename));
  } catch {
    // File may not exist, that's fine
  }
}
