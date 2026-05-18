export default function SidebarAdmin() {
    return (
        <aside className="w-64 bg-gray-800 text-white h-full">
            <div className="p-4">
                <h2 className="text-lg font-bold">Admin Panel</h2>
            </div>
            <nav className="p-4">
                <ul>
                    <li className="mb-2">
                        <a href="#" className="hover:bg-gray-600 p-2 rounded">Dashboard</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="hover:bg-gray-600 p-2 rounded">Users</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="hover:bg-gray-600 p-2 rounded">Settings</a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}