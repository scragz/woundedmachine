import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    // For Vercel, we need to use the absolute path from the root of the project
    const imageDir = path.join(process.cwd(), 'public', 'images', 'dreams');
    const audioDir = path.join(process.cwd(), 'public', 'files', 'dreams');

    const [imageFiles, audioFiles] = await Promise.all([
      fs.readdir(imageDir),
      fs.readdir(audioDir)
    ]);

    // Return the files as JSON
    return new Response(JSON.stringify({
      images: imageFiles,
      audio: audioFiles
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reading dream files:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
