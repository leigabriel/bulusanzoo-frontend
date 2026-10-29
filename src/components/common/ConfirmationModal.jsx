import { useContext, useEffect, useRef } from 'react';
import useScrollLock from '../../hooks/use-scroll-lock';
import WorkspaceThemeContext from './WorkspaceThemeContext';

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onClose,
    danger = false,
    loading = false,
    loadingLabel = 'Processing...',
    requireInput = false,
    inputLabel = 'Reason',
    inputPlaceholder = 'Enter details',
    inputValue = '',
    onInputChange,
    selectLabel = 'Category',
    selectPlaceholder = 'Select an option',
    selectOptions = null,
    selectValue = '',
    onSelectChange,
    confirmDisabled = false,
    variant = 'default'
}) => {
    const cancelButtonRef = useRef(null);
    const workspaceTheme = useContext(WorkspaceThemeContext);
    const isModerationVariant = variant === 'moderation' && !workspaceTheme;
    useScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !loading) {
                onClose();
            }
        };

        cancelButtonRef.current?.focus();
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, loading, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
            <button
                type="button"
                aria-label="Close"
                onClick={loading ? undefined : onClose}
                className={`absolute inset-0 backdrop-blur-sm ${isModerationVariant ? 'bg-black/65' : 'bg-black/55'}`}
            />

            <div className={`relative max-h-[90dvh] w-full max-w-md overflow-y-auto overscroll-contain shadow-2xl p-5 sm:p-6 rounded-2xl ${isModerationVariant
                ? 'bg-[#141414] border border-emerald-900/50'
                : 'bg-[#fbf6e9]'
                }`}>
                <h3 id="confirmation-title" className={`text-lg font-bold leading-snug ${isModerationVariant ? 'text-white' : 'text-[#1d4a2e]'}`}>{title}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${isModerationVariant ? 'text-emerald-100/80' : 'text-[#1d4a2e]/75'}`}>{message}</p>

                {selectOptions && (
                    <div className="mt-4">
                        <label htmlFor="confirmation-select" className={`block text-xs font-semibold mb-2 ${isModerationVariant ? 'text-emerald-300/80' : 'text-gray-500'}`}>
                            {selectLabel}
                        </label>
                        <select
                            id="confirmation-select"
                            value={selectValue}
                            onChange={(event) => onSelectChange?.(event.target.value)}
                            className={`w-full px-3 py-2.5 text-base sm:text-sm outline-none rounded-lg transition-colors ${isModerationVariant
                                ? 'border border-emerald-900/70 bg-black/30 text-white focus:border-emerald-500'
                                : workspaceTheme
                                    ? 'border border-gray-300 bg-green-50 text-gray-900 focus:border-green-400'
                                    : 'border border-gray-300 bg-white text-gray-900 focus:border-gray-700'
                                }`}
                        >
                            <option value="">{selectPlaceholder}</option>
                            {selectOptions.map((option) => {
                                const value = typeof option === 'string' ? option : option.value;
                                const label = typeof option === 'string' ? option : option.label;
                                return <option key={value} value={value}>{label}</option>;
                            })}
                        </select>
                    </div>
                )}

                {requireInput && (
                    <div className="mt-4">
                        <label htmlFor="confirmation-input" className={`block text-xs font-semibold mb-2 ${isModerationVariant ? 'text-emerald-300/80' : 'text-gray-500'}`}>
                            {inputLabel}
                        </label>
                        <textarea
                            id="confirmation-input"
                            value={inputValue}
                            onChange={(event) => onInputChange?.(event.target.value)}
                            className={`w-full px-3 py-2.5 text-base sm:text-sm outline-none rounded-lg transition-colors ${isModerationVariant
                                ? 'border border-emerald-900/70 bg-black/30 text-white placeholder:text-emerald-100/35 focus:border-emerald-500'
                                : workspaceTheme
                                    ? 'border border-gray-300 bg-green-50 text-gray-900 focus:border-green-400'
                                    : 'border border-gray-300 text-gray-900 focus:border-gray-700'
                                }`}
                            rows={3}
                            placeholder={inputPlaceholder}
                            maxLength={255}
                        />
                    </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className={`min-h-11 px-5 py-2 border text-sm font-semibold transition-colors disabled:opacity-50 rounded-full ${isModerationVariant
                            ? 'border-emerald-800/70 text-emerald-100 hover:bg-emerald-900/30'
                            : 'border-[#1d4a2e]/25 text-[#1d4a2e] hover:bg-[#e6f1df]'
                            }`}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading || confirmDisabled}
                        className={`min-h-11 px-5 py-2 border text-sm font-semibold transition-colors disabled:opacity-50 rounded-full ${danger
                            ? (isModerationVariant
                                ? 'bg-red-600 border-red-600 text-white hover:bg-red-700'
                                : 'bg-red-600 border-red-600 text-white hover:bg-red-700')
                            : workspaceTheme
                                ? 'bg-green-400 border-green-400 text-gray-900 hover:bg-green-300'
                            : (isModerationVariant
                                ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-[#1d4a2e] border-[#1d4a2e] text-white hover:bg-[#1f7a3e]')
                            }`}
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className={`h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white ${(!danger && workspaceTheme) ? 'border-black/30 border-t-black' : ''}`}
                                />
                                {loadingLabel}
                            </span>
                        ) : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
