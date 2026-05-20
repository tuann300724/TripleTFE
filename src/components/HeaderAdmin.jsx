export default function HeaderAdmin() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6 ml-64">

      {/* Left: Title */}
      <div className="text-lg font-semibold text-gray-700">
        Admin Dashboard
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Notification */}
        <div className="text-xl cursor-pointer">
          🔔
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          A
        </div>

      </div>
    </div>
  );
}