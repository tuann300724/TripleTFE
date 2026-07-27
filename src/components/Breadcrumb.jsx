import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Trang chủ</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-slate-300 dark:text-slate-600">/</span>
          {item.to ? (
            <Link to={item.to} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
