"use client";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        className="relative max-w-sm w-full mx-4 rounded-xl bg-gray-800 border border-gray-700 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- Header ---- */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-emerald-400">
            {title}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* ---- Message ---- */}
        <div className="px-6 py-4">
          <p className="text-gray-300">{message}</p>
        </div>

        {/* ---- Actions ---- */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-base font-semibold rounded-lg bg-gray-700 text-white hover:bg-gray-600 cursor-pointer transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 text-base font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
