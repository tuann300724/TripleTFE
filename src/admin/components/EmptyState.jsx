import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Không có dữ liệu", description = "Thử đổi bộ lọc hoặc thêm mục mới." }) {
  return (
    <section className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        <Inbox size={32} />
      </span>
      <h4 className="font-semibold text-slate-700 dark:text-slate-200 mt-4">{title}</h4>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">{description}</p>
    </section>
  );
}
