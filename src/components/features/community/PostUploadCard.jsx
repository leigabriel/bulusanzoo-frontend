import { getProfileImageUrl } from '../../../services/api-client';

// The Facebook/Instagram pattern: a post becomes visible in the feed the instant it is
// published, carrying a progress bar and a clear "not posted yet" label, and is replaced by
// the real post once the server has it. The card is deliberately inert — none of the normal
// like/comment/report affordances are rendered, because there is nothing on the server to act
// on yet.
const PostUploadCard = ({ item, currentUser, onRetry, onDiscard }) => {
    const percent = Math.round((item.progress || 0) * 100);
    const failed = item.status === 'failed';
    const done = item.status === 'done';

    const statusLabel = failed
        ? 'Not posted'
        : done
            ? 'Posted'
            : `Uploading ${percent}%`;

    // Prefer a message that names the cause. friendlyMessage already rewrites "network error"
    // and "offline" server-side of the toast, but this card shows the raw error, so the common
    // connectivity case is translated here where the reader is actually looking.
    const errorDetail = failed
        ? (/network|offline|failed to fetch|load failed/i.test(item.error || '')
            ? "You're offline. Check your connection, then try again."
            : (item.error || "Couldn't upload your post."))
        : null;

    return (
        <article
            className="min-w-0 overflow-hidden rounded-full border border-[#1d4a2e]/20 bg-white"
            aria-busy={!done && !failed}
        >
            <div className="flex items-start gap-4 px-4 py-4 sm:px-5 sm:py-5">
                <img loading="lazy" decoding="async"
                    src={getProfileImageUrl(currentUser?.profileImage) || '/profile-img/default-avatar.svg'}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-[#1d4a2e]">
                        {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs font-semibold text-[#1d4a2e]/50">
                        {failed ? 'Upload failed' : done ? 'Just now' : 'Uploading now'}
                    </p>
                </div>
            </div>

            <div className="px-4 py-2 sm:px-5 sm:py-3">
                <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-[#1d4a2e] md:text-xl">
                    {item.content}
                </p>
            </div>

            {item.previewUrls?.length > 0 && (
                <div className="grid grid-cols-2 gap-1 px-4 pb-1 sm:px-5 sm:grid-cols-3">
                    {item.previewUrls.map((url, index) => (
                        <img loading="lazy" decoding="async"
                            key={`${url}-${index}`}
                            src={url}
                            alt=""
                            aria-hidden="true"
                            className="h-32 w-full object-cover"
                        />
                    ))}
                </div>
            )}

            <div className="px-4 py-4 sm:px-5" role="status" aria-live="polite">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                    <div
                        className={`h-full rounded-full transition-[width] duration-300 ease-out ${failed ? 'bg-red-600' : 'bg-black'}`}
                        // Hold a sliver at the very start so the bar reads as "present but
                        // empty" rather than as a rendering glitch before the first progress event.
                        style={{ width: `${failed ? 100 : Math.max(2, percent)}%` }}
                    />
                </div>

                {failed ? (
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-relaxed text-red-600 sm:shrink-0">
                            <span className="font-semibold">{statusLabel}.</span>{' '}
                            {errorDetail}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onRetry?.(item.id)}
                                className="min-h-9 rounded-full bg-[#1d4a2e] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1f7a3e]"
                            >
                                Retry
                            </button>
                            <button
                                type="button"
                                onClick={() => onDiscard?.(item.id)}
                                className="min-h-9 rounded-full border border-[#1d4a2e]/20 px-4 text-xs font-semibold text-[#1d4a2e]/60 transition-colors hover:bg-[#e6f1df] hover:text-[#1d4a2e]"
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-2 text-xs font-semibold text-[#1d4a2e]/50">
                        {statusLabel}
                    </p>
                )}
            </div>
        </article>
    );
};

export default PostUploadCard;