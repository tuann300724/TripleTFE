import { useAdmin } from "../context/AdminContext";

export default function SettingsView() {
  const { darkMode, setDarkMode } = useAdmin();

  return (
    <section className="anim-in space-y-6 max-w-xl">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Cài đặt hệ thống admin</p>
      </header>
      <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5 space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <section>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm text-slate-500">Giao diện tối hiện đại</p>
          </section>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? "left-6" : "left-0.5"}`} />
          </button>
        </label>
        <hr className="border-slate-200 dark:border-slate-700" />
        <p className="text-sm text-slate-500">TripleT Badminton Admin v1.0</p>
      </article>
    </section>
  );
}
