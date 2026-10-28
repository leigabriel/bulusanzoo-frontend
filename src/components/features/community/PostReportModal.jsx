import { useEffect, useRef, useState } from 'react';
import useScrollLock from '../../../hooks/use-scroll-lock';
import { POST_REPORT_REASONS } from './postReportReasons';

const DETAIL_MAX = 500;

const PostReportModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
    const [reason, setReason] = useState('');
    const [detail, setDetail] = useState('');
    const selectRef = useRef(null);
    useScrollLock(isOpen);

    // Reset each time it opens, otherwise the previous post's reason is still selected.
    useEffect(() => {
        if (!isOpen) return;
        setReason('');
        setDetail('');
        selectRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !loading) onClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, loading, onClose]);

    if (!isOpen) return null;

    const needsDetail = reason === 'other';
    // Optional on every reason so moderators can read why a post was flagged; required
    // only when the reporter could not find a matching reason.
    const canSubmit = Boolean(reason) && (!needsDetail || detail.trim().length > 0);

    const handleConfirm = () => {
        if (!canSubmit) return;
        onSubmit(reason, detail.trim());
    };

    return (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Report this post">
            <button
                type="button"
                aria-label="Close"
                onClick={loading ? undefined : onClose}
                className="absolute inset-0 backdrop-blur-sm bg-[#0f2a1a]/70"
            />

            <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto overscroll-contain rounded-3xl shadow-2xl p-6 bg-[#fbf6e9]">
                <h3 className="text-lg font-semibold text-[#1d4a2e]">Report This Post</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1d4a2e]/75">
                    Your report will be sent to admin/staff for moderation review.
                </p>

                <div className="mt-4">
                    <label htmlFor="post-report-reason" className="block text-xs font-semibold mb-2 text-[#1d4a2e]/70">
                        Why are you reporting this?
                    </label>
                    <select
                        id="post-report-reason"
                        ref={selectRef}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        className="w-full px-3 py-2 text-sm outline-none rounded-xl transition-colors border border-[#1d4a2e]/20 bg-white text-[#1d4a2e] focus:border-[#1f7a3e]"
                    >
                        <option value="">Select a reason</option>
                        {POST_REPORT_REASONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-4">
                    <label htmlFor="post-report-detail" className="block text-xs font-semibold mb-2 text-[#1d4a2e]/70">
                        Tell us more {needsDetail && <span className="text-red-600">*</span>}
                    </label>
                    <textarea
                        id="post-report-detail"
                        value={detail}
                        onChange={(event) => setDetail(event.target.value)}
                        rows={3}
                        maxLength={DETAIL_MAX}
                        required={needsDetail}
                        placeholder={needsDetail ? 'Briefly describe the problem' : 'Optional — add anything that helps us understand'}
                        className="w-full px-3 py-2 text-sm outline-none rounded-xl transition-colors border border-[#1d4a2e]/20 bg-white text-[#1d4a2e] placeholder:text-[#1d4a2e]/60 focus:border-[#1f7a3e]"
                    />
                    <p className="mt-1 text-right text-xs font-semibold text-[#1d4a2e]/60">
                        {detail.length}/{DETAIL_MAX}
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 min-h-11 border text-xs font-semibold transition-colors disabled:opacity-50 rounded-xl border-[#1d4a2e]/20 text-[#1d4a2e] hover:bg-[#e6f1df]"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading || !canSubmit}
                        className="px-4 py-2 min-h-11 border text-xs font-semibold transition-colors disabled:opacity-50 rounded-full bg-[#1d4a2e] border-black text-white hover:bg-[#1f7a3e]"
                    >
                        {loading ? 'Processing...' : 'Submit Report'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostReportModal;
