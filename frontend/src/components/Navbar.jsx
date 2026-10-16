
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": {
    title: "Dashboard",
    subtitle: "Overview of your bug tracking activity",
  },
  "/bugs": {
    title: "Bug Management",
    subtitle: "Search, track, and manage reported bugs",
  },
  "/analyze": {
    title: "AI Log Analyzer",
    subtitle: "Understand errors with Gemini AI",
  },
};

function Navbar() {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] || pageTitles["/"];

  return (
    <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {page.title}
        </h2>

        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          {page.subtitle}
        </p>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
        AI
      </div>
    </header>
  );
}

export default Navbar;
