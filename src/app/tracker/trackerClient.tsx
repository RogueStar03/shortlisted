"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type {
  Application,
  ApplicationStatus,
} from "@/lib/supabase/applications";
import AddApplicationModal from "./addApplicationModal";
import Link from "next/link";
import ScoreRing from "@/components/ui/ScoreRing";
import Toast from "@/components/tracker/Toast";
import Confetti from "@/components/tracker/Confetti";
import OfferCelebration from "@/components/tracker/OfferCelebration";
import { getMatchColor } from "@/lib/utils/matchColor";

// ── Constants ─────────────────────────────────────────────────────────────────
const COLUMNS: {
  id: ApplicationStatus;
  label: string;
  stageVar: string;
}[] = [
  { id: "applied", label: "Applied", stageVar: "var(--sl-stage-applied)" },
  { id: "screening", label: "Screening", stageVar: "var(--sl-stage-screening)" },
  { id: "interview", label: "Interview", stageVar: "var(--sl-stage-interview)" },
  { id: "offer", label: "Offer", stageVar: "var(--sl-stage-offer)" },
  { id: "rejected", label: "Rejected", stageVar: "var(--sl-stage-rejected)" },
];

// ── Paywall ───────────────────────────────────────────────────────────────────
function PaywallOverlay() {
  return (
    <div style={{ position: "relative", minHeight: 600, background: "var(--sl-base)" }}>
      {/* Blurred fake board */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, padding: "24px 16px" }}>
          {COLUMNS.map((col) => (
            <div key={col.id} style={{ background: "var(--sl-surface)", borderRadius: "var(--sl-radius-xl)", padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.stageVar }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--sl-text-muted)" }}>{col.label}</span>
              </div>
              {[1, 2].map((i) => (
                <div key={i} style={{ background: "var(--sl-card)", borderRadius: "var(--sl-radius-xl)", padding: 12, marginBottom: 8 }}>
                  <div style={{ height: 10, background: "var(--sl-card-hover)", borderRadius: 4, width: "75%", marginBottom: 6 }} />
                  <div style={{ height: 8, background: "var(--sl-surface)", borderRadius: 4, width: "50%" }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "var(--sl-surface)", border: "1px solid var(--sl-border-light)", borderRadius: "var(--sl-radius-2xl)", boxShadow: "var(--sl-shadow-modal)", padding: 32, maxWidth: 360, width: "100%", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--sl-accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ color: "var(--sl-accent)", fontSize: 18 }}>▦</span>
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--sl-text)", marginBottom: 8 }}>Application Tracker</h2>
          <p style={{ fontSize: 13, color: "var(--sl-text-muted)", marginBottom: 20, lineHeight: 1.6 }}>
            Track every application, move cards as you progress, and never lose track of where you stand.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "var(--sl-text-muted)", marginBottom: 24, textAlign: "left" }}>
            {["Kanban pipeline — Applied to Offer", "Notes and JD link per application", "Follow-up reminders", "Analytics dashboard"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--sl-success)" }}>✓</span>
                {f}
              </div>
            ))}
          </div>
          <Link
            href="/#pricing"
            style={{ display: "block", padding: "10px 0", background: "var(--sl-gradient-accent)", color: "#fff", fontSize: 13, fontWeight: 500, borderRadius: "var(--sl-radius-lg)", textDecoration: "none" }}
          >
            Get Placement Pack →
          </Link>
          <p style={{ marginTop: 12, fontSize: 11, color: "var(--sl-text-dim)" }}>
            One-time purchase · No auto-renewal · 7-day refund
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Application Card ──────────────────────────────────────────────────────────
function AppCard({
  app,
  index,
  onDelete,
  onEdit,
}: {
  app: Application;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (app: Application) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const daysAgo = Math.floor(
    (Date.now() - new Date(app.applied_at).getTime()) / (1000 * 60 * 60 * 24),
  );
  const matchScore = (app as Application & { match_score?: number }).match_score;
  const matchColor = getMatchColor(matchScore ?? 0);

  return (
    <Draggable draggableId={app.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: hovered ? "var(--sl-card-hover)" : "var(--sl-card)",
            borderRadius: "var(--sl-radius-xl)",
            padding: "14px 16px",
            marginBottom: 10,
            borderLeft: `3px solid ${matchColor}`,
            cursor: snapshot.isDragging ? "grabbing" : "grab",
            transition: "var(--sl-transition-fast)",
            boxShadow: snapshot.isDragging ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
            ...provided.draggableProps.style,
          }}
        >
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--sl-text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {app.company}
              </p>
              <p style={{ fontSize: 12, color: "var(--sl-text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {app.role}
              </p>
            </div>
            {matchScore != null && (
              <ScoreRing score={matchScore} size={42} />
            )}
          </div>

          {/* Date + JD link */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "var(--sl-text-dim)" }}>
              {daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`}
            </span>
            {app.jd_url && (
              <a
                href={app.jd_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: 11, color: "var(--sl-accent)", textDecoration: "none" }}
              >
                JD →
              </a>
            )}
          </div>

          {/* Notes */}
          {app.notes && (
            <p style={{ marginTop: 8, fontSize: 11, color: "var(--sl-text-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", background: "var(--sl-base)", borderLeft: "2px solid var(--sl-border)", padding: "4px 8px", borderRadius: "var(--sl-radius-xs)" }}>
              {app.notes}
            </p>
          )}

          {/* Edit/delete actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Remove ${app.company}?`)) onDelete(app.id);
              }}
              style={{
                fontSize: 16,
                color: "var(--sl-danger)",
                background: "none",
                border: "none",
                cursor: "pointer",
                opacity: hovered ? 1 : 0.2,
                transition: "opacity 0.15s",
                lineHeight: 1,
                padding: "2px 4px",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────
function Column({
  col,
  apps,
  onDelete,
  onEdit,
}: {
  col: (typeof COLUMNS)[0];
  apps: Application[];
  onDelete: (id: string) => void;
  onEdit: (app: Application) => void;
}) {
  return (
    <div
      style={{
        background: "var(--sl-surface)",
        borderRadius: "var(--sl-radius-xl)",
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 12px 10px", borderBottom: "1px solid var(--sl-border)" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.stageVar, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--sl-text-muted)", flex: 1 }}>{col.label}</span>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--sl-text-dim)", background: "var(--sl-card)", padding: "2px 6px", borderRadius: 999, fontFamily: "var(--font-mono, monospace)" }}>
          {apps.length}
        </span>
      </div>

      {/* Cards */}
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: "0 0 var(--sl-radius-xl) var(--sl-radius-xl)",
              background: snapshot.isDraggingOver ? "var(--sl-accent-glow)" : "transparent",
              transition: "var(--sl-transition-fast)",
            }}
          >
            {apps.map((app, index) => (
              <AppCard key={app.id} app={app} index={index} onDelete={onDelete} />
            ))}
            {provided.placeholder}
            {apps.length === 0 && !snapshot.isDraggingOver && (
              <div style={{ margin: 8, padding: "20px 12px", border: "1px dashed var(--sl-border)", borderRadius: "var(--sl-radius-lg)", textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "var(--sl-text-dim)", margin: 0 }}>Drop here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

// ── Main Tracker Client ───────────────────────────────────────────────────────
export default function TrackerClient({
  initialApplications,
  isPack,
}: {
  initialApplications: Application[];
  isPack: boolean;
}) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);


  // Celebration state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [confetti, setConfetti] = useState<{ active: boolean; intensity: "normal" | "big" }>({ active: false, intensity: "normal" });
  const [offerCard, setOfferCard] = useState<{ company: string; role: string } | null>(null);

  function showToast(message: string) {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }

  // Celebration state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [confetti, setConfetti] = useState<{ active: boolean; intensity: "normal" | "big" }>({ active: false, intensity: "normal" });
  const [offerCard, setOfferCard] = useState<{ company: string; role: string } | null>(null);

  function showToast(message: string) {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }

  const byStatus = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status);

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as ApplicationStatus;
    const movedApp = applications.find((a) => a.id === draggableId);

    // Optimistic update
    setApplications((prev) =>
      prev.map((a) => (a.id === draggableId ? { ...a, status: newStatus } : a)),
    );

    // Persist to database
    try {
      const res = await fetch(`/api/applications/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");

      // Trigger celebrations after confirmed save
      if (newStatus === "screening") {
        showToast("Moving forward — nice.");
      } else if (newStatus === "interview") {
        showToast("Interview stage! You got this.");
        setConfetti({ active: true, intensity: "normal" });
        setTimeout(() => setConfetti({ active: false, intensity: "normal" }), 3000);
      } else if (newStatus === "offer" && movedApp) {
        setConfetti({ active: true, intensity: "big" });
        setOfferCard({ company: movedApp.company, role: movedApp.role });
        setTimeout(() => setConfetti({ active: false, intensity: "big" }), 6000);
      }
    } catch {
      // Revert on failure
      setApplications((prev) =>
        prev.map((a) =>
          a.id === draggableId
            ? { ...a, status: source.droppableId as ApplicationStatus }
            : a,
        ),
      );
    }
  }

  async function handleAdd(
    data: Parameters<typeof fetch>[1] extends RequestInit
      ? never
      : {
          company: string;
          role: string;
          status: ApplicationStatus;
          applied_at: string;
          jd_url: string | null;
          notes: string | null;
        },
  ) {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create");
    const newApp = await res.json();
    setApplications((prev) => [newApp, ...prev]);
  }

  async function handleDelete(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    try {
      const res = await fetch(`/api/applications/${removed.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch {
      window.location.reload();
    }
  }

  const totalApps = applications.length;
  const activeApps = applications.filter(
    (a) => !["rejected", "withdrawn"].includes(a.status),
  ).length;

  if (!isPack) return <PaywallOverlay />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--sl-base)" }}>
      {/* Header bar */}
      <div style={{ borderBottom: "1px solid var(--sl-border)", background: "var(--sl-base)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h1 style={{ fontSize: 13, fontWeight: 600, color: "var(--sl-text)", margin: 0 }}>Application Tracker</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--sl-text-muted)" }}>
            <span>{totalApps} total</span>
            <span>·</span>
            <span>{activeApps} active</span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "6px 14px",
            background: "var(--sl-gradient-accent)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 500,
            borderRadius: "var(--sl-radius-lg)",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Add application
        </button>
      </div>

      {/* Kanban board */}
      <div style={{ padding: 16, overflowX: "auto" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 8, minWidth: 900 }}>
            {COLUMNS.map((col) => (
              <Column key={col.id} col={col} apps={byStatus(col.id)} onDelete={handleDelete} />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Empty state */}
      {applications.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--sl-text)", marginBottom: 4 }}>No applications yet</p>
          <p style={{ fontSize: 12, color: "var(--sl-text-muted)", marginBottom: 16 }}>Add your first application to start tracking</p>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: "8px 16px", background: "var(--sl-gradient-accent)", color: "#fff", fontSize: 12, fontWeight: 500, borderRadius: "var(--sl-radius-lg)", border: "none", cursor: "pointer" }}
          >
            + Add application
          </button>
        </div>
      )}

      {/* Celebration layers */}
      <Toast message={toast.message} visible={toast.visible} />
      <Confetti active={confetti.active} intensity={confetti.intensity} />
      {offerCard && (
        <OfferCelebration
          company={offerCard.company}
          role={offerCard.role}
          onClose={() => setOfferCard(null)}
        />
      )}

      {showModal && (
        <AddApplicationModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
