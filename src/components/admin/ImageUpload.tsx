'use client';
import { useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      toast.error('Cloudinary configuration missing');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'entix_unsigned'); 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        onChange([...value, data.secure_url]);
        toast.success('Atelier photo captured');
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Connectivity issue with Cloudinary');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="group relative h-[180px] w-[140px] overflow-hidden rounded-[20px] border border-ink/5 bg-white shadow-sm">
            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-oxblood text-white shadow-md transition hover:scale-110 active:scale-95"
              >
                <X size={14} />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Piece Preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        ))}
      </div>
      
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          onChange={uploadToCloudinary}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          disabled={isUploading}
        />
        <div className="flex h-[120px] w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-ink/10 bg-ivory-2/40 transition-all group-hover:border-ink/20 group-hover:bg-white">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-champagne-600" />
          ) : (
            <>
              <ImagePlus className="mb-2 h-7 w-7 text-ink/20 group-hover:text-ink/40 transition-colors" />
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 group-hover:text-ink/60 transition-colors">Add Atelier Shot</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
