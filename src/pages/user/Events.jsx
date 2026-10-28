import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PARK, PHOTOS } from '../../config/park-theme';
import { Band, PageHero } from '../../components/common/ParkDecor';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ReactLenis } from 'lenis/react';
import AIFloatingButton from '../../components/common/AIFloatingButton';
import { userAPI, reservationAPI } from '../../services/api-client';
import { useAuth } from '../../hooks/use-auth';
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '../../utils/sanitize';
import { notify } from '../../utils/toast';
import useScrollLock from '../../hooks/use-scroll-lock';
import EventViews, { ViewToggle } from '../../components/features/events/EventViews';
import { X, Location, Clock, CheckCircle } from 'reicon-react';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_EVENT_IMAGES = [
    'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800',
    'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800',
    'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=800',
    'https://images.unsplash.com/photo-1497752531616-c3afd9760a11?w=800',
    'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800',
];

const FILTERS = ['all', 'upcoming', 'ongoing', 'past'];

// Remembers whether the visitor last read events as a calendar, a list or a grid.
const VIEW_STORAGE_KEY = 'bulusan_zoo_events_view';

const Icons = {
    Close: () => <X className="w-5 h-5" />,
    Location: () => <Location className="w-4 h-4 flex-shrink-0" />,
    Clock: () => <Clock className="w-4 h-4 flex-shrink-0" />,
    Check: () => <CheckCircle className="w-8 h-8" />
};

const StatusBadge = ({ status }) => {
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${status === 'past' ? 'bg-white text-[#1d4a2e]/70' : 'bg-[#1d4a2e] text-white'}`}>
            {status}
        </span>
    );
};

const Events = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const containerRef = useRef(null);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filter, setFilter] = useState('all');
    const [view, setView] = useState(() => {
        try {
            const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
            // Mirrors the ids in EventViews' VIEWS; kept as literals so this file stays a plain
            // consumer and the view module exports components only.
            return ['calendar', 'list', 'grid'].includes(stored) ? stored : 'calendar';
        } catch {
            // Private browsing or a blocked storage partition: the default view is fine.
            return 'calendar';
        }
    });
    const [calendarDate, setCalendarDate] = useState(new Date());

    const [eventForm, setEventForm] = useState({
        venueEventName: '', venueEventDate: '', venueEventStartTime: '', venueEventEndTime: '',
        venueEventDescription: '', numberOfParticipants: 1,
        participantName: '', participantEmail: '', participantPhone: '', notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);

    useEffect(() => {
        if (user) {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            setEventForm(prev => ({ ...prev, participantName: fullName, participantEmail: user.email || '' }));
        }
    }, [user]);

    useScrollLock(Boolean(selectedEvent || showSubmitConfirm || showConfirmation));

    const formatDateFromDB = (dateValue) => {
        if (!dateValue) return '';
        if (typeof dateValue === 'string' && dateValue.includes('T')) return dateValue.split('T')[0];
        const d = new Date(dateValue);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const fetchEvents = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const response = await userAPI.getEvents(true);
            if (response.success && response.events) {
                const todayMidnight = new Date();
                todayMidnight.setHours(0, 0, 0, 0);

                const transformed = response.events.map((event, index) => {
                    const eventDate = formatDateFromDB(event.event_date || event.date);
                    const eventDateObj = new Date(eventDate + 'T00:00:00');

                    let computedStatus = event.status || 'upcoming';
                    if (eventDateObj < todayMidnight) computedStatus = 'past';
                    else if (eventDateObj.getTime() === todayMidnight.getTime()) computedStatus = 'ongoing';
                    else computedStatus = 'upcoming';

                    return {
                        id: event.id,
                        title: event.title || event.name,
                        description: event.description || '',
                        eventDate,
                        startTime: event.start_time || event.time,
                        endTime: event.end_time,
                        location: event.location || 'Bulusan Zoo',
                        status: computedStatus,
                        imageUrl: event.image_url || DEFAULT_EVENT_IMAGES[index % DEFAULT_EVENT_IMAGES.length],
                        tags: event.tags || ['Wildlife', 'Education'],
                    };
                });

                transformed.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                setEvents(transformed);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error(err);
            if (showLoading) setError('Failed to load events.');
            setEvents([]);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
        const pollInterval = setInterval(() => fetchEvents(false), 60000);
        return () => clearInterval(pollInterval);
    }, [fetchEvents]);

    useEffect(() => {
        if (!loading) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.section-anim',
                    { y: 40, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: '.section-anim',
                            start: 'top 85%',
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out'
                    }
                );
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, events, filter, calendarDate]);

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours, 10);
        return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
    };

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    const getMinDate = () => new Date().toISOString().split('T')[0];

    const changeView = (next) => {
        setView(next);
        // Remembering the choice is a nicety, never a reason to fail the interaction.
        try {
            window.localStorage.setItem(VIEW_STORAGE_KEY, next);
        } catch {
            // Storage unavailable; the view still changes for this session.
        }
    };

    const filteredEvents = useMemo(
        () => (filter === 'all' ? events : events.filter((e) => e.status === filter)),
        [events, filter]
    );

    const handleSubmitAttempt = (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            notify.warning('Log in to reserve this event.', {
                action: {
                    label: 'Log in',
                    onClick: () => navigate('/login')
                }
            });
            return;
        }
        if (!eventForm.venueEventName || !eventForm.venueEventDate) {
            notify.warning('Provide name and date.');
            return;
        }
        if (!eventForm.venueEventStartTime || !eventForm.venueEventEndTime) {
            notify.warning('Provide start and end time.');
            return;
        }
        setShowSubmitConfirm(true);
    };

    const confirmSubmit = async () => {
        setShowSubmitConfirm(false);
        setIsSubmitting(true);
        try {
            const res = await reservationAPI.createEventReservation({
                venueEventName: eventForm.venueEventName,
                venueEventDate: eventForm.venueEventDate,
                venueEventStartTime: eventForm.venueEventStartTime,
                venueEventEndTime: eventForm.venueEventEndTime,
                venueEventDescription: eventForm.venueEventDescription,
                participantName: eventForm.participantName,
                participantEmail: eventForm.participantEmail,
                participantPhone: eventForm.participantPhone,
                numberOfParticipants: parseInt(eventForm.numberOfParticipants) || 1,
                notes: eventForm.notes
            });
            if (res.success) {
                setConfirmationData({
                    type: 'event',
                    reference: res.reservationReference,
                    eventName: eventForm.venueEventName,
                    eventDate: eventForm.venueEventDate,
                    participants: eventForm.numberOfParticipants
                });
                setShowConfirmation(true);
                const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
                setEventForm({
                    venueEventName: '', venueEventDate: '', venueEventStartTime: '', venueEventEndTime: '',
                    venueEventDescription: '', numberOfParticipants: 1,
                    participantName: fullName, participantEmail: user?.email || '',
                    participantPhone: '', notes: ''
                });
            } else {
                throw new Error(res.message || 'Failed to create reservation');
            }
        } catch (err) {
            notify.error(err.message || "Couldn't complete reservation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ReactLenis root>
            <div ref={containerRef} className="min-h-screen text-[#1d4a2e]" style={{ backgroundColor: PARK.deep }}>
                <Header />

                <PageHero id="events-title" photo={PHOTOS.pavilion}>Events</PageHero>

                <Band bg={PARK.cream} className="z-10" innerClassName="min-h-[40svh]">
                    <div className="mb-8 flex flex-wrap justify-center gap-2 md:mb-12 md:gap-3">
                        {FILTERS.map(f => {
                            const active = filter === f;
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    aria-pressed={active}
                                    className={`min-h-11 rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f7a3e] ${active ? 'bg-[#1d4a2e] text-white' : 'bg-white text-[#1d4a2e] shadow-[0_8px_20px_-14px_rgba(29,74,46,0.6)] hover:bg-[#e6f1df]'}`}
                                >
                                    {f === 'all' ? 'All Events' : f}
                                </button>
                            );
                        })}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-24" role="status" aria-label="Loading">
                            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#1f7a3e]/20 border-t-[#1f7a3e]" />
                        </div>
                    ) : (
                        <>
                            <div className="section-anim mb-8 flex justify-center md:mb-10">
                                <ViewToggle view={view} onViewChange={changeView} count={filteredEvents.length} />
                            </div>
                            <div className="section-anim">
                                <EventViews
                                    view={view}
                                    events={filteredEvents}
                                    calendarDate={calendarDate}
                                    onCalendarDateChange={setCalendarDate}
                                    onSelect={setSelectedEvent}
                                />
                            </div>
                        </>
                    )}
                </Band>

                <Band bg={PARK.peach} dropWave className="z-20" innerClassName="!px-4 sm:!px-6">
                    <div className="section-anim mx-auto max-w-4xl">
                        <div className="text-center mb-10 md:mb-16">
                            <h2 className="mb-4 font-display text-3xl font-bold text-[#1d4a2e] md:text-5xl">Plan Your Own Event</h2>
                            <p className="px-4 text-sm text-[#1d4a2e]/75 md:text-lg">Book our venue for your private gatherings and educational tours.</p>
                        </div>

                        <form onSubmit={handleSubmitAttempt} className="rounded-3xl bg-white p-5 shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)] sm:p-8 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[#1d4a2e]/80">Event Name *</label>
                                    <input
                                        type="text"
                                        value={eventForm.venueEventName}
                                        onChange={e => setEventForm({ ...eventForm, venueEventName: sanitizeInput(e.target.value) })}
                                        className="min-h-12 rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-2.5 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                        placeholder="E.g., Corporate Retreat"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[#1d4a2e]/80">Estimated Attendees *</label>
                                    <input
                                        type="number"
                                        value={eventForm.numberOfParticipants}
                                        onChange={e => setEventForm({ ...eventForm, numberOfParticipants: e.target.value })}
                                        min="1" max="500"
                                        className="min-h-12 rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-2.5 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[#1d4a2e]/80">Event Date *</label>
                                    <input
                                        type="date"
                                        value={eventForm.venueEventDate}
                                        onChange={e => setEventForm({ ...eventForm, venueEventDate: e.target.value })}
                                        min={getMinDate()}
                                        className="min-h-12 rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-2.5 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[#1d4a2e]/80">Event Start Time *</label>
                                    <input
                                        type="time"
                                        value={eventForm.venueEventStartTime}
                                        onChange={e => setEventForm({ ...eventForm, venueEventStartTime: e.target.value })}
                                        className="min-h-12 rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-2.5 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[#1d4a2e]/80">Event End Time *</label>
                                    <input
                                        type="time"
                                        value={eventForm.venueEventEndTime}
                                        onChange={e => setEventForm({ ...eventForm, venueEventEndTime: e.target.value })}
                                        className="min-h-12 rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-2.5 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8 pt-6 md:pt-8 border-t border-[#1d4a2e]/10">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[#1d4a2e]/80">Full Name *</label>
                                    <input
                                        type="text"
                                        value={eventForm.participantName}
                                        onChange={e => setEventForm({ ...eventForm, participantName: sanitizeInput(e.target.value) })}
                                        className="min-h-12 rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-2.5 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[#1d4a2e]/80">Email Address *</label>
                                    <input
                                        type="email"
                                        value={eventForm.participantEmail}
                                        onChange={e => setEventForm({ ...eventForm, participantEmail: sanitizeEmail(e.target.value) })}
                                        className="min-h-12 rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-2.5 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-semibold text-[#1d4a2e]/80">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={eventForm.participantPhone}
                                        onChange={e => setEventForm({ ...eventForm, participantPhone: sanitizePhone(e.target.value) })}
                                        className="min-h-12 rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-2.5 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                        placeholder="+63 900 000 0000"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mb-10 md:mb-12">
                                <label className="text-xs font-semibold text-[#1d4a2e]/80">Additional Details & Requirements</label>
                                <textarea
                                    value={eventForm.venueEventDescription}
                                    onChange={e => setEventForm({ ...eventForm, venueEventDescription: sanitizeInput(e.target.value) })}
                                    className="min-h-28 resize-y rounded-xl border border-[#1d4a2e]/20 bg-[#fbf6e9]/60 px-4 py-3 text-base font-medium text-[#1d4a2e] outline-none transition-colors placeholder:text-[#1d4a2e]/45 focus:border-[#1f7a3e] focus:ring-2 focus:ring-[#1f7a3e]/25"
                                    placeholder="Please describe your event setup, specific requests, or questions..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="min-h-12 w-full rounded-full bg-[#1d4a2e] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f7a3e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f7a3e] disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </Band>

                <AnimatePresence>
                    {selectedEvent && (
                        <Motion.div
                            key="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0f2a1a]/70 backdrop-blur-sm p-4 md:p-8"
                            onClick={(e) => e.target === e.currentTarget && setSelectedEvent(null)}
                        >
                            <Motion.div
                                key="modal-panel"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                                className="w-full md:max-w-5xl bg-[#fbf6e9] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90dvh]"
                            >
                                <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-auto relative bg-[#e6f1df] flex-shrink-0">
                                    <img loading="lazy" decoding="async" src={selectedEvent.imageUrl} alt={selectedEvent.title} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto overscroll-contain" data-lenis-prevent>
                                    <div className="flex justify-between items-start mb-6 md:mb-8">
                                        <StatusBadge status={selectedEvent.status} />
                                        <button
                                            onClick={() => setSelectedEvent(null)}
                                            aria-label="Close"
                                            className="w-11 h-11 flex items-center justify-center rounded-full bg-white hover:bg-[#e6f1df] transition-colors focus-visible:outline-2 focus-visible:outline-[#1f7a3e]"
                                        >
                                            <Icons.Close />
                                        </button>
                                    </div>

                                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#1d4a2e] leading-tight mb-3 md:mb-4 break-words">
                                        {selectedEvent.title}
                                    </h2>
                                    <p className="text-[#1d4a2e]/70 text-sm font-semibold mb-6 md:mb-8">
                                        {formatDisplayDate(selectedEvent.eventDate)}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 md:mb-8 border-t border-[#1d4a2e]/10 pt-6 md:pt-8">
                                        <div>
                                            <h4 className="text-xs font-semibold text-[#1d4a2e]/65 mb-2">Time</h4>
                                            <p className="text-[#1d4a2e] font-semibold text-sm md:text-base flex items-center gap-2">
                                                <Icons.Clock />
                                                {formatTime(selectedEvent.startTime) || '—'}
                                                {selectedEvent.endTime && <span className="text-[#1d4a2e]/65">to {formatTime(selectedEvent.endTime)}</span>}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-[#1d4a2e]/65 mb-2">Location</h4>
                                            <p className="text-[#1d4a2e] font-semibold text-sm md:text-base flex items-center gap-2">
                                                <Icons.Location />
                                                {selectedEvent.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6 md:mb-8">
                                        <h4 className="text-xs font-semibold text-[#1d4a2e]/65 mb-3">About this Event</h4>
                                        <p className="text-[#1d4a2e]/85 text-sm md:text-base leading-relaxed">
                                            {selectedEvent.description || 'Join us for an immersive wildlife experience. Learn directly from our experts and connect with nature.'}
                                        </p>
                                    </div>

                                    {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {selectedEvent.tags.map((tag, i) => (
                                                <span key={i} className="px-3.5 py-1.5 bg-[#e6f1df] rounded-full text-xs font-semibold text-[#1d4a2e]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Motion.div>
                        </Motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showSubmitConfirm && (
                        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
                            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0f2a1a]/70 backdrop-blur-sm" />
                            <Motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#fbf6e9] rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl p-6 md:p-8 text-center max-h-[92dvh] overflow-y-auto"
                            >
                                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-[#1d4a2e] text-white rounded-full flex items-center justify-center mb-4 md:mb-6"><Icons.Check /></div>
                                <h3 className="font-display font-bold text-2xl md:text-3xl mb-2 text-[#1d4a2e]">Verify Details</h3>
                                <p className="text-[#1d4a2e]/75 text-sm mb-6 md:mb-8">Please ensure the information below is correct.</p>

                                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left bg-white p-4 md:p-6 rounded-2xl text-sm md:text-base">
                                    <div className="flex justify-between border-b border-[#1d4a2e]/10 pb-2">
                                        <span className="text-xs font-semibold text-[#1d4a2e]/65">Event</span>
                                        <span className="font-semibold text-[#1d4a2e] truncate max-w-[150px] sm:max-w-[200px]">{eventForm.venueEventName}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#1d4a2e]/10 pb-2">
                                        <span className="text-xs font-semibold text-[#1d4a2e]/65">Date</span>
                                        <span className="font-semibold text-[#1d4a2e]">{formatDateFromDB(eventForm.venueEventDate)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#1d4a2e]/10 pb-2">
                                        <span className="text-xs font-semibold text-[#1d4a2e]/65">Start Time</span>
                                        <span className="font-semibold text-[#1d4a2e]">{eventForm.venueEventStartTime || '—'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#1d4a2e]/10 pb-2">
                                        <span className="text-xs font-semibold text-[#1d4a2e]/65">End Time</span>
                                        <span className="font-semibold text-[#1d4a2e]">{eventForm.venueEventEndTime || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs font-semibold text-[#1d4a2e]/65">Attendees</span>
                                        <span className="font-semibold text-[#1d4a2e]">{eventForm.numberOfParticipants}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                    <button onClick={() => setShowSubmitConfirm(false)} className="min-h-12 flex-1 rounded-full border border-[#1d4a2e]/20 bg-white text-sm font-semibold text-[#1d4a2e] hover:bg-[#e6f1df]">Return</button>
                                    <button onClick={confirmSubmit} disabled={isSubmitting} className="min-h-12 flex-1 rounded-full bg-[#1d4a2e] text-white text-sm font-semibold hover:bg-[#1f7a3e] disabled:opacity-50">
                                        {isSubmitting ? 'Wait...' : 'Confirm'}
                                    </button>
                                </div>
                            </Motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showConfirmation && confirmationData && (
                        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0f2a1a]/70 backdrop-blur-sm" />
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                className="bg-[#fbf6e9] rounded-3xl w-full max-w-md p-8 md:p-10 relative z-10 text-center shadow-2xl max-h-[92dvh] overflow-y-auto"
                            >
                                <div className="mb-4 md:mb-6 text-[#1f7a3e] flex justify-center"><Icons.Check /></div>
                                <h3 className="font-display font-bold text-3xl md:text-4xl mb-2 text-[#1d4a2e]">Confirmed</h3>
                                <p className="text-[#1d4a2e]/75 text-sm mb-6 md:mb-8">Your reservation request has been received.</p>

                                <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                                    <span className="text-xs font-semibold text-[#1d4a2e]/65 block mb-2">Reference ID</span>
                                    <span className="text-xl md:text-2xl font-display font-bold text-[#1d4a2e]">{confirmationData.reference}</span>
                                </div>

                                <div className="space-y-3">
                                    <button onClick={() => { setShowConfirmation(false); navigate('/reservations'); }} className="min-h-12 w-full bg-[#1d4a2e] text-white rounded-full text-sm font-semibold hover:bg-[#1f7a3e]">
                                        Manage Bookings
                                    </button>
                                    <button onClick={() => setShowConfirmation(false)} className="min-h-12 w-full border border-[#1d4a2e]/20 bg-white rounded-full text-sm font-semibold text-[#1d4a2e] hover:bg-[#e6f1df]">
                                        Dismiss
                                    </button>
                                </div>
                            </Motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="relative z-30"><Footer /></div>
                <AIFloatingButton />
            </div>
        </ReactLenis>
    );
};

export default Events;
