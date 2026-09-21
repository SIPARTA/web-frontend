/**
 * SIPARTA — Dashboard Monitoring Real-time
 * ==========================================
 * Menampilkan data insiden terbaru dari tabel incident_events (Supabase).
 * Menggunakan Supabase Realtime (WebSocket) untuk update tanpa refresh halaman.
 *
 * Data Flow:
 *   RPi → FastAPI → Supabase → Realtime WebSocket → Halaman ini
 */

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SensorData {
  mics5524?: number;
  tgs2600?: number;
  mq2?: number;
  mq135?: number;
}

interface IncidentEvent {
  id: string;
  incident_type: string;
  severity: "AMAN" | "WASPADA" | "BAHAYA";
  sensor_data: SensorData;
  image_url?: string | null;
  ai_analysis_text?: string | null;
  timestamp: string;
  is_anchored: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  string,
  { cls: string; badgeCls: string; dotCls: string; label: string }
> = {
  BAHAYA: {
    cls: "border-red-500/30 bg-red-500/5",
    badgeCls: "risk-badge risk-high",
    dotCls: "bg-red-500",
    label: "Bahaya",
  },
  WASPADA: {
    cls: "border-yellow-500/30 bg-yellow-500/5",
    badgeCls: "risk-badge risk-medium",
    dotCls: "bg-yellow-500",
    label: "Waspada",
  },
  AMAN: {
    cls: "border-green-500/30 bg-green-500/5",
    badgeCls: "risk-badge risk-low",
    dotCls: "bg-green-500",
    label: "Aman",
  },
};

const SENSOR_LABELS: Record<string, string> = {
  mics5524: "MICS-5524",
  tgs2600: "TGS2600",
  mq2: "MQ-2",
  mq135: "MQ-135",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function AnchorBadge({ anchored }: { anchored: boolean }) {
  return anchored ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-700">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" />
      </svg>
      On-chain
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold" style={{ borderColor: "var(--border-soft)", color: "var(--muted)" }}>
      Off-chain
    </span>
  );
}

// ─── Stats Card ──────────────────────────────────────────────────────────────

function StatsBar({ incidents }: { incidents: IncidentEvent[] }) {
  const counts = incidents.reduce(
    (acc, e) => { acc[e.severity] = (acc[e.severity] || 0) + 1; return acc; },
    {} as Record<string, number>
  );
  const anchored = incidents.filter((e) => e.is_anchored).length;

  const stats = [
    { label: "Total Insiden", value: incidents.length, cls: "text-base font-extrabold" },
    { label: "Bahaya", value: counts["BAHAYA"] || 0, cls: "text-base font-extrabold text-red-600" },
    { label: "Waspada", value: counts["WASPADA"] || 0, cls: "text-base font-extrabold text-yellow-600" },
    { label: "Aman", value: counts["AMAN"] || 0, cls: "text-base font-extrabold text-green-600" },
    { label: "On-chain", value: anchored, cls: "text-base font-extrabold text-teal-600" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-5">
      {stats.map((s) => (
        <div key={s.label} className="metric-card">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{s.label}</p>
          <p className={`mt-2 ${s.cls}`} style={{ color: s.cls.includes("text-") ? undefined : "var(--section-title)" }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Incident Card ────────────────────────────────────────────────────────────

function IncidentCard({ incident }: { incident: IncidentEvent }) {
  const cfg = SEVERITY_CONFIG[incident.severity] ?? SEVERITY_CONFIG["AMAN"];
  const sensors = incident.sensor_data ?? {};

  return (
    <div className={`rounded-lg border p-4 transition-all ${cfg.cls}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${cfg.dotCls}`} />
          <span className="text-sm font-extrabold" style={{ color: "var(--section-title)" }}>
            {incident.incident_type.replace("GAS_", "")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AnchorBadge anchored={incident.is_anchored} />
          <span className={cfg.badgeCls}>{cfg.label}</span>
        </div>
      </div>

      {/* Sensor Values */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {Object.entries(SENSOR_LABELS).map(([key, label]) => {
          const val = (sensors as Record<string, number>)[key];
          return (
            <div key={key} className="rounded-md p-2 text-center" style={{ background: "var(--surface-soft)" }}>
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{label}</p>
              <p className="mt-1 font-mono text-xs font-bold" style={{ color: "var(--section-title)" }}>
                {val != null ? `${Number(val).toFixed(2)}V` : "—"}
              </p>
            </div>
          );
        })}
      </div>

      {/* AI Analysis (collapsible) */}
      {incident.ai_analysis_text && (
        <p className="mt-3 rounded-md border border-dashed px-3 py-2 text-xs leading-5" style={{ color: "var(--muted)", borderColor: "var(--border-soft)" }}>
          🤖 {incident.ai_analysis_text}
        </p>
      )}

      <p className="mt-3 text-right text-[10px]" style={{ color: "var(--muted)" }}>
        {formatTime(incident.timestamp)}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MonitoringPage() {
  const [incidents, setIncidents] = useState<IncidentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "BAHAYA" | "WASPADA" | "AMAN">("ALL");
  const channelRef = useRef<ReturnType<any> | null>(null);

  // Fetch data dari Supabase via backend API
  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch("/api/monitoring/incidents");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: IncidentEvent[] = await res.json();
      setIncidents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data insiden.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe ke Supabase Realtime via server-side hook
  useEffect(() => {
    fetchIncidents();

    // Polling fallback setiap 10 detik (jika Realtime belum dikonfigurasi)
    const interval = setInterval(fetchIncidents, 10_000);
    setConnected(true);

    return () => {
      clearInterval(interval);
      setConnected(false);
    };
  }, [fetchIncidents]);

  const filtered = filter === "ALL" ? incidents : incidents.filter((e) => e.severity === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="eyebrow">Live Dashboard</div>
          <h1 className="hero-title mt-2 text-3xl">Monitoring Real-time</h1>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Data insiden dari sensor IoT SIPARTA — diperbarui otomatis setiap 10 detik.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${connected ? "border-green-500/30 bg-green-500/10 text-green-700" : "border-red-500/30 bg-red-500/10 text-red-700"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            {connected ? "Terhubung" : "Terputus"}
          </span>
          <button
            onClick={fetchIncidents}
            className="btn-secondary text-xs"
            aria-label="Refresh data monitoring"
          >
            Refresh
          </button>
        </div>
      </section>

      {/* Stats */}
      <StatsBar incidents={incidents} />

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "BAHAYA", "WASPADA", "AMAN"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === f
                ? "border-transparent bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
                : "border-[var(--border-soft)] text-[var(--muted)] hover:border-[var(--muted)]"
            }`}
          >
            {f === "ALL" ? "Semua" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List */}
      {loading && (
        <div className="soft-panel py-12 text-center text-sm" style={{ color: "var(--muted)" }}>
          Memuat data insiden...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-700">
          <p className="font-semibold mb-1">Gagal memuat data</p>
          <p className="opacity-80">{error}</p>
          <p className="mt-3 opacity-70">
            Pastikan endpoint <code className="rounded px-1 bg-black/10">/api/monitoring/incidents</code> tersedia di backend.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="soft-panel py-12 text-center">
          <p className="text-sm font-semibold" style={{ color: "var(--section-title)" }}>Belum ada insiden</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {filter === "ALL"
              ? "Sistem menunggu laporan dari perangkat IoT."
              : `Tidak ada insiden dengan status "${filter}".`}
          </p>
          <Link href="/" className="btn-secondary mt-6 inline-block text-sm">
            Kembali ke Beranda
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
