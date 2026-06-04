"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload";

const MAX_MB = 5;

// Upload immagine via drag&drop o click, con anteprima.
// La chiamata vera è in uploadImage() (per ora stub). In fallback si può incollare un URL.
export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Il file deve essere un'immagine");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Immagine troppo pesante (max ${MAX_MB}MB)`);
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Immagine caricata");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il caricamento");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative border border-border bg-muted/20 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Anteprima" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            title="Rimuovi immagine"
            className="absolute top-2 right-2 bg-background/90 border border-border p-1.5 text-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          disabled={uploading}
          className={cn(
            "flex h-48 w-full flex-col items-center justify-center gap-2 border border-dashed bg-muted/10 px-6 text-center transition-colors",
            dragging ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary",
            uploading && "cursor-wait",
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Caricamento...
              </span>
            </>
          ) : (
            <>
              <UploadCloud className={cn("w-7 h-7", dragging ? "text-secondary" : "text-muted-foreground")} />
              <span className="text-sm font-medium text-foreground">
                Trascina un&apos;immagine o clicca per caricarla
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                PNG, JPG — max {MAX_MB}MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = ""; // così si può ricaricare lo stesso file
        }}
      />

      {/* fallback: incolla un URL */}
      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="oppure incolla un URL"
          className="pl-9 bg-background rounded-none border-border text-sm"
        />
      </div>
    </div>
  );
}
