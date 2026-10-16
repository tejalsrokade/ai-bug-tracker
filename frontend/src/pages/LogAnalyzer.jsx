
import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Bug,
  FileText,
  LoaderCircle,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Wrench,
} from "lucide-react";

import { getBugs, analyzeLog } from "../services/bugService";

function AnalysisSection({ title, icon: Icon, content }) {
  if (!content) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={19} className="text-indigo-600" />
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>

      {Array.isArray(content) ? (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
          {content}
        </p>
      )}
    </section>
  );
}

function LogAnalyzer() {
  const [bugs, setBugs] = useState([]);
  const [bugId, setBugId] = useState("");
  const [errorLog, setErrorLog] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const [loadingBugs, setLoadingBugs] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchBugs() {
      try {
        const response = await getBugs({
          page: 0,
          size: 100,
        });

        const bugList = response.data.content ?? [];
        setBugs(bugList);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load bugs. Please check your backend."
        );
      } finally {
        setLoadingBugs(false);
      }
    }

    fetchBugs();
  }, []);

  async function handleAnalyze(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setAnalysis(null);

    if (!bugId) {
      setError("Please select a bug first.");
      return;
    }

    if (!errorLog.trim()) {
      setError("Please paste an error log to analyze.");
      return;
    }

    setAnalyzing(true);

    try {
      const response = await analyzeLog({
        bugId: Number(bugId),
        errorLog: errorLog.trim(),
      });

      setAnalysis(response.data);
      setSuccess("Log analyzed and analysis saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-indigo-600">
          <BrainCircuit size={25} />
          <span className="text-sm font-semibold uppercase tracking-wide">
            AI-powered debugging
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Log Analyzer
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Submit an error log to understand the issue and discover
          possible solutions with AI.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form
            onSubmit={handleAnalyze}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Submit Error Log
              </h2>
            </div>

            <div>
              <label
                htmlFor="bugId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Select Bug
              </label>

              <select
                id="bugId"
                value={bugId}
                onChange={(event) => setBugId(event.target.value)}
                disabled={loadingBugs || analyzing}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              >
                <option value="">
                  {loadingBugs
                    ? "Loading bugs..."
                    : "Choose a bug to analyze"}
                </option>

                {bugs.map((bug) => (
                  <option key={bug.id} value={bug.id}>
                    #{bug.id} — {bug.title}
                  </option>
                ))}
              </select>

              {!loadingBugs && bugs.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No bugs found. Create a bug on the Bugs page first.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="errorLog"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Error Log / Stack Trace
              </label>

              <textarea
                id="errorLog"
                value={errorLog}
                onChange={(event) => setErrorLog(event.target.value)}
                placeholder={`Paste your Java exception or stack trace here...\n\nExample:\njava.lang.NullPointerException\nat com.bugtracker.service.BugService.getBug(BugService.java:25)`}
                rows={12}
                maxLength={20000}
                required
                disabled={analyzing}
                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {errorLog.length}/20,000 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={
                analyzing ||
                loadingBugs ||
                bugs.length === 0 ||
                !bugId ||
                !errorLog.trim()
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Analyzing Log...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Log with AI
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <BrainCircuit size={23} />
            </div>

            <h2 className="font-semibold text-slate-900">
              AI Analysis
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your analysis will include an explanation of the error,
              potential root causes, and practical debugging steps.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                <Bug size={18} className="text-indigo-600" />
                <span className="text-sm text-slate-700">
                  Understand the error
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                <Lightbulb size={18} className="text-indigo-600" />
                <span className="text-sm text-slate-700">
                  Identify possible causes
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                <Wrench size={18} className="text-indigo-600" />
                <span className="text-sm text-slate-700">
                  Find suggested fixes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Analysis Results
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Saved analysis #{analysis.id}
                {analysis.bug?.title
                  ? ` · ${analysis.bug.title}`
                  : ""}
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={15} />
              Analysis saved
            </span>
          </div>

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
        </div>
      )}
    </div>
  );
}

export default LogAnalyzer;
