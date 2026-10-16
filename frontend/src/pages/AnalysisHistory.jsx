
import { useEffect, useState } from "react";
import {
  History,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  BrainCircuit,
  Lightbulb,
  Wrench,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";

import { getAnalysisHistory } from "../services/bugService";

function formatDate(dateString) {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString();
}

function AnalysisSection({ title, icon: Icon, content }) {
  if (!content) return null;

  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <Icon size={17} className="text-indigo-600" />
        {title}
      </h4>

      {Array.isArray(content) ? (
        <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
          {content}
        </p>
      )}
    </div>
  );
}

function AnalysisHistory() {
  const [analyses, setAnalyses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const response = await getAnalysisHistory();
      setAnalyses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load analysis history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600">
            <History size={24} />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Saved AI results
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Analysis History
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review previous log analyses and their suggested fixes.
          </p>
        </div>

        <button
          type="button"
          onClick={loadHistory}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            type="button"
            onClick={loadHistory}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-12 text-sm text-slate-500">
          <LoaderCircle size={20} className="animate-spin" />
          Loading saved analyses...
        </div>
      ) : !error && analyses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <FileText size={27} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No analyses yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Analyze an error log from the Log Analyzer page. Your saved
            results will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-slate-500">
            {analyses.length} saved {analyses.length === 1 ? "analysis" : "analyses"}
          </div>

          {analyses.map((analysis) => {
            const isExpanded = expandedId === analysis.id;

            return (
              <article
                key={analysis.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <BrainCircuit size={21} />
                    </div>

                    <div className="min-w-0">
                     <h2 className="wrap-break-word font-semibold text-slate-900">
                        {analysis.bug?.title ||
                          `Bug #${analysis.bug?.id ?? "Unknown"}`}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Analysis #{analysis.id}
                        {" · "}
                        {formatDate(analysis.createdAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : analysis.id)
                    }
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {isExpanded ? "Hide details" : "View details"}
                    {isExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-3 border-t border-slate-200 p-5">
                    <AnalysisSection
                      title="Error Explanation"
                      icon={BrainCircuit}
                      content={analysis.explanation}
                    />

                    <AnalysisSection
                      title="Possible Causes"
                      icon={Lightbulb}
                      content={analysis.possibleCauses}
                    />

                    <AnalysisSection
                      title="Suggested Steps"
                      icon={Wrench}
                      content={analysis.suggestedSteps}
                    />

                    {!analysis.explanation &&
                      !analysis.possibleCauses &&
                      !analysis.suggestedSteps && (
                        <p className="text-sm text-slate-500">
                          No analysis details are available for this record.
                        </p>
                      )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AnalysisHistory;
