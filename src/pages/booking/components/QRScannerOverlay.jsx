import { QrCode, Sparkles } from "lucide-react";

export default function QRScannerOverlay({ scanning, scannedBranchName }) {
    if (!scanning) return null;

    return (
        <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <style>{`
                @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
            `}</style>
            <div className="relative w-36 h-36 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center mb-6 overflow-hidden bg-slate-900">
                <QrCode size={72} className="text-emerald-400" />
                <div
                    className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399]"
                    style={{ animation: "scan 1.5s infinite ease-in-out" }}
                />
            </div>
            <h3 className="text-emerald-400 font-bold tracking-wider uppercase text-sm animate-pulse flex items-center gap-1.5 justify-center">
                <Sparkles size={16} className="animate-spin text-emerald-400" />
                Đang xử lý quét mã QR...
            </h3>
            <p className="text-slate-400 text-xs mt-3 font-semibold px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 max-w-[80%] truncate">
                {scannedBranchName}
            </p>
        </div>
    );
}
