import imageCompression from 'browser-image-compression';
import { showError } from './toast';

const options = {
  maxSizeMB: 0.5, // Ukuran maksimum 500KB
  maxWidthOrHeight: 1024, // Resolusi maksimum 1024px
  useWebWorker: true,
};

export const compressImage = async (file: File): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Gagal mengompres gambar:', error);
    showError('Gagal mengompres gambar. Silakan coba gambar lain.');
    // Kembalikan file asli jika kompresi gagal
    return file;
  }
};