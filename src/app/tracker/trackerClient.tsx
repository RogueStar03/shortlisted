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

// ── Constants ─────────────────────────────────────────────────────────────────
const COLUMNS: {
  id: ApplicationStatus;
  label: string;
  color: string;
  dot: string;
}[] = [
  {
    id: "applied",
    label: "Applied",
    color: "bg-blue-50 border-blue-100",
    dot: "bg-blue-400",
  },
  {
    id: "screening",
    label: "Screening",
    color: "bg-purple-50 border-purple-100",
    dot: "bg-purple-400",
  },
  {
    id: "interview",
    label: "Interview",
    color: "bg-amber-50 border-amber-100",
    dot: "bg-amber-400",
  },
  {
    id: "offer",
    label: "Offer",
    color: "bg-green-50 border-green-100",
    dot: "bg-green-400",
  },
  {
    id: "rejected",
    label: "Rejected",
    color: "bg-gray-50 border-gray-100",
    dot: "bg-gray-300",
  },
  {
    id: "withdrawn",
    label: "Withdrawn",
    color: "bg-slate-50 border-slate-100",
    dot: "bg-slate-300",
  },
];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: "text-blue-600 bg-blue-50 border-blue-100",
  screening: "text-purple-600 bg-purple-50 border-purple-100",
  interview: "text-amber-600 bg-amber-50 border-amber-100",
  offer: "text-green-600 bg-green-50 border-green-100",
  rejected: "text-gray-500 bg-gray-50 border-gray-100",
  withdrawn: "text-gray-400 bg-gray-50 border-gray-100",
};

// ── Paywall ───────────────────────────────────────────────────────────────────
function PaywallOverlay() {
  return (
    <div className="relative min-h-[600px]">
      {/* Blurred fake board */}
      <div className="filter blur-sm pointer-events-none select-none">
        <div className="grid grid-cols-6 gap-4 px-4 py-6">
          {COLUMNS.map((col) => (
            <div key={col.id} className={`rounded-xl border p-3 ${col.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                <span className="text-xs font-medium text-gray-600">
                  {col.label}
                </span>
              </div>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-100 p-3 mb-2"
                >
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-gray-50 rounded w-1/2" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-sm mx-4 text-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 text-lg">▦</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-2">
            Application Tracker
          </h2>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Track every application, move cards as you progress, and never lose
            track of where you stand.
          </p>
          <div className="space-y-2 text-xs text-gray-500 mb-6 text-left">
            {[
              "Kanban pipeline — Applied to Offer",
              "Notes and JD link per application",
              "Follow-up reminders",
              "Analytics dashboard",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {f}
              </div>
            ))}
          </div>
          <Link
            href="/#pricing"
            className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Get Placement Pack →
          </Link>
          <p className="mt-3 text-xs text-gray-400">
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
  const daysAgo = Math.floor(
    (Date.now() - new Date(app.applied_at).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Draggable draggableId={app.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border border-gray-100 p-3 mb-2 cursor-grab active:cursor-grabbing transition-shadow ${
            snapshot.isDragging
              ? "shadow-lg border-blue-200 rotate-1"
              : "hover:border-gray-200 hover:shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {app.company}
              </p>
              <p className="text-xs text-gray-500 truncate">{app.role}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(app);
                }}
                className="text-gray-300 hover:text-blue-500 transition-colors text-xs leading-none"
                title="Edit"
              >
                ✎
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(app.id);
                }}
                className="text-gray-300 hover:text-red-400 transition-colors text-sm leading-none"
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-400">
              {daysAgo === 0
                ? "Today"
                : daysAgo === 1
                  ? "Yesterday"
                  : `${daysAgo}d ago`}
            </span>
            {app.jd_url && (
              <a
                href={app.jd_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-blue-500 hover:underline"
              >
                JD →
              </a>
            )}
          </div>

          {app.notes && (
            <p className="mt-2 text-[10px] text-gray-400 line-clamp-2 leading-relaxed border-t border-gray-50 pt-2">
              {app.notes}
            </p>
          )}
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
      className={`rounded-xl border flex flex-col min-h-[400px] ${col.color}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-black/5">
        <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
        <span className="text-xs font-semibold text-gray-700">{col.label}</span>
        <span className="ml-auto text-[10px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-100">
          {apps.length}
        </span>
      </div>

      {/* Cards */}
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? "bg-blue-50/50" : ""
            }`}
          >
            {apps.map((app, index) => (
              <AppCard
                key={app.id}
                app={app}
                index={index}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
            {provided.placeholder}
            {apps.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-[10px] text-gray-300 text-center mt-8">
                Drop here
              </p>
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
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);


  // Group by status
  const byStatus = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status);

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as ApplicationStatus;

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

  function requestDelete(id: string) {
    const app = applications.find((a) => a.id === id);
    if (app) setDeleteTarget(app);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const removed = deleteTarget;
    setDeleteTarget(null);
    setApplications((prev) => prev.filter((a) => a.id !== removed.id));
    try {
      const res = await fetch(`/api/applications/${removed.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch {
      setApplications((prev) => [removed, ...prev]);
    }
  }

  async function handleEdit(
    id: string,
    data: {
      company: string;
      role: string;
      status: ApplicationStatus;
      applied_at: string;
      jd_url: string | null;
      notes: string | null;
    },
  ) {
    const previous = applications.find((a) => a.id === id);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
    );
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch {
      if (previous) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? previous : a)),
        );
      }
    }
  }

  const totalApps = applications.length;
  const activeApps = applications.filter(
    (a) => !["rejected", "withdrawn"].includes(a.status),
  ).length;

  if (!isPack) return <PaywallOverlay />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold text-gray-900">
            Application Tracker
          </h1>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{totalApps} total</span>
            <span>·</span>
            <span>{activeApps} active</span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          + Add application
        </button>
      </div>

      {/* Kanban board */}
      <div className="p-4 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-6 gap-3 min-w-[1080px]">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                col={col}
                apps={byStatus(col.id)}
                onDelete={requestDelete}
                onEdit={(app) => setEditingApp(app)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Empty state */}
      {applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-medium text-gray-900 mb-1">
            No applications yet
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Add your first application to start tracking
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            + Add application
          </button>
        </div>
      )}

      {showModal && (
        <AddApplicationModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}

      {editingApp && (
        <AddApplicationModal
          onClose={() => setEditingApp(null)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          editingApp={editingApp}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete application"
          message={`Remove ${deleteTarget.company} — ${deleteTarget.role}? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
