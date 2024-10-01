import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    // For Vercel, we need to use the absolute path from the root of the project
    const imageDir = path.join(process.cwd(), 'public', 'images', 'dreams');
    const audioDir = path.join(process.cwd(), 'public', 'files', 'dreams');

    // Log the current working directory and its contents for debugging
    console.log('Current working directory:', process.cwd());
    try {
      const cwdContents = await fs.readdir(process.cwd());
      console.log('Contents of current working directory:', cwdContents);
    } catch (error) {
      console.error('Error reading current working directory:', error);
    }

    // Log the directories for debugging
    console.log('Image directory:', imageDir);
    console.log('Audio directory:', audioDir);

    // Check if directories exist
    const [imageExists, audioExists] = await Promise.all([
      fs.access(imageDir).then(() => true).catch(() => false),
      fs.access(audioDir).then(() => true).catch(() => false)
    ]);

    if (!imageExists || !audioExists) {
      throw new Error(`Directories not found. Image dir exists: ${imageExists}, Audio dir exists: ${audioExists}`);
    }

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
