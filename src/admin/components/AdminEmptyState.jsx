import { Inbox } from "lucide-react";

export default function AdminEmptyState({ message, colSpan = 1 }) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-6 py-16">
                <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-slate-300/70 bg-slate-50/50 px-6 py-10 dark:border-slate-600 dark:bg-slate-800/30">
                    <Inbox className="mb-3 h-10 w-10 text-slate-400" />
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">{message}</p>
                </div>
            </td>
        </tr>
    );
}
