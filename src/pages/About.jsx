import { Link } from "react-router-dom";

const stats = [
    { value: "8+", label: "Năm kinh nghiệm" },
    { value: "15K+", label: "Khách hàng tin tưởng" },
    { value: "500+", label: "Sản phẩm" },
    { value: "3", label: "Chi nhánh" },
];

const team = [
    {
        name: "Nguyễn Anh Tuấn",
        role: "Founder & HLV",
        image: "https://imgs.search.brave.com/6ZOp9hNDVkGCOqORt8f0iszcN-JYnWiZaKFztSixbrQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmdm/cmUuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8xMDAwMTE4MTkx/LTEtMzAweDMwMC5w/bmc",
    },
    {
        name: "Trần Thanh Tuấn",
        role: "Chuyên gia thiết kế & phát triển sản phẩm",
        image: "Images/3.jpg",
    },
    {
        name: "Nguyễn Hữu Toàn",
        role: "Quản lý kho & vận hành sản phẩm",
        image: "Images/2.jpg",
    },
];

const contactItems = [
    { icon: "📍", title: "Địa chỉ", value: "Biên Hoà, Đồng Nai" },
    { icon: "📞", title: "Hotline", value: "0352 164 808" },
    { icon: "✉️", title: "Email", value: "Tuantran652003@triplet.vn" },
];

export default function About() {
    return (
        <div>
            <section className="tt-hero">
                <div className="mx-auto max-w-6xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                        Giới thiệu
                    </span>
                    <h1 className="mt-2 text-4xl font-bold md:text-5xl">Về TripleT Badminton</h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-300">
                        Đam mê cầu lông — phục vụ cộng đồng yêu thể thao với sản phẩm chất lượng và dịch vụ tận tâm.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="group tt-card-interactive overflow-hidden rounded-3xl">
                        <img
                            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80"
                            alt="Cửa hàng cầu lông"
                            className="tt-img-zoom h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="tt-heading text-3xl">Câu chuyện của chúng tôi</h2>
                        <p className="tt-body mt-4">
                            TripleT Badminton ra đời năm 2018 từ niềm đam mê cầu lông của một nhóm bạn trẻ. Bắt đầu
                            với cửa hàng nhỏ tại Hà Nội, chúng tôi đã phát triển thành hệ thống bán lẻ và online uy
                            tín, phục vụ hàng nghìn vận động viên từ nghiệp dư đến chuyên nghiệp.
                        </p>
                        <p className="tt-body mt-4">
                            Sứ mệnh của chúng tôi là mang đến trải nghiệm mua sắm minh bạch — sản phẩm chính hãng,
                            giá cạnh tranh, tư vấn đúng nhu cầu và hậu mãi chu đáo. Mỗi cây vợt bán ra đều được kiểm
                            tra kỹ trước khi giao đến tay khách hàng.
                        </p>
                        <Link to="/product" className="tt-btn-primary mt-6">
                            Khám phá sản phẩm
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-emerald-600 py-14 text-white dark:bg-emerald-700/90">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-12">
                    {stats.map((s) => (
                        <div key={s.label} className="tt-stat">
                            <p className="text-4xl font-extrabold">{s.value}</p>
                            <p className="mt-1 text-emerald-100">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
                <div className="text-center">
                    <span className="tt-label">Đội ngũ</span>
                    <h2 className="tt-title mt-1">Những người đồng hành</h2>
                </div>
                <div className="mt-12 grid gap-8 sm:grid-cols-3">
                    {team.map((member) => (
                        <div key={member.name} className="group tt-card-interactive overflow-hidden">
                            <div className="overflow-hidden">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="tt-img-zoom aspect-square w-full object-cover"
                                />
                            </div>
                            <div className="p-5 text-center">
                                <h3 className="font-semibold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                    {member.name}
                                </h3>
                                <p className="mt-1 min-h-10 text-sm text-emerald-600 dark:text-emerald-400">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
                <div className="tt-surface tt-hover-lift">
                    <h2 className="tt-heading">Liên hệ với chúng tôi</h2>
                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        {contactItems.map((item) => (
                            <div
                                key={item.title}
                                className="tt-hover-lift rounded-2xl p-4 transition-colors hover:bg-emerald-50/80 dark:hover:bg-slate-700/50"
                            >
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {item.icon} {item.title}
                                </p>
                                <p className="tt-body mt-1">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
