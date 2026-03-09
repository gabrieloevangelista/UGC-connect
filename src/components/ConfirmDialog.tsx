"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Icon } from "@iconify/react";

interface ConfirmOptions {
    title: string;
    message: ReactNode;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({
        title: "",
        message: "",
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        type: "info",
    });
    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>();

    const confirm = useCallback((newOptions: ConfirmOptions) => {
        setOptions({
            confirmText: "Confirmar",
            cancelText: "Cancelar",
            type: "info",
            ...newOptions,
        });
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        if (resolvePromise) resolvePromise(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (resolvePromise) resolvePromise(false);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
                        onClick={handleCancel}
                    ></div>

                    {/* Dialog Box */}
                    <div className="relative bg-white rounded-2xl shadow-xl border border-stone-100 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                                    ${options.type === "danger" ? "bg-red-50 text-red-500" :
                                        options.type === "warning" ? "bg-amber-50 text-amber-500" :
                                            "bg-blue-50 text-blue-500"}`}>
                                    {options.type === "danger" && <Icon icon="solar:danger-triangle-bold-duotone" width={24} />}
                                    {options.type === "warning" && <Icon icon="solar:info-circle-bold-duotone" width={24} />}
                                    {options.type === "info" && <Icon icon="solar:info-circle-linear" width={24} />}
                                </div>
                                <h3 className="text-xl font-medium text-stone-900">{options.title}</h3>
                            </div>
                            <div className="text-sm text-stone-500 mb-8 pl-1">
                                {options.message}
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition"
                                >
                                    {options.cancelText}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition text-white
                                        ${options.type === "danger" ? "bg-red-500 hover:bg-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.25)]" :
                                            options.type === "warning" ? "bg-amber-500 hover:bg-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.25)]" :
                                                "bg-stone-900 hover:bg-stone-800 shadow-[0_4px_12px_rgba(28,25,23,0.15)]"}`}
                                >
                                    {options.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm deve ser usado dentro de um ConfirmProvider");
    }
    return context;
}
