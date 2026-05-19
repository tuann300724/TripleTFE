import { TrendingUp } from "lucide-react";

const BG = {
  emerald: "from-emerald-500 to-teal-600",
  blue: "from-blue-500 to-indigo-600",
  violet: "from-violet-500 to-purple-600",
  orange: "from-orange-500 to-amber-500",
};

export default function StatCard({ title, value, growth, icon: Icon, color = "emerald" }) {
  return (
    <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5 card-hover anim-in shadow-sm">
      <section className="flex justify-between items-start">
        <section>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{value}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2 inline-flex items-center gap-1">
            <TrendingUp size={13} /> +{growth}% tháng trước
          </p>
        </section>
        <span className={`w-11 h-11 rounded-xl bg-gradient-to-br ${BG[color]} flex items-center justify-center text-white shadow-lg`}>
          <Icon size={20} />
        </span>
      </section>
    </article>
  );
}
