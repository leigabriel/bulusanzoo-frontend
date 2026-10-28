import { useLayoutEffect, useMemo } from 'react';
import { ReactLenis } from 'lenis/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AIFloatingButton from '../../components/common/AIFloatingButton';
import { ArrowUpRight, Band, Leaf, SectionTitle } from '../../components/common/ParkDecor';
import { PARK, PHOTOS } from '../../config/park-theme';
import usePageMetadata from '../../hooks/use-page-metadata';

const CITY_SOURCE = 'https://cityofcalapan.gov.ph/the-city-economic-enterprise-department-ceed/';
const TOURISM_SOURCE = 'https://www.travelorientalmindoro.ph/place/calapan-nature-park';
const HISTORY_SOURCE = 'https://pia4b.wordpress.com/2013/04/02/zoological-park-sa-calapan-bukas-na-sa-publiko/';
const TRAVEL_ADVISORY_SOURCE = 'https://www.travelorientalmindoro.ph/page/travel-advisory';
const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=13.40496178,121.1991656';

const cardShadow = 'shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)]';
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f7a3e]';
const pillLight = `inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1d4a2e] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] ${focusRing}`;

const facts = [
    { label: 'Formal name', value: 'Calapan City Recreational and Zoological Park' },
    { label: 'Common name', value: 'Bulusan Park' },
    { label: 'Location', value: 'Barangay Bulusan, Calapan City, Oriental Mindoro' },
    { label: 'Administration', value: 'City Economic Enterprise Department, City Government of Calapan' },
];

// Only the 4:5 portraits are listed so every tile in the strip keeps the same crop.
const parkPhotos = [
    { src: PHOTOS.walkway, alt: 'Brick walkway curving toward the pavilion at Bulusan Park' },
    { src: PHOTOS.arch, alt: 'White arched gateway framing a walkway into Bulusan Park' },
    { src: PHOTOS.pond, alt: 'Rock-lined waterfall spilling into a pond at Bulusan Park' },
    { src: PHOTOS.garden, alt: 'Garden path lined with red and green foliage at Bulusan Park' },
    { src: PHOTOS.climb, alt: 'Wall climbing tower rising among the trees at Bulusan Park' },
    { src: PHOTOS.trees, alt: 'Century-old trees casting shade across the open lawn at Bulusan Park' },
    { src: PHOTOS.bridge, alt: 'Wooden footbridge leading to the park gateway' },
];

const pickRandomPhotos = (count) => {
    const shuffled = [...parkPhotos];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
};

/* ───────────────────────────── Hero ───────────────────────────── */

const AboutHero = () => (
    <section aria-labelledby="about-title" className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-[#2f7d3a]">
        <img src={PHOTOS.gateway} alt="" aria-hidden="true" decoding="async" className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-[3px]" />
        <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(196,236,124,0.94)_0%,rgba(110,196,80,0.86)_9%,rgba(40,134,56,0.88)_30%,rgba(24,104,50,0.92)_100%)]"
        />

        <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-4 pb-10 pt-28 text-center sm:px-6">
            <p className="hero-rise inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-[#c6fe69]" aria-hidden="true" />
                A park of Calapan City
            </p>
            <h1
                id="about-title"
                className="hero-rise mt-5 font-display text-[clamp(4rem,15vw,9rem)] font-bold uppercase leading-[0.86] tracking-tight text-white [text-shadow:0_6px_0_rgba(16,70,34,0.38)]"
                style={{ animationDelay: '0.08s' }}
            >
                Bulusan<br />Park
            </h1>
            <p className="hero-rise mt-6 max-w-2xl text-base font-medium leading-7 text-white [text-shadow:0_1px_8px_rgba(10,60,25,0.6)] sm:text-lg" style={{ animationDelay: '0.2s' }}>
                Formally the Calapan City Recreational and Zoological Park, Bulusan Park is a City-managed destination for family recreation, environmental education, leisure, and community gatherings.
            </p>
        </div>

        <div className="hero-rise relative mx-auto w-full max-w-[1280px] px-4 pb-24 sm:px-6 sm:pb-28 lg:px-10" style={{ animationDelay: '0.32s' }}>
            <dl className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {facts.map((fact) => (
                    <div key={fact.label} className="rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-md sm:p-5">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c6fe69]">{fact.label}</dt>
                        <dd className="mt-2 text-sm font-semibold leading-6 text-white">{fact.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    </section>
);

/* ───────────────────────────── Photos ───────────────────────────── */

const PhotoStrip = () => {
    // Picked once per visit so the strip feels fresh without reshuffling on every render.
    const photos = useMemo(() => pickRandomPhotos(4), []);

    return (
        <Band
            id="park-photos"
            labelledBy="park-photos-title"
            bg={PARK.cream}
            className="z-10"
            decor={<Leaf className="-left-4 top-12 h-28 w-28 rotate-[-25deg] opacity-80" />}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <SectionTitle id="park-photos-title" eyebrow="Park gallery" size="lg">Scenes from<br />the park</SectionTitle>
                <p className="max-w-md text-base font-medium leading-7 text-[#1d4a2e]/75">Shaded walkways, garden ponds, and the open grounds visitors pass through on the way to the pavilion.</p>
            </div>
            <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
                {photos.map((photo, index) => (
                    <li key={photo.src} className={`w-[72%] shrink-0 snap-center sm:w-auto ${index % 2 === 1 ? 'lg:translate-y-8' : ''}`}>
                        <figure className={`group rounded-3xl bg-white p-2.5 ${cardShadow}`}>
                            <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[#dcebd0]">
                                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                            </div>
                        </figure>
                    </li>
                ))}
            </ul>
            <div className="h-8 lg:h-12" aria-hidden="true" />
        </Band>
    );
};

/* ───────────────────────────── Story & stewardship ───────────────────────────── */

const StorySection = () => (
    <Band id="park-story" labelledBy="park-story-title" bg={PARK.peach} waveVariant="b" className="z-20">
        <div className={`rounded-[2.25rem] bg-white p-6 sm:p-10 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:p-14 ${cardShadow}`}>
            <SectionTitle id="park-story-title" eyebrow="Park story" size="md">A public park with a documented history.</SectionTitle>
            <div className="mt-8 lg:mt-0">
                <p className="text-xl font-semibold leading-8 text-[#1d4a2e] sm:text-2xl sm:leading-9">
                    A Philippine Information Agency report published on April 2, 2013 described the Calapan Recreational and Zoological Park as newly open to the public in Barangay Bulusan.
                </p>
                <p className="mt-5 text-base font-medium leading-7 text-[#1d4a2e]/70">
                    The report recorded the formal opening by City officials and described the park at that point in time. Its animal and facility details are historical, not a statement of what visitors will find today.
                </p>
                <a href={HISTORY_SOURCE} target="_blank" rel="noreferrer" className={`mt-7 ${pillLight}`}>
                    Read the 2013 PIA report <ArrowUpRight />
                </a>
            </div>
        </div>
    </Band>
);

const StewardshipSection = () => (
    <Band id="stewardship" labelledBy="stewardship-title" bg={PARK.sage} waveVariant="a" className="z-30" decor={<Leaf className="-right-4 top-10 h-32 w-32 rotate-[30deg] opacity-60" fill="#86d99a" />}>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <SectionTitle id="stewardship-title" eyebrow="City stewardship" size="lg">How the park<br />is managed.</SectionTitle>
            <div className={`rounded-3xl bg-white p-6 sm:p-8 ${cardShadow}`}>
                <p className="text-lg font-semibold leading-8 text-[#1d4a2e] sm:text-xl">Bulusan Park is one of Calapan City’s economic enterprises under the direct administration, supervision, maintenance, and control of the City Economic Enterprise Department.</p>
                <p className="mt-5 text-base font-medium leading-7 text-[#1d4a2e]/70">The City traces this mandate to its Economic Enterprise Code, identifying Resolution No. 724 and City Ordinance No. 19, Article IV, Section 8. This places the park within a broader municipal public-service framework.</p>
                <a href={CITY_SOURCE} target="_blank" rel="noreferrer" className={`mt-7 ${pillLight}`}>
                    Read the City CEED profile <ArrowUpRight />
                </a>
            </div>
        </div>
    </Band>
);

/* ───────────────────────────── Nature ───────────────────────────── */

const natureCards = [
    { number: '01', title: 'Natural setting', src: PHOTOS.trees, alt: 'Century-old trees shading the open lawn', text: 'The provincial tourism portal documents century-old trees, picnic and camping areas, recreation space, and wall-climbing facilities within the park.' },
    { number: '02', title: 'Wildlife', src: PHOTOS.lawn, alt: 'Animal grazing on the open lawn inside the park', text: 'The City describes a mini-zoo with various animal species. Because no current official inventory is published, species lists from historical reports are not presented as current.' },
    { number: '03', title: 'Community space', src: PHOTOS.pavilion, alt: 'Multi-purpose pavilion beside a stone path', text: 'Landscaped open areas support leisure and recreation, while the multi-purpose pavilion serves events and community gatherings.' },
];

const NatureSection = () => (
    <Band id="nature" labelledBy="nature-title" bg={PARK.deep} waveVariant="b" className="z-40" decor={<Leaf className="-left-6 bottom-8 h-40 w-40 rotate-[-30deg] opacity-25" fill="#4ade80" />}>
        <SectionTitle id="nature-title" eyebrow="Nature and recreation" tone="dark-bg" size="xl">Room to learn,<br />gather, and explore.</SectionTitle>
        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {natureCards.map((card) => (
                <li key={card.number} className="w-[82%] shrink-0 snap-start sm:w-auto">
                    <article className="group h-full rounded-3xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-sm">
                        <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#12341f]">
                            <img src={card.src} alt={card.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                        </div>
                        <div className="px-3 pb-4 pt-4">
                            <span className="inline-flex rounded-full bg-[#c6fe69] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#14301f]">{card.number}</span>
                            <h3 className="mt-3 font-display text-2xl font-semibold text-white">{card.title}</h3>
                            <p className="mt-2 text-sm font-medium leading-6 text-white/75">{card.text}</p>
                        </div>
                    </article>
                </li>
            ))}
        </ul>
    </Band>
);

/* ───────────────────────────── Eco-trail ───────────────────────────── */

const EcoTrailSection = () => (
    <Band id="eco-trail" labelledBy="eco-trail-title" bg={PARK.green} waveVariant="a" className="z-50" decor={<Leaf className="-right-5 bottom-6 h-36 w-36 rotate-[25deg] opacity-35" fill="#ffffff" />}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <SectionTitle id="eco-trail-title" eyebrow="Bulusan eco-trail" size="xl">A route from<br />park to shore.</SectionTitle>
            <div className="rounded-3xl bg-white/90 p-6 shadow-xl shadow-green-900/15 sm:p-8">
                <p className="text-lg font-semibold leading-8 text-[#14301f] sm:text-xl">The official provincial tourism listing identifies the park as the entry point to the Bulusan eco-trail.</p>
                <p className="mt-4 text-sm font-medium leading-6 text-[#1d4a2e]/70">It describes an approximately one-hour route ending at the seashore in Barangay Parang. Visitors should confirm current access, trail conditions, and local guidance before a hike.</p>
                <a href={TOURISM_SOURCE} target="_blank" rel="noreferrer" className={`mt-6 ${pillLight}`}>
                    View official tourism information <ArrowUpRight />
                </a>
            </div>
        </div>
    </Band>
);

/* ───────────────────────────── Trail readiness ───────────────────────────── */

const readyTips = [
    { number: '01', title: 'Watch the weather', text: 'Oriental Mindoro’s advisory notes that mountain trails can be slippery in the June-October wet season and recommends flexible plans during typhoon season.' },
    { number: '02', title: 'Pack for outdoors', text: 'The provincial guidance recommends water, sun protection, insect repellent, personal medication, and a basic first-aid kit.' },
    { number: '03', title: 'Confirm locally', text: 'These are province-wide recommendations, not park-specific rules. Ask local tourism or park contacts about current trail access and conditions before setting out.', link: true },
];

const TrailReadySection = () => (
    <Band id="trail-ready" labelledBy="trail-ready-title" bg={PARK.cream} waveVariant="b" className="z-[60]">
        <SectionTitle id="trail-ready-title" eyebrow="Provincial travel guidance" size="lg">Go prepared.<br />Leave room to adapt.</SectionTitle>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {readyTips.map((tip) => (
                <li key={tip.number}>
                    <article className={`flex h-full flex-col rounded-3xl bg-white p-6 sm:p-7 ${cardShadow}`}>
                        <span className="inline-flex w-fit rounded-full bg-[#e6f1df] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#1f7a3e]">{tip.number}</span>
                        <h3 className="mt-4 font-display text-2xl font-semibold text-[#1d4a2e]">{tip.title}</h3>
                        <p className="mt-3 flex-1 text-sm font-medium leading-6 text-[#1d4a2e]/70">{tip.text}</p>
                        {tip.link && (
                            <a href={TRAVEL_ADVISORY_SOURCE} target="_blank" rel="noreferrer" className={`mt-6 w-fit ${pillLight}`}>
                                Read the travel advisory <ArrowUpRight />
                            </a>
                        )}
                    </article>
                </li>
            ))}
        </ul>
    </Band>
);

/* ───────────────────────────── Visit ───────────────────────────── */

const VisitSection = () => (
    <Band id="visit" labelledBy="visit-title" bg={PARK.mint} waveVariant="a" dropWave className="z-[70]" decor={<Leaf className="-left-5 bottom-10 h-32 w-32 rotate-[-20deg] opacity-40" />}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <SectionTitle id="visit-title" eyebrow="Visit information" size="lg">Plan with<br />current information.</SectionTitle>
            <div>
                <dl className={`rounded-3xl bg-white p-2 sm:p-3 ${cardShadow}`}>
                    <div className="grid gap-1 rounded-2xl p-4 sm:grid-cols-[8rem_1fr] sm:p-5"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1d4a2e]/55">Location</dt><dd className="font-semibold leading-6 text-[#14301f]">Barangay Bulusan, Calapan City, Oriental Mindoro</dd></div>
                    <div className="grid gap-1 rounded-2xl bg-[#f1f7ec] p-4 sm:grid-cols-[8rem_1fr] sm:p-5"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1d4a2e]/55">Contact</dt><dd><a href="tel:+63432887291" className="font-semibold text-[#14301f] underline decoration-[#1d4a2e]/30 underline-offset-4 hover:decoration-[#1d4a2e]">(043) 288-7291</a><span className="mt-1 block text-sm text-[#1d4a2e]/65">City CEED park contact</span></dd></div>
                    <div className="grid gap-1 rounded-2xl p-4 sm:grid-cols-[8rem_1fr] sm:p-5"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1d4a2e]/55">Directions</dt><dd><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer" className="font-semibold text-[#14301f] underline decoration-[#1d4a2e]/30 underline-offset-4 hover:decoration-[#1d4a2e]">Open Google Maps directions</a></dd></div>
                </dl>
                <p className="mt-5 text-sm font-medium leading-6 text-[#1d4a2e]/70">Operating schedules, admission arrangements, and available activities may change. Confirm with the City Government of Calapan before visiting.</p>
            </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#1d4a2e]/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm font-medium leading-6 text-[#1d4a2e]/70">Current park information and documentary photographs are available through the official source pages.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
                <a href={CITY_SOURCE} target="_blank" rel="noreferrer" className={`inline-flex min-h-12 items-center justify-center rounded-full bg-[#1d4a2e] px-7 py-3 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.03] ${focusRing}`}>City Government source</a>
                <a href={TOURISM_SOURCE} target="_blank" rel="noreferrer" className={`inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#1d4a2e] px-7 py-3 text-center text-sm font-semibold text-[#1d4a2e] transition-colors hover:bg-[#1d4a2e] hover:text-white ${focusRing}`}>Tourism source</a>
            </div>
        </div>
    </Band>
);

/* ───────────────────────────── Page ───────────────────────────── */

const AboutUs = () => {
    const description = 'Learn about Bulusan Park, the Calapan City Recreational and Zoological Park in Barangay Bulusan, its history, natural setting, recreation areas, and community role.';
    usePageMetadata('About Bulusan Park | Calapan City', description, 'https://bulusanzoo.com/about');

    useLayoutEffect(() => {
        // Page transitions can leave a faded header behind; always start clean.
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.style.opacity = '1';
            headerElement.style.pointerEvents = 'auto';
        }
    }, []);

    return (
        <ReactLenis root>
            <div className="relative min-h-screen bg-white">
                <Header />
                <AIFloatingButton />

                <main className="relative w-full overflow-x-clip">
                    <AboutHero />
                    <PhotoStrip />
                    <StorySection />
                    <StewardshipSection />
                    <NatureSection />
                    <EcoTrailSection />
                    <TrailReadySection />
                    <VisitSection />
                </main>

                <div className="relative z-50 w-full"><Footer /></div>
            </div>
        </ReactLenis>
    );
};

export default AboutUs;
