
import { useEffect, useState } from "react";
import {
  Bug,
  Search,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getBugs,
  deleteBug,
  createBug,
  updateBug,
} from "../services/bugService";

import BugForm from "../components/BugForm";

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

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function Bugs() {
  const [bugs, setBugs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);

  // Load bugs whenever the page, filters, or reload key changes.
  useEffect(() => {
    let cancelled = false;

    async function loadBugs() {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          size: pageSize,
        };

        if (appliedKeyword.trim()) {
          params.keyword = appliedKeyword.trim();
        }

        if (status) {
          params.status = status;
        }

        if (severity) {
          params.severity = severity;
        }

        const response = await getBugs(params);
        const data = response.data;

        if (!cancelled) {
          setBugs(data.content ?? []);
          setTotalPages(data.totalPages ?? 0);
          setTotalElements(data.totalElements ?? 0);
        }
      } catch (err) {
        console.error("Failed to load bugs:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load bugs. Check that the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBugs();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, appliedKeyword, status, severity, reloadKey]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(0);
    setAppliedKeyword(keyword);
  }

  function handleClearFilters() {
    setKeyword("");
    setAppliedKeyword("");
    setStatus("");
    setSeverity("");
    setPage(0);
  }

  // Create a new bug or update an existing bug.
  async function handleSaveBug(formData) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingBug) {
        await updateBug(editingBug.id, formData);
        setSuccess("Bug updated successfully.");
      } else {
        await createBug(formData);
        setSuccess("Bug created successfully.");
      }

      setShowForm(false);
      setEditingBug(null);
      setPage(0);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the bug. Please try again."
      );

      // Let BugForm display the request error too.
      throw err;
    } finally {
      setSaving(false);
    }
  }

  // Delete a bug and refresh the current list.
  async function handleDelete(id) {
    const confirmed = window.confirm(
      `Are you sure you want to delete Bug #${id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteBug(id);

      setSuccess("Bug deleted successfully.");

      if (bugs.length === 1 && page > 0) {
        setPage((currentPage) => currentPage - 1);
      } else {
        setReloadKey((key) => key + 1);
      }
    } catch (err) {
      console.error("Failed to delete bug:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete the bug. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const hasFilters = Boolean(
    keyword || appliedKeyword || status || severity
  );

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Bug Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Search, filter, and manage reported bugs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingBug(null);
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={17} />
            Report Bug
          </button>

          <Link
            to="/analyze"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Analyze a Log
          </Link>
        </div>
      </section>

      {/* Success message */}
      {success && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">{success}</p>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-sm font-semibold text-emerald-700"
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-sm font-semibold text-red-700"
            aria-label="Dismiss error message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Search and filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-4 lg:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by title, description, or keyword..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-80">
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(0);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              value={severity}
              onChange={(event) => {
                setSeverity(event.target.value);
                setPage(0);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All severities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 lg:flex-none"
            >
              <Search size={17} />
              Search
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <X size={17} />
                Clear
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Bugs table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-bold text-slate-900">Reported Bugs</h2>
            <p className="mt-1 text-sm text-slate-500">
              {totalElements} {totalElements === 1 ? "bug" : "bugs"} found
            </p>
          </div>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-slate-500">
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-sm">Loading bugs...</span>
          </div>
        ) : bugs.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Bug size={34} className="mx-auto mb-3 text-slate-400" />
            <h3 className="font-semibold text-slate-800">
              No bugs found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another search term or clear your filters.
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
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {bugs.map((bug) => (
                  <tr
                    key={bug.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="max-w-sm px-5 py-4">
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

                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBug(bug);
                            setShowForm(true);
                            setError("");
                            setSuccess("");
                          }}
                          title="Edit bug"
                          aria-label={`Edit bug ${bug.id}`}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(bug.id)}
                          disabled={deletingId === bug.id}
                          title="Delete bug"
                          aria-label={`Delete bug ${bug.id}`}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === bug.id ? (
                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalElements > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {page + 1} of {Math.max(totalPages, 1)}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setPage((currentPage) => currentPage - 1)
                }
                disabled={page === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((currentPage) => currentPage + 1)
                }
                disabled={page + 1 >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Create/Edit form */}
      {showForm && (
        <BugForm
          initialData={editingBug}
          onSubmit={handleSaveBug}
          onClose={() => {
            if (!saving) {
              setShowForm(false);
              setEditingBug(null);
            }
          }}
          saving={saving}
        />
      )}
    </div>
  );
}

export default Bugs;
