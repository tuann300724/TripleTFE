export default function HeaderAdmin() {
    return (
        <header className="h-[60px] bg-gray-900 text-white flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <a href="#" className="hover:text-blue-500">Dashboard</a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-blue-500">Users</a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-blue-500">Settings</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}