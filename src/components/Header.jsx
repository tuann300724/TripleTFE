import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 h-[70px] bg-black text-white flex items-center justify-between px-8">
            <h1 className="text-2xl font-bold">
                LOGO
            </h1>

            <nav className="flex gap-6">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/product">Product</Link>
            </nav>
        </header>
    );
}