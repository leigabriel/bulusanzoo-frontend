import React, { useLayoutEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AIFloatingButton from '../../components/common/AIFloatingButton';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { ArrowUpRight, Band, Chevron, Leaf, Marquee, PlayIcon, SectionTitle } from '../../components/common/ParkDecor';
import { PARK, PHOTOS } from '../../config/park-theme';
import usePageMetadata from '../../hooks/use-page-metadata';
import '../../App.css';

const CITY_SOURCE = 'https://cityofcalapan.gov.ph/the-city-economic-enterprise-department-ceed/';
const CITY_VISITORS_SOURCE = 'https://cityofcalapan.gov.ph/visitors/';
const TOURISM_SOURCE = 'https://www.travelorientalmindoro.ph/place/calapan-nature-park';
const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=13.40496178,121.1991656';
const ZOOTOPIA_GAME_URL = 'https://adventuregame.bulusanzoo.com/';

const PAGE_DESCRIPTION = 'Discover Bulusan Park, formally the Calapan City Recreational and Zoological Park in Barangay Bulusan, with its mini-zoo, open spaces, pavilion, and eco-trail access.';

const cardShadow = 'shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)]';
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f7a3e]';

/* ───────────────────────────── Hero ───────────────────────────── */

const heroCards = [
    { to: '/animals', label: 'Animals', src: PHOTOS.lawn, alt: 'Open lawn with an animal grazing beneath tall trees at Bulusan Park' },
    { to: '/plants', label: 'Plants', src: PHOTOS.garden, alt: 'Brick garden path lined with red and green foliage at Bulusan Park' },
    { to: '/events', label: 'Events', src: PHOTOS.pavilion, alt: 'Multi-purpose pavilion among the trees at Bulusan Park' },
];

const HeroSection = () => {
    const navigate = useNavigate();

    useLayoutEffect(() => {
        // Page transitions can leave the scroll lock or a faded header behind; always start clean.
        document.body.style.overflow = 'auto';
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.style.opacity = '1';
            headerElement.style.pointerEvents = 'auto';
        }
    }, []);

    return (
        <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#2f7d3a]">
            {/* Park footage, softened and tinted green so it reads like the painted backdrop of the reference. */}
            <div aria-hidden="true" className="absolute inset-0 -z-30 scale-110 bg-[url('/video/hero-poster.webp')] bg-cover bg-center blur-[3px]" />
            <video
                className="pointer-events-none absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-[3px] motion-reduce:hidden"
                src="/video/hero.mp4"
                poster="/video/hero-poster.webp"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(196,236,124,0.94)_0%,rgba(110,196,80,0.86)_9%,rgba(40,134,56,0.88)_30%,rgba(24,104,50,0.92)_100%)]"
            />

            <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-4 pb-8 pt-28 text-center sm:px-6">
                <p className="hero-rise font-display text-lg font-semibold uppercase tracking-[0.24em] text-white [text-shadow:0_2px_0_rgba(16,70,34,0.35)] sm:text-2xl">
                    Welcome to
                </p>
                <h1
                    id="hero-title"
                    className="hero-rise mt-1 font-display text-[clamp(4.25rem,16vw,9.5rem)] font-bold uppercase leading-[0.86] tracking-tight text-white [text-shadow:0_6px_0_rgba(16,70,34,0.38)]"
                    style={{ animationDelay: '0.08s' }}
                >
                    Bulusan<br />Zoo
                </h1>
                <div className="hero-rise mt-5 max-w-xl sm:mt-6" style={{ animationDelay: '0.2s' }}>
                    <p className="font-display text-xl font-semibold text-white [text-shadow:0_2px_10px_rgba(10,60,25,0.55)] sm:text-2xl">Explore Nature, Learn, and Connect</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-white [text-shadow:0_1px_8px_rgba(10,60,25,0.6)] sm:text-base">{PAGE_DESCRIPTION}</p>
                </div>
                <div className="hero-rise mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center" style={{ animationDelay: '0.32s' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/reservations')}
                        className="min-h-12 rounded-full bg-white px-9 py-3 text-sm font-semibold text-[#14301f] shadow-lg transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        Plan a Visit
                    </button>
                    <button
                        type="button"
                        onClick={() => window.open(ZOOTOPIA_GAME_URL, '_blank', 'noopener,noreferrer')}
                        aria-label="Play our game, opens adventuregame.bulusanzoo.com in a new tab"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/20 px-8 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        <PlayIcon className="h-3.5 w-3.5" />
                        Play our game
                    </button>
                </div>
            </div>

            <div className="hero-rise relative mx-auto w-full max-w-[1280px] px-4 pb-24 sm:px-6 sm:pb-28 lg:px-10" style={{ animationDelay: '0.45s' }}>
                <div className="mb-3 flex items-end justify-between gap-4">
                    <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white [text-shadow:0_2px_0_rgba(16,70,34,0.35)] sm:text-2xl">Discover</h2>
                    <Link to="/animals" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        Browse animals <Chevron />
                    </Link>
                </div>
                <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
                    {heroCards.map((card) => (
                        <li key={card.to} className="w-[72%] shrink-0 snap-start sm:w-auto">
                            <Link to={card.to} className="group relative block aspect-[16/9] overflow-hidden rounded-2xl bg-[#1d4a2e] shadow-xl shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:aspect-[2/1] lg:aspect-[16/7]">
                                <img src={card.src} alt={card.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden="true" />
                                <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 text-sm font-semibold text-white">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#14301f] transition-transform group-hover:scale-110"><Chevron className="h-4 w-4" /></span>
                                    {card.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

/* ───────────────────────────── About ───────────────────────────── */

const aboutGallery = [
    { src: PHOTOS.pond, caption: 'Rock garden and pond', alt: 'Rock-lined waterfall spilling into a pond at Bulusan Park' },
    { src: PHOTOS.arch, caption: 'White arch gateway', alt: 'White arched gateway framing the walkway into Bulusan Park' },
    { src: PHOTOS.trees, caption: 'Century-old trees', alt: 'Century-old trees casting shade across the open lawn at Bulusan Park' },
];

const AboutGallery = () => (
    <div className="mt-12 sm:mt-16">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#1d4a2e]/60">Park in pictures · Three stops inside the park</p>
        <ul className="-mx-4 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-8 lg:gap-8 [&::-webkit-scrollbar]:hidden">
            {aboutGallery.map((photo, index) => (
                <li key={photo.src} className={`group w-[76%] shrink-0 snap-center sm:w-auto ${index === 1 ? 'lg:z-10 lg:scale-[1.1]' : ''}`}>
                    <figure className={`rounded-[1.75rem] bg-white p-2.5 ${cardShadow}`}>
                        <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[#dcebd0]">
                            <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                        </div>
                        <figcaption className="px-3 pb-2 pt-4 text-center font-display text-lg font-semibold text-[#1d4a2e]">{photo.caption}</figcaption>
                    </figure>
                </li>
            ))}
        </ul>
    </div>
);

const AboutSection = () => (
    <Band
        id="about-park"
        labelledBy="about-park-title"
        bg={PARK.cream}
        waveVariant="a"
        className="z-10"
        decor={(
            <>
                <Leaf className="-left-4 top-16 h-24 w-24 rotate-[-25deg] opacity-80 sm:left-6 sm:h-32 sm:w-32" />
                <Leaf className="-right-3 top-40 h-20 w-20 rotate-[35deg] opacity-70 sm:right-10 sm:h-28 sm:w-28" fill="#86d99a" />
            </>
        )}
    >
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <SectionTitle id="about-park-title" eyebrow="About Bulusan Park" size="md" center>
                The Calapan City Recreational and Zoological Park, commonly known as Bulusan Park, brings recreation, environmental education, and leisure together in Barangay Bulusan.
            </SectionTitle>
            <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-[#1d4a2e]/75 sm:text-lg">
                Managed by the City Economic Enterprise Department, the park includes a mini-zoo, landscaped open spaces, and a multi-purpose pavilion for events and community gatherings.
            </p>
        </div>
        <AboutGallery />
    </Band>
);

/* ───────────────────────────── Explore ───────────────────────────── */

const parkFeatures = [
    { number: '01', title: 'Mini-zoo', src: PHOTOS.lawn, alt: 'Animal grazing on the open lawn inside the park', text: 'The City describes a mini-zoo housing various animal species. A current species inventory is not published, so exhibits may vary.' },
    { number: '02', title: 'Open spaces', src: PHOTOS.plaza, alt: 'Landscaped brick plaza with garden beds and shaded pavilions', text: 'Landscaped areas provide room for family recreation and leisure within the park.' },
    { number: '03', title: 'Pavilion', src: PHOTOS.pavilion, alt: 'Multi-purpose pavilion beside a stone path', text: 'A multi-purpose pavilion supports events and community gatherings.' },
    { number: '04', title: 'Outdoor recreation', src: PHOTOS.climb, alt: 'Wall climbing tower rising among the trees', text: 'The provincial tourism portal documents picnic and camping areas, wall climbing, and routes used for walking and other outdoor activities.' },
];

const ExploreSection = () => (
    <Band
        id="explore-park"
        labelledBy="explore-park-title"
        bg={PARK.peach}
        waveVariant="b"
        className="z-20"
        decor={<Leaf className="-right-4 bottom-10 h-28 w-28 rotate-[20deg] opacity-60 sm:h-40 sm:w-40" fill="#f08c5a" />}
    >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle id="explore-park-title" eyebrow="Inside the park" size="lg">Explore<br />Bulusan</SectionTitle>
            <p className="max-w-xl text-base font-medium leading-7 text-[#4a2c1a]/80 lg:text-lg">
                Official City and provincial tourism information presents Bulusan Park as a place for wildlife viewing, recreation, learning, and time outdoors.
            </p>
        </div>
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {parkFeatures.map((feature) => (
                <li key={feature.number} className="w-[80%] shrink-0 snap-start sm:w-auto">
                    <article className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white p-2.5 ${cardShadow}`}>
                        <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#f3d3bd]">
                            <img src={feature.src} alt={feature.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                        </div>
                        <div className="flex flex-1 flex-col px-3 pb-4 pt-4">
                            <span className="inline-flex w-fit rounded-full bg-[#fde9d6] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#a24b1d]">{feature.number}</span>
                            <h3 className="mt-3 font-display text-2xl font-semibold text-[#1d4a2e]">{feature.title}</h3>
                            <p className="mt-2 text-sm font-medium leading-6 text-[#1d4a2e]/70">{feature.text}</p>
                        </div>
                    </article>
                </li>
            ))}
        </ul>
    </Band>
);

/* ───────────────────────────── Zootopia ───────────────────────────── */

const zootopiaFeatures = [
    { number: '01', title: 'Explore nature', text: 'Wander through lush forests and discover amazing wildlife.' },
    { number: '02', title: 'Feed the animals', text: 'Feed the animals their favourite treats and become the ultimate zookeeper of Bulusan Zootopia.' },
    { number: '03', title: 'Discover the wild side', text: 'Meet the wildlife and make new furry friends along the way.' },
];

const ZootopiaSection = () => {
    const [showPlayConfirm, setShowPlayConfirm] = useState(false);

    const handleQuickPlay = () => {
        setShowPlayConfirm(false);
        window.open(ZOOTOPIA_GAME_URL, '_blank', 'noopener,noreferrer');
    };

    return (
        <Band id="zootopia" labelledBy="zootopia-title" bg={PARK.sage} waveVariant="a" className="z-30">
            <div className="overflow-hidden rounded-[2.25rem] bg-[#1d4a2e] text-white shadow-[0_24px_50px_-24px_rgba(16,50,28,0.7)]">
                <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="p-6 sm:p-10 lg:p-14">
                        <SectionTitle id="zootopia-title" eyebrow="Bulusan Zootopia Adventure Game" tone="dark-bg" size="lg">Play the wild<br />side of Bulusan.</SectionTitle>
                        <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/80 lg:text-lg">
                            Welcome to Bulusan Zootopia, a game where you explore the beauty of nature, discover amazing animals, and feed them treats. Wander through lush forests, meet the wildlife, and make new furry friends along the way.
                        </p>
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={() => setShowPlayConfirm(true)}
                                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#c6fe69] px-8 py-3 text-sm font-semibold text-[#14301f] transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6fe69]"
                            >
                                <PlayIcon className="h-3.5 w-3.5" />
                                Quick Play
                            </button>
                            <p className="text-sm font-medium leading-6 text-white/65">Opens adventuregame.bulusanzoo.com in a new tab so you can come back to Bulusan Zoo any time.</p>
                        </div>
                    </div>
                    <div className="relative min-h-56 sm:min-h-72 lg:min-h-full">
                        <img src={PHOTOS.tower} alt="Wooden lookout tower among tall trees in Bulusan Park" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover lg:[mask-image:linear-gradient(to_right,transparent,black_38%)]" />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#1d4a2e] via-transparent to-transparent lg:hidden" />
                    </div>
                </div>
                <ul className="grid gap-3 p-4 pt-0 sm:grid-cols-3 sm:gap-4 sm:p-8 sm:pt-0 lg:px-14 lg:pb-14">
                    {zootopiaFeatures.map((feature) => (
                        <li key={feature.number} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                            <span className="inline-flex rounded-full bg-[#c6fe69] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#14301f]">{feature.number}</span>
                            <h3 className="mt-3 font-display text-xl font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-sm font-medium leading-6 text-white/70">{feature.text}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <ConfirmationModal
                isOpen={showPlayConfirm}
                title="Open Bulusan Zootopia?"
                message="Quick Play opens the Bulusan Zootopia Adventure Game at adventuregame.bulusanzoo.com in a new tab."
                confirmLabel="Play now"
                cancelLabel="Stay here"
                onConfirm={handleQuickPlay}
                onClose={() => setShowPlayConfirm(false)}
            />
        </Band>
    );
};

/* ───────────────────────────── Activities ───────────────────────────── */

const activities = [
    { title: 'Trek', src: PHOTOS.bridge, alt: 'Wooden footbridge leading toward the park gateway', note: 'Follow the documented eco-trail from the park toward Barangay Parang.' },
    { title: 'Jog', src: PHOTOS.garden, alt: 'Brick garden path lined with foliage', note: 'Take in the park setting at a comfortable pace.' },
    { title: 'Ride', src: PHOTOS.plaza, alt: 'Wide brick plaza winding between garden beds', note: 'The tourism portal lists mountain biking among the park’s outdoor activities.' },
    { title: 'Camp', src: PHOTOS.trees, alt: 'Shaded lawn beneath century-old trees', note: 'Picnic and camping grounds are included in the official tourism listing.' },
];

const ActivitiesSection = () => (
    <Band id="activities" labelledBy="activities-title" bg={PARK.cream} waveVariant="b" className="z-40" decor={<Marquee words="Trek · Jog · Ride · Camp · Trek · Jog · Ride · Camp ·" />}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle id="activities-title" eyebrow="Choose your pace" size="lg">Ways to move<br />through nature.</SectionTitle>
            <p className="max-w-md text-sm font-medium leading-6 text-[#1d4a2e]/70 sm:text-base">Activities documented by the official Oriental Mindoro tourism portal. Availability and site conditions can change.</p>
        </div>
        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-6 [&::-webkit-scrollbar]:hidden">
            {activities.map((activity, index) => (
                <li key={activity.title} className={`w-[80%] shrink-0 snap-start sm:w-auto ${index % 2 === 1 ? 'lg:translate-y-8' : ''}`}>
                    <article className={`group h-full rounded-3xl bg-white p-2.5 ${cardShadow}`}>
                        <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#dcebd0]">
                            <img src={activity.src} alt={activity.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                        </div>
                        <div className="px-3 pb-4 pt-4">
                            <p className="text-xs font-semibold tracking-[0.16em] text-[#1f7a3e]/70">0{index + 1}</p>
                            <h3 className="font-display text-3xl font-semibold text-[#1d4a2e]">{activity.title}</h3>
                            <p className="mt-2 text-sm font-medium leading-6 text-[#1d4a2e]/70">{activity.note}</p>
                        </div>
                    </article>
                </li>
            ))}
        </ul>
        <div className="h-8 lg:h-12" aria-hidden="true" />
    </Band>
);

/* ───────────────────────────── Trail ───────────────────────────── */

const TrailSection = () => (
    <Band id="trail" labelledBy="trail-title" bg={PARK.deep} waveVariant="a" className="z-50" decor={<Leaf className="-left-6 bottom-6 h-32 w-32 rotate-[-30deg] opacity-25 sm:h-44 sm:w-44" fill="#4ade80" />}>
        <div className="relative overflow-hidden rounded-[2.25rem]">
            <img src={PHOTOS.gateway} alt="Stone gateway pillar beside a shaded lawn beneath century-old trees" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(105deg,rgba(18,52,31,0.94)_0%,rgba(18,52,31,0.82)_45%,rgba(18,52,31,0.35)_100%)]" />
            <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14 lg:p-14">
                <SectionTitle id="trail-title" eyebrow="Nature and eco-trail" tone="dark-bg" size="xl">From old trees<br />to the coast.</SectionTitle>
                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-md sm:p-8">
                    <p className="text-lg font-semibold leading-8 text-white sm:text-xl">
                        The Oriental Mindoro tourism portal describes century-old trees throughout the park and identifies it as the entry point to the Bulusan eco-trail.
                    </p>
                    <p className="mt-4 text-sm leading-6 text-white/75">
                        The listed route takes approximately one hour and ends at the seashore in Barangay Parang. Current trail conditions, access arrangements, and safety guidance are not published; confirm locally before setting out.
                    </p>
                    <a href={TOURISM_SOURCE} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#c6fe69] px-6 py-2.5 text-sm font-semibold text-[#14301f] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6fe69]">
                        Read the tourism listing <ArrowUpRight />
                    </a>
                </div>
            </div>
        </div>
    </Band>
);

/* ───────────────────────────── Official records ───────────────────────────── */

const officialLinks = [
    { href: CITY_SOURCE, title: 'City Government of Calapan', note: 'Park description, administration, photographs, and contact' },
    { href: TOURISM_SOURCE, title: 'Travel Oriental Mindoro', note: 'Official destination gallery, recreation details, and directions' },
];

const OfficialRecordsSection = () => (
    <Band id="official-records" labelledBy="official-records-title" bg={PARK.mint} waveVariant="b" className="z-[60]">
        <div className={`rounded-[2.25rem] bg-white p-6 sm:p-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:p-14 ${cardShadow}`}>
            <SectionTitle id="official-records-title" eyebrow="Documentary sources" size="md">See the park through official channels.</SectionTitle>
            <ul className="mt-8 grid gap-4 lg:mt-0">
                {officialLinks.map((link) => (
                    <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer" className={`group flex min-h-24 items-center justify-between gap-5 rounded-2xl bg-[#f1f7ec] p-5 transition-colors hover:bg-[#e2efd8] ${focusRing}`}>
                            <span>
                                <strong className="block font-display text-xl font-semibold text-[#1d4a2e]">{link.title}</strong>
                                <span className="mt-1 block text-sm font-medium text-[#1d4a2e]/65">{link.note}</span>
                            </span>
                            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d4a2e] text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"><ArrowUpRight /></span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </Band>
);

/* ───────────────────────────── Arrival ───────────────────────────── */

const ArrivalSection = () => (
    <Band id="arrival" labelledBy="arrival-title" bg={PARK.cream} waveVariant="a" className="z-[70]" decor={<Leaf className="-right-4 top-10 h-28 w-28 rotate-[25deg] opacity-70 sm:h-40 sm:w-40" />}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
            <SectionTitle id="arrival-title" eyebrow="Arriving in Calapan" size="xl">Port to park,<br />plan the last mile.</SectionTitle>
            <div>
                <p className="text-lg font-semibold leading-8 text-[#1d4a2e] sm:text-xl">The City identifies Calapan City Port as Oriental Mindoro’s main gateway and the most direct arrival point for destinations in Calapan.</p>
                <p className="mt-4 text-sm font-medium leading-6 text-[#1d4a2e]/65">No official source publishes a dedicated public-transport route from the port to Bulusan Park. Use the destination pin for directions and confirm local transport before traveling.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <a href={CITY_VISITORS_SOURCE} target="_blank" rel="noreferrer" className={`inline-flex min-h-12 items-center justify-center rounded-full bg-[#1d4a2e] px-7 py-3 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.03] ${focusRing}`}>Calapan travel guide</a>
                    <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer" className={`inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#1d4a2e] px-7 py-3 text-center text-sm font-semibold text-[#1d4a2e] transition-colors hover:bg-[#1d4a2e] hover:text-white ${focusRing}`}>Park directions</a>
                </div>
            </div>
        </div>
    </Band>
);

/* ───────────────────────────── Visitor info ───────────────────────────── */

const VisitorSection = ({ navigate }) => (
    <Band id="visitor-info" labelledBy="visitor-info-title" bg={PARK.green} waveVariant="b" dropWave className="z-[80]" decor={<Leaf className="-left-5 bottom-8 h-32 w-32 rotate-[-20deg] opacity-35 sm:h-44 sm:w-44" fill="#ffffff" />}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <SectionTitle id="visitor-info-title" eyebrow="Visitor information" size="xl">Find your way<br />to Bulusan.</SectionTitle>
            <dl className="rounded-3xl bg-white/90 p-2 shadow-xl shadow-green-900/15 sm:p-3">
                <div className="grid gap-1 rounded-2xl p-4 sm:grid-cols-[8rem_1fr] sm:p-5"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1d4a2e]/55">Location</dt><dd className="font-semibold leading-6 text-[#14301f]">Barangay Bulusan, Calapan City, Oriental Mindoro</dd></div>
                <div className="grid gap-1 rounded-2xl bg-[#f1f7ec] p-4 sm:grid-cols-[8rem_1fr] sm:p-5"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1d4a2e]/55">Park contact</dt><dd><a href="tel:+63432887291" className="font-semibold text-[#14301f] underline decoration-[#1d4a2e]/30 underline-offset-4 hover:decoration-[#1d4a2e]">(043) 288-7291</a><span className="mt-1 block text-sm text-[#1d4a2e]/65">Published by the City Economic Enterprise Department</span></dd></div>
                <div className="grid gap-1 rounded-2xl p-4 sm:grid-cols-[8rem_1fr] sm:p-5"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1d4a2e]/55">Directions</dt><dd><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer" className="font-semibold text-[#14301f] underline decoration-[#1d4a2e]/30 underline-offset-4 hover:decoration-[#1d4a2e]">Open route in Google Maps</a></dd></div>
            </dl>
        </div>
        <p className="mt-8 max-w-2xl text-sm font-medium leading-6 text-[#0f3a1f]/80">Operating schedules, admission arrangements, and available activities may change. Confirm with the City Government of Calapan before visiting.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate('/reservations')} className="min-h-12 rounded-full bg-[#14301f] px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14301f]">Plan a visit</button>
            <button type="button" onClick={() => navigate('/animals')} className="min-h-12 rounded-full border-2 border-[#14301f] px-8 py-3 text-sm font-semibold text-[#14301f] transition-colors hover:bg-[#14301f] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14301f]">Explore animals</button>
        </div>
    </Band>
);

/* ───────────────────────────── Page ───────────────────────────── */

const Home = () => {
    const navigate = useNavigate();

    usePageMetadata('Bulusan Zoo | Calapan City', PAGE_DESCRIPTION, 'https://bulusanzoo.com/');

    return (
        <ReactLenis root>
            <div className="relative min-h-[100dvh] bg-white">
                <Header />
                <AIFloatingButton />
                <main className="relative w-full overflow-x-clip">
                    <HeroSection />
                    <AboutSection />
                    <ExploreSection />
                    <ZootopiaSection />
                    <ActivitiesSection />
                    <TrailSection />
                    <OfficialRecordsSection />
                    <ArrivalSection />
                    <VisitorSection navigate={navigate} />
                </main>
                <div className="relative z-50 w-full"><Footer /></div>
            </div>
        </ReactLenis>
    );
};

export default Home;
