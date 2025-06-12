import { FaChartBar, FaClipboard, FaCog, FaEnvelope, FaSignOutAlt, FaUserFriends } from "react-icons/fa";

import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
  return (
    <aside className="h-screen w-64 bg-[#0F172A] text-white flex flex-col justify-between fixed">
      {/* Top: Logo and Menu */}
      <div>
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="p-2 bg-blue-500 rounded">
            {/* Replace with your logo */}
            <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.75L3.4 7 12 11.25 20.6 7 12 9.75zm0 2.25L2 9v6l10 5 10-5V9l-10 5z"/></svg>
          </div>
          <span className="text-xl font-semibold">SKillForge</span>
        </div>

        <div className="px-6 mt-4 mb-2 text-sm text-gray-400 uppercase">Menu</div>

        <nav className="flex flex-col gap-4 px-6">
          <a href="#" className="flex items-center gap-3 text-white hover:text-blue-400">
            <MdDashboard className="text-lg" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-white hover:text-blue-400">
            <FaEnvelope className="text-lg" /> Mail
          </a>
          <a href="#" className="flex items-center gap-3 text-white hover:text-blue-400">
            <FaUserFriends className="text-lg" /> Leads
          </a>
          <a href="#" className="flex items-center gap-3 text-white hover:text-blue-400">
            <FaClipboard className="text-lg" /> Bookings
          </a>
          <a href="#" className="flex items-center gap-3 text-white hover:text-blue-400">
            <FaChartBar className="text-lg" /> Analytics
          </a>
        </nav>
      </div>

      {/* Bottom: Settings & Logout */}
      <div className="flex flex-col gap-3 px-6 pb-6">
        <a href="#" className="flex items-center gap-3 text-blue-400 hover:underline">
          <FaCog className="text-lg" /> Settings
        </a>
        <a href="#" className="flex items-center gap-3 text-red-500 hover:underline">
          <FaSignOutAlt className="text-lg" /> Logout
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
