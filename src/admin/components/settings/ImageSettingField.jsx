import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import FormField from "../forms/FormField";

export default function ImageSettingField({ label, value, onChange, hint }) {
  const ref = useRef(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <FormField label={label} hint={hint}>
      <section className="flex flex-wrap items-start gap-4">
        {value ? (
          <figure className="relative w-20 h-20 rounded-xl overflow-hidden ring-2 ring-emerald-500/20">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange("")} className="absolute top-0.5 right-0.5 p-1 rounded bg-black/50 text-white">
              <X size={12} />
            </button>
          </figure>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500"
          >
            <ImagePlus size={22} />
          </button>
        )}
        <section className="flex-1 min-w-[200px] space-y-2">
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <input
            type="url"
            value={value?.startsWith("data:") ? "" : value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL hình ảnh..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-sm"
          />
          <button type="button" onClick={() => ref.current?.click()} className="text-xs text-emerald-600 hover:underline">
            Tải lên từ máy
          </button>
        </section>
      </section>
    </FormField>
  );
}
