import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-slate-300 dark:bg-[#080d14] dark:text-slate-400">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
                <div className="md:col-span-2">
                    <Link to="/" className="tt-logo flex items-center gap-2 text-white">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-lg shadow-md shadow-emerald-500/30 transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-500/40">
                            🏸
                        </span>
                        <span className="text-xl font-bold">
                            Triple<span className="text-emerald-400">T</span>
                        </span>
                    </Link>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed">
                        Cửa hàng cầu lông chuyên nghiệp — vợt, giày, phụ kiện chính hãng. Giao hàng toàn quốc,
                        bảo hành uy tín.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-white">Liên kết</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>
                            <Link to="/product" className="tt-hover-glow inline-block">
                                Sản phẩm
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="tt-hover-glow inline-block">
                                Giới thiệu
                            </Link>
                        </li>
                        <li>
                            <Link to="/news" className="tt-hover-glow inline-block">
                                Tin tức
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white">Liên hệ</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li className="tt-hover-glow cursor-default">📍 Biên Hoà, Đồng Nai, Việt Nam</li>
                        <li className="tt-hover-glow cursor-default">📞 0352 164 808</li>
                        <li className="tt-hover-glow cursor-default">✉️ Tuantran652003@triplet.vn</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 py-5 text-center text-sm">
                © 2026 TripleT Badminton. All rights reserved.
            </div>
        </footer>
    );
}
