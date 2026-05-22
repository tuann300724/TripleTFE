import { Link } from "react-router-dom";
import { ArrowLeft, Package, Save, Tag, X } from "lucide-react";
import AdminBtn from "./components/AdminBtn";
import AdminGlassCard from "./components/AdminGlassCard";
import AdminMultiImagePicker from "./components/AdminMultiImagePicker";
import { AdminPageHero } from "./components/AdminPage";

const inputClass =
    "w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white";

const labelClass = "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

export default function ProductCreate() {
    return (
        <div className="space-y-6 animate-[fadeUp_0.5s_ease-out]">
            <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link
                    to="/admin/products"
                    className="inline-flex items-center gap-1 font-medium transition hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Sản phẩm
                </Link>
                <span>/</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Thêm mới</span>
            </nav>

            <AdminPageHero
                title="Thêm sản phẩm"
                subtitle="Tạo sản phẩm cầu lông mới cho cửa hàng TripleT"
                icon={Package}
                actions={
                    <Link to="/admin/products">
                        <AdminBtn variant="ghost" icon={X}>
                            Hủy
                        </AdminBtn>
                    </Link>
                }
            />

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <AdminGlassCard>
                            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                Thông tin cơ bản
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        placeholder="VD: Yonex Astrox 99 Pro"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>Mã SKU</label>
                                        <input type="text" placeholder="TT-AX99-001" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Thương hiệu</label>
                                        <select className={inputClass} defaultValue="">
                                            <option value="">Chọn thương hiệu</option>
                                            <option value="yonex">Yonex</option>
                                            <option value="victor">Victor</option>
                                            <option value="lining">Li-Ning</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Mô tả</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Mô tả chi tiết sản phẩm..."
                                        className={`${inputClass} resize-y min-h-[120px]`}
                                    />
                                </div>
                            </div>
                        </AdminGlassCard>

                        <AdminGlassCard>
                            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                Giá & tồn kho
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className={labelClass}>Giá bán (₫)</label>
                                    <input type="text" placeholder="0" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Giá gốc (₫)</label>
                                    <input type="text" placeholder="0" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Tồn kho</label>
                                    <input type="number" placeholder="0" min="0" className={inputClass} />
                                </div>
                            </div>
                        </AdminGlassCard>
                    </div>

                    <div className="space-y-6">
                        <AdminGlassCard>
                            <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
                                Ảnh sản phẩm
                            </h2>
                            <AdminMultiImagePicker />
                        </AdminGlassCard>

                        <AdminGlassCard>
                            <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
                                Phân loại
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Danh mục</label>
                                    <select className={inputClass} defaultValue="">
                                        <option value="">Chọn danh mục</option>
                                        <option value="vot">Vợt</option>
                                        <option value="giay">Giày</option>
                                        <option value="phukien">Phụ kiện</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Trạng thái</label>
                                    <select className={inputClass} defaultValue="active">
                                        <option value="active">Đang bán</option>
                                        <option value="draft">Nháp</option>
                                        <option value="hidden">Ẩn</option>
                                    </select>
                                </div>
                            </div>
                        </AdminGlassCard>

                        <AdminGlassCard className="space-y-3">
                            <AdminBtn variant="primary" className="w-full py-3" icon={Save} type="submit">
                                Lưu sản phẩm
                            </AdminBtn>
                            <Link to="/admin/products" className="block">
                                <AdminBtn variant="ghost" className="w-full" type="button">
                                    Hủy
                                </AdminBtn>
                            </Link>
                        </AdminGlassCard>
                    </div>
                </div>
            </form>
        </div>
    );
}
