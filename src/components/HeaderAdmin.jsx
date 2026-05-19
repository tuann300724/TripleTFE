import { useState } from "react";
import { Search, Bell, Sun, Moon, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAdmin, MENU } from "../admin/context/AdminContext";
import { useAuth, useLogout } from "../admin/auth/AuthProvider";
import LogoutConfirmModal from "../admin/components/LogoutConfirmModal";

export default function HeaderAdmin() {
  const {
    darkMode, setDarkMode, search, setSearch, searchResults,
    notifOpen, setNotifOpen, notifications, markAllRead, unread, page, setPage,
  } = useAdmin();
  const { profile } = useAuth();
  const doLogout = useLogout();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const hasResults = searchResults && (searchResults.products.length > 0 || searchResults.customers.length > 0 || searchResults.orders.length > 0);

  const handleLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      setLogoutOpen(false);
      setProfileOpen(false);
      setLogoutLoading(false);
      doLogout();
    }, 500);
  };

  return (
    <>
      <header className="h-14 shrink-0 glass border-b border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-40">
        <section className="flex-1 flex items-center gap-3 max-w-xl">
          <section className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              placeholder="Tìm sản phẩm, khách hàng, hóa đơn..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500/50 text-sm text-slate-800 dark:text-slate-100 outline-none transition-colors"
            />
            {searchOpen && search.trim() && (
              <article className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl max-h-64 overflow-y-auto admin-scroll z-50 modal-in">
                {!hasResults && <p className="p-4 text-sm text-slate-500">Không tìm thấy kết quả</p>}
                {searchResults?.products?.slice(0, 3).map((p) => (
                  <p key={p.id} className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-emerald-600 text-xs font-semibold">SP · </span>{p.name}
                  </p>
                ))}
                {searchResults?.customers?.slice(0, 3).map((c) => (
                  <p key={c.id} className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-blue-600 text-xs font-semibold">KH · </span>{c.name}
                  </p>
                ))}
                {searchResults?.orders?.slice(0, 3).map((o) => (
                  <p key={o.id} className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                    <span className="text-amber-600 text-xs font-semibold">HĐ · </span>{o.id}
                  </p>
                ))}
              </article>
            )}
          </section>
        </section>

        <p className="hidden md:block text-sm font-medium text-slate-500 dark:text-slate-400">{MENU[page]}</p>

        <section className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 transition-colors"
            title="Dark / Light mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <section className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <button type="button" className="fixed inset-0 z-40" aria-label="đóng" onClick={() => setNotifOpen(false)} />
                <article className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 modal-in overflow-hidden">
                  <header className="flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-semibold text-sm">Thông báo</span>
                    <button type="button" onClick={markAllRead} className="text-xs text-emerald-600 hover:underline">Đánh dấu đã đọc</button>
                  </header>
                  <ul className="max-h-72 overflow-y-auto admin-scroll">
                    {notifications.map((n) => (
                      <li key={n.id} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 text-sm ${!n.read ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""}`}>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{n.text}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              </>
            )}
          </section>

          <section className="relative ml-1">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
            >
              <section className="relative">
                <img src={profile.avatar} alt="" className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/40" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </section>
              <span className="hidden sm:block text-left text-sm">
                <span className="block font-semibold text-slate-800 dark:text-white leading-tight truncate max-w-[120px]">{profile.fullName}</span>
                <span className="block text-xs text-slate-500">{profile.role}</span>
              </span>
              <ChevronDown size={14} className={`text-slate-400 hidden sm:block transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <>
                <button type="button" className="fixed inset-0 z-40" aria-label="đóng menu" onClick={() => setProfileOpen(false)} />
                <article className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 modal-in overflow-hidden py-1">
                  <header className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-sm truncate">{profile.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                    <span className="inline-flex mt-2 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">● Online</span>
                  </header>
                  <button
                    type="button"
                    onClick={() => { setPage("profile"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <User size={16} className="text-slate-400" /> Hồ sơ của tôi
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPage("settings"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Settings size={16} className="text-slate-400" /> Cài đặt
                  </button>
                  <hr className="my-1 border-slate-100 dark:border-slate-700" />
                  <button
                    type="button"
                    onClick={() => { setProfileOpen(false); setLogoutOpen(true); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </article>
              </>
            )}
          </section>
        </section>
      </header>

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        loading={logoutLoading}
      />
    </>
  );
}
