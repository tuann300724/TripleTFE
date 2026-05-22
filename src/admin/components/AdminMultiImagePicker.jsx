import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Star, Trash2, Upload } from "lucide-react";
import AdminBtn from "./AdminBtn";

const MAX_IMAGES = 5;

function readFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    return files.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        name: file.name,
        url: URL.createObjectURL(file),
    }));
}

export default function AdminMultiImagePicker() {
    const inputId = useId();
    const inputRef = useRef(null);
    const [images, setImages] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [mainId, setMainId] = useState(null);
    const imagesRef = useRef(images);
    imagesRef.current = images;

    useEffect(() => {
        return () => {
            imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
        };
    }, []);

    function addFiles(fileList) {
        if (!fileList?.length) return;
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;

        const incoming = readFiles(fileList).slice(0, remaining);
        setImages((prev) => {
            const next = [...prev, ...incoming];
            if (!mainId && next.length > 0) setMainId(next[0].id);
            return next;
        });
    }

    function removeImage(id) {
        setImages((prev) => {
            const target = prev.find((img) => img.id === id);
            if (target) URL.revokeObjectURL(target.url);
            const next = prev.filter((img) => img.id !== id);
            if (mainId === id) setMainId(next[0]?.id ?? null);
            return next;
        });
    }

    function handleInputChange(e) {
        addFiles(e.target.files);
        e.target.value = "";
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);
        addFiles(e.dataTransfer.files);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Đã chọn{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {images.length}/{MAX_IMAGES}
                    </span>{" "}
                    ảnh
                </p>
                {images.length > 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            images.forEach((img) => URL.revokeObjectURL(img.url));
                            setImages([]);
                            setMainId(null);
                        }}
                        className="text-xs font-medium text-red-600 transition hover:text-red-500 dark:text-red-400"
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            <label
                htmlFor={inputId}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                    dragOver
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
                        : "border-slate-300/80 bg-slate-50/50 hover:border-emerald-500/40 hover:bg-emerald-50/30 dark:border-slate-600 dark:bg-slate-800/30 dark:hover:border-emerald-500/30"
                } ${images.length >= MAX_IMAGES ? "pointer-events-none opacity-50" : ""}`}
            >
                <ImagePlus className="mb-2 h-9 w-9 text-slate-400" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Kéo thả hoặc chọn nhiều ảnh
                </p>
                <p className="mt-1 text-xs text-slate-400">PNG, JPG, WEBP — tối đa {MAX_IMAGES} ảnh</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400">
                    <Upload className="h-3.5 w-3.5" />
                    Chọn nhiều file
                </span>
            </label>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                className="sr-only"
                onChange={handleInputChange}
                disabled={images.length >= MAX_IMAGES}
            />

            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((img, index) => {
                        const isMain = mainId === img.id;
                        return (
                            <div
                                key={img.id}
                                className={`group relative aspect-square overflow-hidden rounded-xl border bg-slate-100 dark:bg-slate-800 ${
                                    isMain
                                        ? "border-emerald-500 ring-2 ring-emerald-500/30"
                                        : "border-slate-200/80 dark:border-slate-600"
                                }`}
                            >
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                {isMain && (
                                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                                        <Star className="h-3 w-3 fill-current" />
                                        Ảnh chính
                                    </span>
                                )}
                                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                                    {!isMain && (
                                        <button
                                            type="button"
                                            onClick={() => setMainId(img.id)}
                                            className="flex-1 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-800"
                                        >
                                            Đặt chính
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(img.id)}
                                        className="rounded-md bg-red-600 p-1 text-white"
                                        aria-label={`Xóa ảnh ${index + 1}`}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {images.length < MAX_IMAGES && (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300/80 text-slate-400 transition hover:border-emerald-500/40 hover:text-emerald-600 dark:border-slate-600 dark:hover:text-emerald-400"
                        >
                            <ImagePlus className="h-8 w-8" />
                            <span className="mt-1 text-xs font-medium">Thêm ảnh</span>
                        </button>
                    )}
                </div>
            )}

            {images.length > 0 && (
                <AdminBtn
                    variant="soft"
                    type="button"
                    className="w-full"
                    onClick={() => inputRef.current?.click()}
                    disabled={images.length >= MAX_IMAGES}
                >
                    + Thêm ảnh ({images.length}/{MAX_IMAGES})
                </AdminBtn>
            )}
        </div>
    );
}
