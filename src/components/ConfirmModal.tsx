'use client'

import { useState } from 'react'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmButtonClass?: string
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass = 'bg-red-600 hover:bg-red-700',
    onConfirm,
    onCancel,
    isLoading = false
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Icon */}
                <div className="pt-6 pb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-4 text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm">{message}</p>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-2.5 px-4 rounded-lg border-2 border-border text-foreground/70 font-medium hover:bg-secondary transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${confirmButtonClass}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
