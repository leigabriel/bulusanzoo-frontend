import { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { Calendar, Grid, List } from 'reicon-react';

// The three ways the visitor can read the same filtered set of events. Kept out of Events.jsx
// so the page stays about data, submission and modals while this file owns presentation.

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Icons are stored as elements rather than component references: rendering a component held in
// a variable trips no-unused-vars under this project's ESLint config, and the elements are
// identical either way since these three icons take no props.
const ICON_CLASS = 'h-4 w-4';

const VIEWS = [
    { id: 'calendar', label: 'Calendar', icon: <Calendar className={ICON_CLASS} aria-hidden="true" /> },
    { id: 'list', label: 'List', icon: <List className={ICON_CLASS} aria-hidden="true" /> },
    { id: 'grid', label: 'Grid', icon: <Grid className={ICON_CLASS} aria-hidden="true" /> }
];

// Events are grouped by date in list view, so grouping needs a stable, sortable key.
const dateKey = (event) => event.eventDate || '';

const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = String(time).split(':');
    const h = parseInt(hours, 10);
    if (Number.isNaN(h)) return '';
    return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
};

const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
};

const StatusBadge = ({ status }) => (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${status === 'past' ? 'bg-[#e6f1df] text-[#1d4a2e]/70' : 'bg-[#1d4a2e] text-white'}`}>
        {status}
    </span>
);

const EmptyState = ({ view }) => (
    <div className="px-6 py-20 text-center text-base font-semibold text-[#1d4a2e]/60">
        No events to show{view === 'calendar' ? ' for this month' : ''}.
    </div>
);

/* ---------------------------------------------------------------- view toggle */

export const ViewToggle = ({ view, onViewChange, count }) => (
    <div
        role="group"
        aria-label="Choose how events are displayed"
        className="inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-[0_8px_20px_-14px_rgba(29,74,46,0.6)]"
    >
        {VIEWS.map(({ id, label, icon }) => {
            const active = view === id;
            return (
                <button
                    key={id}
                    type="button"
                    onClick={() => onViewChange(id)}
                    aria-pressed={active}
                    className={`flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f7a3e] ${active ? 'bg-[#1d4a2e] text-white' : 'text-[#1d4a2e]/75 hover:bg-[#e6f1df]'}`}
                >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                </button>
            );
        })}
        <span className="ml-1 hidden pr-3 text-sm font-semibold text-[#1d4a2e]/65 md:inline">
            {count} {count === 1 ? 'event' : 'events'}
        </span>
    </div>
);

/* --------------------------------------------------------------- calendar view */

const CalendarView = ({ events, calendarDate, onCalendarDateChange, onSelect }) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const cells = useMemo(() => {
        const list = [];
        for (let i = 0; i < firstDayOfWeek; i += 1) list.push(null);
        for (let d = 1; d <= daysInMonth; d += 1) list.push(d);
        return list;
    }, [firstDayOfWeek, daysInMonth]);

    const byDate = useMemo(() => {
        const map = new Map();
        events.forEach((event) => {
            const key = dateKey(event);
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(event);
        });
        return map;
    }, [events]);

    const today = new Date();
    const isToday = (day) => day === today.getDate()
        && month === today.getMonth()
        && year === today.getFullYear();

    const shiftMonth = (delta) => onCalendarDateChange(new Date(year, month + delta, 1));
    const monthHasEvents = cells.some((day) => day && (byDate.get(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)?.length));

    return (
        <div className="bg-white rounded-3xl shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)] overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-8 border-b border-[#1d4a2e]/10 gap-4">
                <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[#1d4a2e]">
                    {MONTHS[month]} {year}
                </h2>
                <div className="flex items-center gap-2 md:gap-4">
                    <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-[#1d4a2e]/20 text-[#1d4a2e] hover:bg-[#e6f1df] transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button type="button" onClick={() => onCalendarDateChange(new Date())} className="px-4 md:px-6 h-10 md:h-12 rounded-full border border-[#1d4a2e]/20 text-[#1d4a2e] hover:bg-[#e6f1df] text-sm font-semibold transition-colors">
                        Today
                    </button>
                    <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-[#1d4a2e]/20 text-[#1d4a2e] hover:bg-[#e6f1df] transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-[#1d4a2e]/10 bg-[#e6f1df]">
                {DAYS_SHORT.map((day) => (
                    <div key={day} className="py-2 md:py-4 text-center border-r border-[#1d4a2e]/10 last:border-r-0">
                        <span className="text-xs font-semibold text-[#1d4a2e]/75">{day}</span>
                    </div>
                ))}
            </div>

            {monthHasEvents ? (
                <div className="grid grid-cols-7 bg-[#fbf6e9]">
                    <Motion.div
                        key={`${year}-${month}`}
                        className="contents"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                    >
                        {cells.map((day, index) => {
                            const key = day
                                ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                : null;
                            const dayEvents = key ? (byDate.get(key) || []) : [];
                            const todayCell = day && isToday(day);

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[92px] sm:min-h-[130px] md:min-h-[190px] border-r border-b border-[#1d4a2e]/10 p-1.5 md:p-3 ${day ? 'hover:bg-[#e6f1df]/60 transition-colors' : 'bg-transparent'}`}
                                >
                                    {day && (
                                        <>
                                            <span className={`inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full text-xs sm:text-xs font-bold ${todayCell ? 'bg-[#1d4a2e] text-white' : 'text-[#1d4a2e]'}`}>
                                                {day}
                                            </span>

                                            {/* Every event on the day is listed. The previous build
                                                painted the first event's photo over the whole cell,
                                                which silently hid any others sharing the date. */}
                                            <ul className="mt-1.5 md:mt-2 flex flex-col gap-1">
                                                {dayEvents.slice(0, 3).map((event) => (
                                                    <li key={event.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => onSelect(event)}
                                                            className="w-full text-left px-1.5 md:px-2 py-1 rounded-lg bg-[#c6fe69] hover:bg-[#b4ee50] transition-colors focus-visible:outline-2 focus-visible:outline-[#1f7a3e]"
                                                        >
                                                            <span className="block text-xs md:text-xs font-semibold text-[#1d4a2e] leading-tight truncate">
                                                                {event.title}
                                                            </span>
                                                            <span className="block hidden sm:block text-xs text-[#1d4a2e]/75 truncate">
                                                                {formatTime(event.startTime) || '—'}
                                                            </span>
                                                        </button>
                                                    </li>
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <li className="px-1.5 md:px-2 text-xs md:text-xs font-semibold text-[#1d4a2e]/75">
                                                        +{dayEvents.length - 3} more
                                                    </li>
                                                )}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </Motion.div>
                </div>
            ) : (
                <EmptyState view="calendar" />
            )}
        </div>
    );
};

/* ------------------------------------------------------------------ list view */

const ListView = ({ events, onSelect }) => {
    const grouped = useMemo(() => {
        const map = new Map();
        events.forEach((event) => {
            const key = dateKey(event);
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(event);
        });
        return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    }, [events]);

    if (!events.length) return <div className="bg-white rounded-3xl shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)]"><EmptyState view="list" /></div>;

    return (
        <div className="flex flex-col gap-6 md:gap-10">
            {grouped.map(([day, dayEvents]) => (
                <section key={day} className="bg-white rounded-3xl shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)] overflow-hidden">
                    <h2 className="px-4 md:px-8 py-3 md:py-4 border-b border-[#1d4a2e]/10 bg-[#e6f1df] text-sm font-semibold text-[#1d4a2e]">
                        {formatDisplayDate(day)}
                    </h2>
                    <ul>
                        {dayEvents.map((event) => (
                            <li key={event.id} className="border-b border-[#1d4a2e]/10 last:border-b-0">
                                <button
                                    type="button"
                                    onClick={() => onSelect(event)}
                                    className="flex w-full items-center gap-4 md:gap-6 px-4 md:px-8 py-4 md:py-5 text-left hover:bg-[#e6f1df]/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1f7a3e] transition-colors"
                                >
                                    <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-2xl bg-[#e6f1df]">
                                        {event.imageUrl && (
                                            <img loading="lazy" decoding="async" src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-[#1d4a2e]/70">
                                                {formatTime(event.startTime) || 'Time TBC'}
                                                {event.endTime ? ` – ${formatTime(event.endTime)}` : ''}
                                            </span>
                                            <StatusBadge status={event.status} />
                                        </div>
                                        <h3 className="font-display text-base md:text-xl font-semibold text-[#1d4a2e] leading-tight break-words">{event.title}</h3>
                                        <p className="text-xs md:text-sm text-[#1d4a2e]/70 mt-1 truncate">
                                            {event.location}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
};

/* ------------------------------------------------------------------ grid view */

const GridView = ({ events, onSelect }) => {
    if (!events.length) return <div className="bg-white rounded-3xl shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)]"><EmptyState view="grid" /></div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
                <article key={event.id} className="group bg-white rounded-3xl p-2.5 shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)] flex flex-col">
                    <button type="button" onClick={() => onSelect(event)} className="flex flex-col h-full text-left rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f7a3e]">
                        <div className="relative h-44 md:h-52 overflow-hidden rounded-[1.25rem] bg-[#e6f1df]">
                            {event.imageUrl && (
                                <img loading="lazy" decoding="async" src={event.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            )}
                            <div className="absolute top-3 left-3">
                                <StatusBadge status={event.status} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 px-3 pb-3 pt-4 md:px-4 flex-1">
                            <span className="text-xs font-semibold text-[#1d4a2e]/70">
                                {formatDisplayDate(event.eventDate)}
                            </span>
                            <h3 className="font-display text-lg md:text-xl font-semibold text-[#1d4a2e] leading-tight break-words">
                                {event.title}
                            </h3>
                            <p className="text-xs md:text-sm text-[#1d4a2e]/70 mt-auto pt-2">
                                {formatTime(event.startTime) || 'Time TBC'} · {event.location}
                            </p>
                        </div>
                    </button>
                </article>
            ))}
        </div>
    );
};

/* ------------------------------------------------------------------ dispatcher */

export default function EventViews({
    view, events, calendarDate, onCalendarDateChange, onSelect
}) {
    if (view === 'list') return <ListView events={events} onSelect={onSelect} />;
    if (view === 'grid') return <GridView events={events} onSelect={onSelect} />;
    return (
        <CalendarView
            events={events}
            calendarDate={calendarDate}
            onCalendarDateChange={onCalendarDateChange}
            onSelect={onSelect}
        />
    );
}