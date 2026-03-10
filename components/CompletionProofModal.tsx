'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-primary/20 duration-300">
        <DialogHeader>
          <DialogTitle>Add proof to complete</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{habitTitle}</p>
        </DialogHeader>
        <div className="space-y-4">
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
            <Button
              type="button"
              variant="outline"
              onClick={handleTakePhoto}
              className="flex-1 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              Take photo
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleChooseFromGallery}
              className="flex-1 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              Choose from gallery
            </Button>
          </div>
          {proofImageUrl && (
            <div className="relative">
              <img src={proofImageUrl} alt="Proof" className="w-full max-h-48 object-contain rounded-xl border border-border bg-muted/30" />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setProofImageUrl(null)}
                className="absolute top-2 right-2 rounded-full bg-black/50 text-white hover:bg-black/70 border-0"
              >
                Remove
              </Button>
            </div>
          )}
          <div>
            <Label className="text-sm font-semibold mb-1 block">Note (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a reflection..."
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter className="flex gap-3 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-xl transition-all active:scale-[0.98]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleConfirm}
            className="flex-1 rounded-xl transition-all active:scale-[0.98]"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
