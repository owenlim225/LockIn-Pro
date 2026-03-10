'use client';

import { useState, useRef } from 'react';

interface CompletionProofModalProps {
  habitTitle: string;
  onConfirm: (notes: string, proofImageUrl: string) => void;
  onCancel: () => void;
}

export function CompletionProofModal({ habitTitle, onConfirm, onCancel }: CompletionProofModalProps) {
  const [proofImageUrl, setProofImageUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setError('');
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setProofImageUrl(dataUrl);
    } catch {
      setError('Failed to load image.');
    }
    e.target.value = '';
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleChooseFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (!proofImageUrl) {
      setError('Please add a photo (camera or gallery) to complete.');
      return;
    }
    onConfirm(notes, proofImageUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-5 border-b border-border">
          <h2 className="text-xl font-bold">Add proof to complete</h2>
          <p className="text-sm text-foreground/60 mt-1">{habitTitle}</p>
        </div>
        <div className="p-5 space-y-4">
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleTakePhoto}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-primary/20 text-foreground hover:bg-primary/30 transition-colors"
            >
              Take photo
            </button>
            <button
              type="button"
              onClick={handleChooseFromGallery}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-primary/20 text-foreground hover:bg-primary/30 transition-colors"
            >
              Choose from gallery
            </button>
          </div>
          {proofImageUrl && (
            <div className="relative">
              <img src={proofImageUrl} alt="Proof" className="w-full max-h-48 object-contain rounded-xl border border-border bg-muted/30" />
              <button
                type="button"
                onClick={() => setProofImageUrl(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white text-sm hover:bg-black/70"
              >
                Remove
              </button>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1">Note (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a reflection..."
              className="w-full p-3 bg-input rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border"
              rows={2}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="p-5 flex gap-3 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-secondary text-white hover:bg-secondary/90 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
