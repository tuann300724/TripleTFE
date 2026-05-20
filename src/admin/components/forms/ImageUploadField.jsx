import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import FormField from "./FormField";

export default function ImageUploadField({ label, value, onChange, error }) {
  const inputRef = useRef(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <FormField label={label} error={error}>
      <section className="flex flex-col sm:flex-row gap-4 items-start">
        {value ? (
          <figure className="relative w-28 h-28 rounded-xl overflow-hidden ring-2 ring-emerald-500/30 shrink-0">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 p-1 rounded-lg bg-black/50 text-white hover:bg-black/70"
            >
              <X size={14} />
            </button>
          </figure>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-28 h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
          >
            <ImagePlus size={24} />
            <span className="text-xs">Tải ảnh</span>
          </button>
        )}
        <section className="flex-1 w-full space-y-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <input
            type="url"
            value={value?.startsWith("data:") ? "" : value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Hoặc dán URL hình ảnh..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-sm"
          />
          {!value?.startsWith("data:") && (
            <button type="button" onClick={() => inputRef.current?.click()} className="text-xs text-emerald-600 hover:underline">
              Chọn file từ máy
            </button>
          )}
        </section>
      </section>
    </FormField>
  );
}
