import { useEffect, useState } from 'react';
import { communityAPI, getProfileImageUrl } from '../../../services/api-client';
import { notify } from '../../../utils/toast';

const buildCommentTree = (items) => {
    const byId = new Map();
    const roots = [];

    items.forEach((comment) => {
        byId.set(comment.id, { ...comment, replies: [] });
    });

    byId.forEach((comment) => {
        if (comment.parentCommentId && byId.has(comment.parentCommentId)) {
            byId.get(comment.parentCommentId).replies.push(comment);
        } else {
            roots.push(comment);
        }
    });

    return roots;
};

const CommentSection = ({ postId, currentUser, isGuest = false, onRequireAuth, refreshTrigger, onRequireConfirmation }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyText, setReplyText] = useState('');

    const loadComments = async () => {
        setLoading(true);
        try {
            const response = await communityAPI.getComments(postId, currentUser?.role || 'user');
            setComments(response.comments || []);
        } catch {
            notify.error("Couldn't load comments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId, refreshTrigger]);

    const submitComment = async () => {
        const value = commentText.trim();
        if (!value) return;
        if (isGuest && onRequireAuth?.()) return;

        try {
            await communityAPI.createComment(postId, value, null, currentUser?.role || 'user');
            setCommentText('');
            await loadComments();
            // No toast: the comment appearing in the list is the confirmation.
        } catch {
            notify.error("Couldn't add comment.");
        }
    };

    const submitReply = async (parentCommentId) => {
        const value = replyText.trim();
        if (!value) return;
        if (isGuest && onRequireAuth?.()) return;

        try {
            await communityAPI.createComment(postId, value, parentCommentId, currentUser?.role || 'user');
            setReplyText('');
            setReplyingToId(null);
            await loadComments();
            // No toast: the reply appearing in the thread is the confirmation.
        } catch {
            notify.error("Couldn't add reply.");
        }
    };

    const saveEdit = async () => {
        const value = editingText.trim();
        if (!value) return;

        try {
            await communityAPI.updateComment(editingId, value, currentUser?.role || 'user');
            setEditingId(null);
            setEditingText('');
            await loadComments();
            // No toast: the updated text appearing in place is the confirmation.
        } catch {
            notify.error("Couldn't update comment.");
        }
    };

    const removeComment = async (commentId) => {
        try {
            if (onRequireConfirmation) {
                const confirmed = await onRequireConfirmation({
                    type: 'delete-comment',
                    title: 'Delete This Comment?',
                    message: 'This action cannot be undone.',
                    confirmLabel: 'Delete Comment',
                    danger: true,
                    loadingLabel: 'Deleting...',
                    // Handed to the dialog so it can show progress while the request runs.
                    onConfirmAsync: async () => {
                        await communityAPI.deleteComment(commentId, currentUser?.role || 'user');
                        await loadComments();
                        notify.success('Comment removed.');
                    }
                });
                if (!confirmed) return;
                return;
            }

            await communityAPI.deleteComment(commentId, currentUser?.role || 'user');
            await loadComments();
            notify.success('Comment removed.');
        } catch {
            notify.error("Couldn't remove comment.");
        }
    };

    const toggleHeart = async (commentId) => {
        if (isGuest && onRequireAuth?.()) return;
        try {
            await communityAPI.toggleCommentHeart(commentId, currentUser?.role || 'user');
            await loadComments();
            // No toast: the heart filling in and the count changing is the confirmation.
        } catch {
            notify.error("Couldn't update heart.");
        }
    };

    const handleReport = async (comment) => {
        if (isGuest && onRequireAuth?.()) return;
        try {
            const reason = await onRequireConfirmation?.({
                title: 'Report This Comment?',
                message: 'Your report will be sent to admin/staff for moderation review.',
                confirmLabel: 'Submit Report',
                requireInput: true,
                inputLabel: 'Reason',
                inputPlaceholder: 'Briefly explain your concern'
            });
            if (!reason) return;

            await communityAPI.reportComment(comment.id, reason, currentUser?.role || 'user');
            await loadComments();
            notify.success('Comment reported.');
        } catch {
            notify.error("Couldn't submit report.");
        }
    };

    const commentTree = buildCommentTree(comments);

    const renderComment = (comment, depth = 0) => {
        const isOwner = comment.isOwner === true;
        const maxIndentLevel = 4;
        const clampedDepth = Math.min(depth, maxIndentLevel);

        return (
            <div key={comment.id} className={`flex gap-4 py-6 ${depth > 0 ? 'border-l border-[#1d4a2e]/15 pl-4 md:pl-6 mt-4' : ''}`}>
                <img loading="lazy" decoding="async"
                    src={getProfileImageUrl(comment.author.profileImage) || '/profile-img/default-avatar.svg'}
                    alt="author"
                    className="w-10 h-10 rounded-full object-cover border border-[#1d4a2e]/20 shrink-0"
                />
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-[#1d4a2e]">
                                {comment.author.firstName} {comment.author.lastName}
                            </span>
                            <span className="text-xs font-semibold text-[#1d4a2e]/65">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        {!isOwner && (
                            <button onClick={() => handleReport(comment)} className="text-xs font-semibold text-[#1d4a2e]/55 hover:text-red-700 transition-colors">
                                Report
                            </button>
                        )}
                    </div>

                    {editingId === comment.id ? (
                        <div className="mt-2 flex flex-col gap-3">
                            <textarea
                                value={editingText}
                                onChange={(event) => setEditingText(event.target.value)}
                                className="w-full rounded-xl bg-transparent border border-[#1d4a2e]/25 p-3 text-sm font-medium text-[#1d4a2e] outline-none focus:border-[#1d4a2e]"
                                rows={3}
                                maxLength={1200}
                            />
                            <div className="flex gap-3">
                                <button onClick={saveEdit} className="px-5 py-2 border border-[#1d4a2e] bg-[#1d4a2e] text-white text-xs font-semibold hover:bg-transparent hover:text-[#1d4a2e] transition-colors">Save</button>
                                <button onClick={() => setEditingId(null)} className="px-5 py-2 border border-[#1d4a2e]/25 text-[#1d4a2e] text-xs font-semibold hover:bg-[#1d4a2e]/10 transition-colors">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm md:text-base text-[#1d4a2e] font-medium whitespace-pre-wrap leading-relaxed">
                            {comment.commentText}
                        </p>
                    )}

                    <div className="flex items-center gap-6 mt-4 flex-wrap">
                        <button
                            onClick={() => toggleHeart(comment.id)}
                            className={`text-xs font-semibold transition-colors flex items-center gap-1.5 ${comment.heartedByViewer || comment.isHearted ? 'text-red-600' : 'text-[#1d4a2e]/60 hover:text-[#1d4a2e]'}`}
                        >
                            <svg className={`w-4 h-4 ${comment.heartedByViewer || comment.isHearted ? 'fill-red-600' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            {comment.heartCount || 0}
                        </button>

                        {clampedDepth < maxIndentLevel && (
                            <button
                                onClick={() => {
                                    setReplyingToId(comment.id);
                                    setReplyText('');
                                }}
                                className="text-xs font-semibold text-[#1d4a2e]/65 hover:text-[#1d4a2e] transition-colors"
                            >
                                Reply
                            </button>
                        )}

                        {isOwner && editingId !== comment.id && (
                            <>
                                <button
                                    onClick={() => {
                                        setEditingId(comment.id);
                                        setEditingText(comment.commentText || '');
                                    }}
                                    className="text-xs font-semibold text-[#1d4a2e]/60 hover:text-[#1d4a2e] transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => removeComment(comment.id)}
                                    className="text-xs font-semibold text-[#1d4a2e]/60 hover:text-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>

                    {replyingToId === comment.id && (
                        <div className="mt-4 rounded-2xl border border-[#1d4a2e]/15 p-4 bg-[#1d4a2e]/5">
                            <textarea
                                value={replyText}
                                onChange={(event) => setReplyText(event.target.value)}
                                className="w-full rounded-xl bg-transparent border border-[#1d4a2e]/25 p-3 text-sm font-medium text-[#1d4a2e] outline-none focus:border-[#1d4a2e]"
                                placeholder="Write your reply..."
                                rows={3}
                                maxLength={1200}
                            />
                            <div className="mt-3 flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setReplyingToId(null);
                                        setReplyText('');
                                    }}
                                    className="px-4 py-2 border border-[#1d4a2e]/25 text-[#1d4a2e] text-xs font-semibold hover:bg-[#1d4a2e]/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => submitReply(comment.id)}
                                    disabled={!replyText.trim()}
                                    className="px-4 py-2 border border-[#1d4a2e] bg-[#1d4a2e] text-white text-xs font-semibold hover:bg-transparent hover:text-[#1d4a2e] disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    )}

                    {comment.replies?.length > 0 && (
                        <div className="mt-2">
                            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-4 h-4 rounded-full border-[1.5px] border-[#1d4a2e]/30 border-t-[#1d4a2e] animate-spin" />
            </div>
        );
    }

    return (
            <div className="flex flex-col gap-8">
            {isGuest ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#1d4a2e]/20 p-6 text-center">
                    <p className="text-sm font-medium text-[#1d4a2e]/70">Sign in to join the discussion.</p>
                    <button
                        type="button"
                        onClick={() => onRequireAuth?.()}
                        className="min-h-11 px-6 py-3 bg-[#1d4a2e] text-white text-xs font-semibold hover:bg-[#1f7a3e] transition-colors"
                    >
                        Sign in to comment
                    </button>
                </div>
            ) : (
            <div className="flex flex-col md:flex-row gap-4 items-start rounded-2xl border border-[#1d4a2e]/20 p-5 bg-white">
                <img loading="lazy" decoding="async"
                    src={getProfileImageUrl(currentUser?.profileImage || currentUser?.profile_image) || '/profile-img/default-avatar.svg'}
                    alt="You"
                    className="w-10 h-10 rounded-full object-cover border border-[#1d4a2e]/20 shrink-0 hidden md:block"
                />
                <div className="flex-1 flex flex-col gap-4 w-full">
                    <textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        className="w-full bg-transparent border-b border-[#1d4a2e]/25 p-2 text-sm md:text-base font-medium text-[#1d4a2e] focus:border-[#1d4a2e] transition-all resize-none h-20 outline-none placeholder:font-medium placeholder:text-[#1d4a2e]/50"
                        placeholder="Write a reply..."
                        maxLength={1200}
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={submitComment}
                            disabled={!commentText.trim()}
                            className="px-6 py-2 border border-[#1d4a2e] bg-[#1d4a2e] text-white text-xs font-semibold hover:bg-transparent hover:text-[#1d4a2e] disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                            Reply
                        </button>
                    </div>
                </div>
            </div>
            )}

            <div className="flex flex-col">
                {commentTree.map((comment) => renderComment(comment))}

                {comments.length === 0 && (
                    <div className="text-xs font-semibold text-[#1d4a2e]/60 text-center py-8">
                        No comments yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
