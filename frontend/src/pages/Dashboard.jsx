
import { useEffect, useState } from "react";
import {
  Bug,
  CircleAlert,
  Clock3,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { getBugStats, getBugs } from "../services/bugService";

const statCards = [
  {
    key: "totalBugs",
    label: "Total Bugs",
    icon: Bug,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    key: "openBugs",
    label: "Open Bugs",
    icon: CircleAlert,
    color: "bg-red-100 text-red-600",
  },
  {
    key: "inProgressBugs",
    label: "In Progress",
    icon: Clock3,
    color: "bg-amber-100 text-amber-600",
  },
  {
    key: "resolvedBugs",
    label: "Resolved",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-600",
  },
];

const statusStyles = {
  OPEN: "bg-red-50 text-red-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
};

const severityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

function formatLabel(value = "") {
  return value.replaceAll("_", " ");
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [statsResponse, bugsResponse] = await Promise.all([
          getBugStats(),
          getBugs({ page: 0, size: 5 }),
        ]);

        setStats(statsResponse.data);

        // Spring Data Page responses contain a "content" array.
        setRecentBugs(bugsResponse.data.content ?? []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError(
          "Unable to load dashboard data. Check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500">
        <RefreshCw className="animate-spin" size={20} />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, Developer
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Here's an overview of your bug tracking activity.
        </p>
      </section>

      {/* Statistics cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div
            key={key}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {label}
              </p>

              <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon size={21} />
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {stats?.[key] ?? 0}
            </p>
          </div>
        ))}
      </section>

      {/* Recent bugs table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Bugs
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest reported issues
            </p>
          </div>

          <a
            href="/bugs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View all
          </a>
        </div>

        {recentBugs.length === 0 ? (
          <div className="p-10 text-center">
            <Bug className="mx-auto mb-3 text-slate-400" size={32} />
            <p className="font-medium text-slate-700">
              No bugs found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Report a bug to see it here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Bug</th>
                  <th className="px-5 py-4 font-semibold">Severity</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentBugs.map((bug) => (
                  <tr key={bug.id} className="hover:bg-slate-50">
                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate font-semibold text-slate-800">
                        {bug.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Bug #{bug.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                          severityStyles[bug.severity] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatLabel(bug.severity)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[bug.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatLabel(bug.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDate(bug.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
