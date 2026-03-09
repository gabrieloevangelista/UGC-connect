"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Icon } from "@iconify/react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-0 opacity-100 ${toast.type === "success"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : toast.type === "error"
                                    ? "bg-red-50 text-red-800 border-red-200"
                                    : toast.type === "warning"
                                        ? "bg-amber-50 text-amber-800 border-amber-200"
                                        : "bg-white text-stone-800 border-stone-200"
                            }`}
                        role="alert"
                    >
                        <div className="shrink-0 flex items-center justify-center">
                            {toast.type === "success" && <Icon icon="solar:check-circle-bold" width={20} className="text-emerald-500" />}
                            {toast.type === "error" && <Icon icon="solar:danger-circle-bold" width={20} className="text-red-500" />}
                            {toast.type === "warning" && <Icon icon="solar:info-circle-bold" width={20} className="text-amber-500" />}
                            {toast.type === "info" && <Icon icon="solar:info-circle-linear" width={20} className="text-blue-500" />}
                        </div>
                        <p>{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 ml-2 text-stone-400 hover:text-stone-600 focus:outline-none"
                        >
                            <Icon icon="solar:close-circle-linear" width={18} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast deve ser usado dentro de um ToastProvider");
    }
    return context;
}
