
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bug,
  ScanSearch,
  BugOff,
   History,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Bugs", path: "/bugs", icon: Bug },
  { name: "Log Analyzer", path: "/analyze", icon: ScanSearch },
   { name: "Analysis History", path: "/analysis-history", icon: History }
];

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-950 text-slate-300">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
          <BugOff size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">AI BugTracker </h1>
          <p className="text-xs text-slate-400">Log Analyzer</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        {navigation.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={19} />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-5">
        <p className="text-xs text-slate-500">AI Bug Tracker</p>
        <p className="mt-1 text-sm text-slate-300">Developer Workspace</p>
      </div>
    </aside>
  );
}

export default Sidebar;
