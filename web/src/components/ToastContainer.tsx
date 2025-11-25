'use client';

import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle, Info } from 'lucide-react';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: Toast['type'], duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: Toast['type'] = 'info', duration: number = 3000) => {
        const id = Date.now().toString();
        const newToast: Toast = { id, message, type, duration };
        setToasts(prev => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastDisplay toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastDisplay({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const [isExiting, setIsExiting] = useState(false);

    const bgColor = {
        success: 'bg-green-900/90',
        error: 'bg-red-900/90',
        info: 'bg-blue-900/90',
        warning: 'bg-yellow-900/90',
    }[toast.type];

    const borderColor = {
        success: 'border-green-700',
        error: 'border-red-700',
        info: 'border-blue-700',
        warning: 'border-yellow-700',
    }[toast.type];

    const icon = {
        success: <Check className="w-5 h-5 text-green-300" />,
        error: <AlertCircle className="w-5 h-5 text-red-300" />,
        info: <Info className="w-5 h-5 text-blue-300" />,
        warning: <AlertCircle className="w-5 h-5 text-yellow-300" />,
    }[toast.type];

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 200);
    };

    return (
        <div
            className={`
                pointer-events-auto
                ${bgColor}
                border ${borderColor}
                rounded-lg
                p-4
                shadow-lg
                flex items-start gap-3
                text-white
                max-w-sm
                transition-all
                duration-200
                ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
            `}
        >
            <div className="flex-shrink-0 mt-0.5">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
                onClick={handleClose}
                className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
                aria-label="Close toast"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
