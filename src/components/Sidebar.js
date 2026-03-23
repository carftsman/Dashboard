import { useState } from "react";
import { FaThLarge, FaCog, FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-blue-900 text-white p-4">
        <h2 className="font-bold">
          Zest<span className="text-yellow-400">Bot</span>
        </h2>
        <FaBars
          className="text-xl cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-200 w-64 bg-blue-900 text-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 text-xl font-bold">
          <span className="bg-white text-blue-900 px-2 py-1 rounded mr-2">
            ZB
          </span>
          Zest<span className="text-yellow-400">Bot</span>
        </div>

        {/* Menu */}
        <nav className="px-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-white text-blue-900 font-semibold"
                  : "hover:bg-blue-800"
              }`
            }
          >
            <FaThLarge />
            Dashboards
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-white text-blue-900 font-semibold"
                  : "hover:bg-blue-800"
              }`
            }
          >
            <FaCog />
            Settings
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;