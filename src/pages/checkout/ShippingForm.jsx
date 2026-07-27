export default function ShippingForm({
    receiverName, setReceiverName,
    receiverPhone, setReceiverPhone,
    receiverEmail, setReceiverEmail,
    shippingAddress, setShippingAddress,
}) {
    return (
        <div className="tt-card p-6 md:p-8 space-y-4">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Thông tin giao hàng
            </h2>

            <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => e.preventDefault()}
            >

                <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Họ và tên người nhận
                    </label>

                    <input
                        type="text"
                        required
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="tt-input"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Số điện thoại
                    </label>

                    <input
                        type="tel"
                        required
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        placeholder="0987654321"
                        className="tt-input"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Email
                    </label>

                    <input
                        type="email"
                        required
                        value={receiverEmail}
                        onChange={(e) => setReceiverEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="tt-input"
                    />
                </div>

                <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Địa chỉ giao hàng
                    </label>

                    <input
                        type="text"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Số nhà, tên đường..."
                        className="tt-input"
                    />
                </div>

            </form>
        </div>
    );
}
