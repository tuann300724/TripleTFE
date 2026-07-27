import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import NewsCard from "../components/NewsCard";
import api from "../service/api";
import { useEffect, useState } from "react";
import { ShieldCheck, Truck, Wrench, MessageCircle, ArrowRight, Calendar, MapPin, Clock, BadgeCheck } from "lucide-react";
import { CountUp, FadeIn } from "../components/Animate";

const features = [
  {
    icon: ShieldCheck,
    title: "Chính hãng 100%",
    desc: "Vợt, giày, phụ kiện từ Yonex, Victor, Li-Ning. Có giấy tờ chứng minh.",
  },
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    desc: "Miễn phí vận chuyển cho đơn từ 500.000đ. Giao trong 2-4 ngày toàn quốc.",
  },
  {
    icon: Wrench,
    title: "Bảo hành uy tín",
    desc: "Căng vợt miễn phí trọn đời. Đổi size trong 7 ngày không hỏi lý do.",
  },
  {
    icon: MessageCircle,
    title: "Tư vấn chuyên sâu",
    desc: "Đội ngũ VĐV & HLV giàu kinh nghiệm tư vấn chọn đồ chuẩn nhu cầu.",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem("app_loaded");
  });
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    if (!loading) return;
    sessionStorage.setItem("app_loaded", "true");
    let frame;
    const start = performance.now();
    const dur = 9000;
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setLoadPct(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setTimeout(() => setLoading(false), 600);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  useEffect(() => {
    Promise.all([
      api.get("/Products"),
      api.get("/ProductVariants"),
      api.get("/News"),
    ])
      .then(([productsRes, variantsRes, newsRes]) => {
        const variants = variantsRes.data;
        const filtered = productsRes.data.filter((p) => p.status === 1);
        const withStock = filtered.map((product) => {
          const totalStock = variants
            .filter((v) => v.productId === product.productId)
            .reduce((acc, v) => acc + v.stock, 0);
          return { ...product, stock: totalStock };
        });
        setProducts(withStock.slice(0, 4));

        const sorted = [...newsRes.data].sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        setNews(sorted.slice(0, 3));
      })
      .catch((err) => console.log("Lỗi tải dữ liệu trang chủ:", err));
  }, []);

  const splashStyle = {
    position: "fixed", inset: 0, zIndex: 9999,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    background: "radial-gradient(ellipse at 50% 40%, #0f1a1e, #080d14 70%)",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    transition: "opacity .7s ease",
    opacity: loading ? 1 : 0,
    pointerEvents: loading ? "auto" : "none",
  };

  return (
    <div>
      {loading && (
        <div style={splashStyle}>
          <style>{`
            @keyframes sScan{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
            @keyframes sFadeUp{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}
            @keyframes sPing{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.5);opacity:0}}
            @keyframes sShine{0%{background-position:200% 0}100%{background-position:-200% 0}}
            @keyframes sPulse{0%,100%{filter:drop-shadow(0 0 20px rgba(16,185,129,.3))}50%{filter:drop-shadow(0 0 40px rgba(16,185,129,.6))}}
          `}</style>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(16,185,129,.12),transparent)", animation: "sScan 6s linear infinite" }} />
          </div>
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ animation: "sFadeUp .9s ease forwards" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: 5, textTransform: "uppercase", marginBottom: 2 }}>TripleT Badminton</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#475569", letterSpacing: 3.5, textTransform: "uppercase" }}>Giới thiệu</div>
            </div>
            <div style={{ position: "relative", marginTop: 34, animation: "sFadeUp .9s .25s ease both" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: 120, height: 120, margin: "-60px 0 0 -60px", borderRadius: "50%", background: "rgba(16,185,129,.08)", animation: "sPing 2.5s ease-out infinite" }} />
              <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg,#059669,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, boxShadow: "0 0 40px rgba(16,185,129,.25)", animation: "sPulse 2.5s ease-in-out infinite", position: "relative" }}>🏸</div>
            </div>
            <div style={{ marginTop: 14, animation: "sFadeUp .9s .4s ease both" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9", letterSpacing: -.5, lineHeight: 1.1 }}>Triple<span style={{ color: "#34d399" }}>T</span></div>
            </div>
            <div style={{ marginTop: 0, animation: "sFadeUp .9s .55s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: 2, textTransform: "uppercase" }}>
                <span style={{ display: "inline-block", width: 24, height: 1, background: "#334155" }} />
                Cửa hàng cầu lông chuyên nghiệp
                <span style={{ display: "inline-block", width: 24, height: 1, background: "#334155" }} />
              </div>
            </div>
            <div style={{ marginTop: 32, animation: "sFadeUp .9s .7s ease both", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 240, height: 3, borderRadius: 3, background: "rgba(16,185,129,.08)", overflow: "hidden", boxShadow: "inset 0 0 4px rgba(0,0,0,.3)" }}>
                <div style={{ width: `${loadPct}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#059669,#34d399,#059669)", backgroundSize: "200% 100%", animation: "sShine .8s linear infinite", transition: "width .3s ease" }} />
              </div>
              <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: "#475569", fontVariantNumeric: "tabular-nums", letterSpacing: 1.5, textAlign: "center" }}>
                ĐANG TẢI... {loadPct}%
              </div>
            </div>
          </div>
        </div>
      )}
      {/* HERO */}
      <section className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-emerald-50 pt-20 md:pt-24 dark:bg-[#050505] dark:bg-none">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_30%),radial-gradient(circle_at_25%_30%,rgba(16,185,129,0.03),transparent_24%)] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_25%_30%,rgba(16,185,129,0.08),transparent_24%),linear-gradient(180deg,rgba(8,12,18,.88),rgba(3,5,10,.96))]" />
          <svg className="absolute inset-0 h-full w-full opacity-40 dark:opacity-100" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="courtFloorLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.6" /><stop offset="100%" stopColor="#f0fdf4" stopOpacity="0.3" /></linearGradient>
              <linearGradient id="courtFloorDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" /><stop offset="100%" stopColor="#020617" stopOpacity="0.95" /></linearGradient>
              <filter id="softGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <g transform="translate(720 560) rotateX(55) scale(1.05)" className="dark:hidden">
              <path d="M-280 240 L280 240 L350 -220 L-350 -220 Z" fill="url(#courtFloorLight)" />
              <line x1="-220" y1="-190" x2="220" y2="-190" stroke="#10b981" strokeWidth="0.8" opacity="0.3" />
              <line x1="-220" y1="-190" x2="220" y2="-190" stroke="#059669" strokeWidth="0.5" opacity="0.4" />
              <line x1="-190" y1="-170" x2="190" y2="-170" stroke="#10b981" strokeWidth="0.5" opacity="0.2" />
              <line x1="-80" y1="-110" x2="80" y2="-110" stroke="#10b981" strokeWidth="0.5" opacity="0.15" />
              <line x1="-80" y1="110" x2="80" y2="110" stroke="#10b981" strokeWidth="0.5" opacity="0.15" />
              <line x1="-220" y1="160" x2="220" y2="160" stroke="#10b981" strokeWidth="0.5" opacity="0.15" />
              <line x1="-100" y1="-180" x2="-100" y2="180" stroke="#10b981" strokeWidth="0.6" opacity="0.2" />
              <line x1="100" y1="-180" x2="100" y2="180" stroke="#10b981" strokeWidth="0.6" opacity="0.2" />
              <line x1="0" y1="-180" x2="0" y2="180" stroke="#059669" strokeWidth="1.2" opacity="0.2" filter="url(#softGlow)" />
            </g>
            <g transform="translate(720 560) rotateX(55) scale(1.05)" className="hidden dark:block">
              <path d="M-280 240 L280 240 L350 -220 L-350 -220 Z" fill="url(#courtFloorDark)" />
              <path d="M-260 220 L260 220 L320 -190 L-320 -190 Z" fill="rgba(16,185,129,0.04)" />
              <line x1="-220" y1="-190" x2="220" y2="-190" stroke="#34d399" strokeWidth="1.2" opacity="0.22" filter="url(#softGlow)" />
              <line x1="-220" y1="-190" x2="220" y2="-190" stroke="#10b981" strokeWidth="0.8" opacity="0.48" />
              <line x1="-190" y1="-170" x2="190" y2="-170" stroke="#10b981" strokeWidth="0.7" opacity="0.28" />
              <line x1="-80" y1="-110" x2="80" y2="-110" stroke="#10b981" strokeWidth="0.7" opacity="0.22" />
              <line x1="-80" y1="110" x2="80" y2="110" stroke="#10b981" strokeWidth="0.7" opacity="0.22" />
              <line x1="-220" y1="160" x2="220" y2="160" stroke="#10b981" strokeWidth="0.7" opacity="0.22" />
              <line x1="-100" y1="-180" x2="-100" y2="180" stroke="#10b981" strokeWidth="0.8" opacity="0.25" />
              <line x1="100" y1="-180" x2="100" y2="180" stroke="#10b981" strokeWidth="0.8" opacity="0.25" />
              <line x1="0" y1="-180" x2="0" y2="180" stroke="#34d399" strokeWidth="1.8" opacity="0.18" filter="url(#softGlow)" />
              <path d="M-320 -190 L-300 -190 L-260 240 L-280 240 Z" fill="rgba(16,185,129,0.06)" />
              <path d="M320 -190 L300 -190 L260 240 L280 240 Z" fill="rgba(16,185,129,0.06)" />
            </g>
          </svg>
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(16,185,129,.12) 4px,rgba(16,185,129,.12) 5px)' }} />
          <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[160px] dark:bg-emerald-500/10" />
          <div className="absolute -right-32 bottom-1/4 h-[420px] w-[420px] rounded-full bg-emerald-400/5 blur-[160px] dark:bg-emerald-400/10" />
          <div className="hidden dark:block absolute left-1/3 top-[60%] h-[340px] w-[340px] rounded-full bg-lime-400/8 blur-[140px]" />
          <div className="absolute right-[18%] top-[12%] opacity-30 dark:opacity-50" style={{ animation: 'shuttleFloat1 6s ease-in-out infinite' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-emerald-600/40 drop-shadow-[0_0_10px_rgba(16,185,129,.2)] dark:text-white/50 dark:drop-shadow-[0_0_10px_rgba(16,185,129,.3)]">
              <ellipse cx="12" cy="4" rx="6.5" ry="3" stroke="currentColor" strokeWidth="0.6" />
              <path d="M12 7 L12 19" stroke="currentColor" strokeWidth="0.6" />
              <path d="M7 12 Q12 16.5 17 12" stroke="currentColor" strokeWidth="0.5" fill="rgba(16,185,129,0.04)" />
              <path d="M5 14 Q12 19.5 19 14" stroke="currentColor" strokeWidth="0.5" fill="rgba(16,185,129,0.03)" />
            </svg>
          </div>
          <style>{`
            @keyframes shuttleFloat1 {
              0%,100%{transform:translateY(0) rotate(0deg)}
              25%{transform:translateY(-20px) rotate(5deg)}
              50%{transform:translateY(-8px) rotate(-3deg)}
              75%{transform:translateY(-25px) rotate(4deg)}
            }
          `}</style>
        </div>

        <div className="relative mx-auto flex min-h-[calc(100dvh-96px)] max-w-7xl flex-col items-center justify-center px-6 md:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium tracking-wide text-emerald-600 dark:text-emerald-400">
              <BadgeCheck size={14} />
              Thương hiệu chính hãng
            </div>
            <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tighter text-slate-900 md:text-7xl lg:text-8xl dark:text-white">
              Chinh phục
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-lime-300">
                mọi cú smash
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg dark:text-slate-400">
              TripleT Badminton mang đến vợt, giày, trang phục và phụ kiện cầu lông chính hãng từ
              Yonex, Victor, Li-Ning. Dành cho mọi trình độ.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/product"
                className="group inline-flex items-center gap-3 rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-emerald-500/25 transition-all duration-500 hover:bg-emerald-500 hover:-translate-y-0.5 hover:shadow-emerald-500/40 active:scale-[0.97]"
              >
                Mua sắm ngay
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:translate-x-0.5 group-hover:scale-105">
                  <ArrowRight size={15} />
                </span>
              </Link>
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-emerald-400 hover:bg-white hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:border-emerald-400/30 dark:hover:bg-white/[0.08]"
              >
                Tìm hiểu thêm
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-500 group-hover:translate-x-0.5 group-hover:scale-105 dark:bg-white/10 dark:text-white">
                  <ArrowRight size={15} />
                </span>
              </Link>
            </div>
          </div>

          {/* Hero Stats Strip */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            <div className="group flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-emerald-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:text-emerald-600 group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.3)] dark:text-emerald-400 dark:group-hover:text-emerald-300 dark:group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.5)]">
                <BadgeCheck size={30} />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"><CountUp to={500} suffix="+" /></p>
                <p className="text-sm font-medium text-slate-500">Sản phẩm chính hãng</p>
              </div>
            </div>
            <div className="group flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-emerald-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:text-emerald-600 group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.3)] dark:text-emerald-400 dark:group-hover:text-emerald-300 dark:group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.5)]">
                <Truck size={30} />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Miễn phí</p>
                <p className="text-sm font-medium text-slate-500">Giao hàng toàn quốc</p>
              </div>
            </div>
            <div className="group flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-emerald-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:text-emerald-600 group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.3)] dark:text-emerald-400 dark:group-hover:text-emerald-300 dark:group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.5)]">
                <ShieldCheck size={30} />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Bảo hành</p>
                <p className="text-sm font-medium text-slate-500">Căng vợt trọn đời</p>
              </div>
            </div>
            <div className="group flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-emerald-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:text-emerald-600 group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.3)] dark:text-emerald-400 dark:group-hover:text-emerald-300 dark:group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.5)]">
                <Clock size={30} />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">24/7</p>
                <p className="text-sm font-medium text-slate-500">Hỗ trợ trực tuyến</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-slate-200/60 bg-white py-20 dark:border-slate-800/60 dark:bg-[#0c1219]">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Cam kết dành cho bạn
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Chúng tôi mang đến trải nghiệm mua sắm tốt nhất cho người chơi cầu lông ở mọi trình độ.
            </p>
          </div>
          <FadeIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-emerald-500/20"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-slate-50/80 py-20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Được yêu thích nhất</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Sản phẩm bán chạy nhất trong tháng</p>
            </div>
            <Link
              to="/product"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
            >
              Xem tất cả
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <FadeIn delay={100}>
            <div className="mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* NEWS + CTA */}
      <section className="bg-white py-20 dark:bg-[#0c1219]">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Bài viết mới nhất</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Tin tức, khuyến mãi và kiến thức cầu lông</p>
            </div>
            <Link
              to="/news"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
            >
              Xem tất cả
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <FadeIn delay={100}>
            {news.length === 0 ? (
              <div className="mt-12 rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400 dark:border-slate-700">
                Chưa có bài viết mới.
              </div>
            ) : (
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                  <Link
                    to={`/news/${article.newsId}`}
                    key={article.newsId}
                    className="block transition-transform duration-300 hover:-translate-y-1"
                  >
                    <NewsCard
                      article={{
                        id: article.newsId,
                        title: article.title,
                        image: article.thumbnail || "https://via.placeholder.com/400x250",
                        date: formatDate(article.createdDate),
                        category: "Tin tức",
                      }}
                    />
                  </Link>
                ))}
              </div>
            )}
          </FadeIn>

          <FadeIn delay={200}>
            <div className="relative mt-20 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 px-8 py-12 shadow-2xl md:px-14 md:py-14 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900">
              <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-[100px] dark:bg-emerald-500/10" />
              <div className="pointer-events-none absolute -bottom-12 left-1/4 h-56 w-56 rounded-full bg-lime-300/20 blur-[100px] dark:bg-lime-400/10" />
              <div className="relative flex flex-col items-center gap-8 text-center md:flex-row md:text-left md:justify-between">
                <div className="max-w-xl">
                  <h3 className="text-2xl font-extrabold text-white md:text-3xl">Đặt sân cầu lông trực tuyến</h3>
                  <p className="mt-3 leading-relaxed text-emerald-100 dark:text-slate-400">
                    Xem lịch trống, chọn sân và đặt lịch ngay trên web. Hệ thống 6 chi nhánh tại Đồng Nai và Bình Phước.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-5 md:justify-start">
                    <span className="inline-flex items-center gap-2 text-sm text-emerald-100 dark:text-slate-400">
                      <MapPin size={14} className="text-emerald-200 dark:text-emerald-400" /> 6 chi nhánh
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-emerald-100 dark:text-slate-400">
                      <Calendar size={14} className="text-emerald-200 dark:text-emerald-400" /> Đặt lịch 24/7
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-emerald-100 dark:text-slate-400">
                      <Clock size={14} className="text-emerald-200 dark:text-emerald-400" /> Nhận sân ngay
                    </span>
                  </div>
                </div>
                <Link
                  to="/booking"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-emerald-700 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-50 hover:-translate-y-0.5 active:translate-y-0 dark:bg-emerald-600 dark:text-white dark:shadow-emerald-500/20 dark:hover:bg-emerald-500"
                >
                  Đặt sân ngay
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
