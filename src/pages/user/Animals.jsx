import { useState, useEffect, useCallback, useRef } from 'react';
import { PARK, PHOTOS } from '../../config/park-theme';
import { Band, PageHero } from '../../components/common/ParkDecor';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ReactLenis } from 'lenis/react';
import AIFloatingButton from '../../components/common/AIFloatingButton';
import { userAPI } from '../../services/api-client';

gsap.registerPlugin(ScrollTrigger);

const statusMap = {
    healthy: { label: 'Healthy', dot: 'bg-[#1f7a3e]' },
    sick: { label: 'Under Care', dot: 'bg-red-500' },
    recovering: { label: 'Recovering', dot: 'bg-amber-500' },
};
const getStatus = (s) => statusMap[s?.toLowerCase()] ?? { label: s || 'Active', dot: 'bg-green-500' };

const deduplicateById = (arr) => {
    const seen = new Set();
    return arr.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });
};

const AnimalCard = ({ animal }) => {
    const imgRef = useRef(null);
    const status = getStatus(animal.status);

    const handleMouseEnter = () => {
        gsap.to(imgRef.current, { scale: 1.05, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
    };

    const handleMouseLeave = () => {
        gsap.to(imgRef.current, { scale: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
    };

    return (
        <Link
            to={`/animals/${animal.id}`}
            className="animal-card group flex cursor-pointer flex-col rounded-3xl bg-white p-2.5 shadow-[0_14px_34px_-16px_rgba(29,74,46,0.45)] transition-shadow hover:shadow-[0_20px_40px_-16px_rgba(29,74,46,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f7a3e]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="aspect-square w-full overflow-hidden rounded-[1.25rem] bg-[#e6f1df]">
                {animal.imageUrl ? (
                    <img loading="lazy" decoding="async"
                        ref={imgRef}
                        src={animal.imageUrl}
                        alt={animal.name}
                        className="h-full w-full origin-center object-cover"
                    />
                ) : (
                    <div ref={imgRef} className="flex h-full w-full items-center justify-center bg-[#e6f1df]">
                        <span className="font-display text-6xl font-bold uppercase text-[#1f7a3e]/40">{animal.name[0]}</span>
                    </div>
                )}
            </div>

            <div className="px-2.5 pb-2 pt-3.5">
                <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate font-display text-lg font-semibold text-[#1d4a2e]">{animal.name}</span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e6f1df] px-2.5 py-1 text-xs font-semibold text-[#1d4a2e]">
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                    </span>
                </div>
                <div className="mt-1 truncate text-sm text-[#1d4a2e]/70">{animal.species}</div>
            </div>
        </Link>
    );
};

const Animals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const gridRef = useRef(null);

    const fetchAnimals = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await userAPI.getAnimals();
            if (response.success && Array.isArray(response.animals)) {
                const mapped = response.animals.map((a) => ({
                    id: a.id,
                    name: a.name,
                    species: a.species || 'Unknown',
                    exhibit: a.habitat || a.exhibit || 'Bulusan Zoo',
                    description: a.description || '',
                    status: a.status || 'healthy',
                    imageUrl: a.image_url || null,
                    lifespan: a.lifespan || null,
                    weight: a.weight || null,
                    length: a.length || null,
                    habitat: a.habitat || null,
                    diet: a.diet || null,
                    animalInformation: a.animal_information || a.animalInformation || null,
                }));
                setAnimals(deduplicateById(mapped));
            } else {
                setAnimals([]);
            }
        } catch {
            setError('Failed to load animals. Please try again.');
            setAnimals([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAnimals(); }, [fetchAnimals]);

    useEffect(() => {
        if (!loading && animals.length > 0) {
            const ctx = gsap.context(() => {
                // Scroll animation for grid items
                gsap.fromTo('.animal-card',
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: 'top 85%',
                        }
                    }
                );
            }, gridRef);
            return () => ctx.revert();
        }
    }, [loading, animals]);

    return (
        <ReactLenis root>
            <div className="relative min-h-screen text-[#1d4a2e]" style={{ backgroundColor: PARK.deep }}>
                <Header />
                <PageHero id="animals-title" photo={PHOTOS.lawn}>Meet Our Animals</PageHero>

                <Band bg={PARK.cream} dropWave className="z-10" innerClassName="min-h-[40svh]">
                    <main ref={gridRef}>
                        {loading && (
                            <div className="flex items-center justify-center py-24" role="status" aria-label="Loading">
                                <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#1f7a3e]/20 border-t-[#1f7a3e]" />
                            </div>
                        )}

                        {!loading && error && (
                            <div className="flex flex-col items-center gap-5 px-6 py-20">
                                <p className="text-center text-base font-semibold text-[#1d4a2e]">{error}</p>
                                <button
                                    onClick={fetchAnimals}
                                    className="cursor-pointer rounded-full bg-[#1d4a2e] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1f7a3e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f7a3e]"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {!loading && !error && animals.length === 0 && (
                            <p className="py-24 text-center font-display text-3xl font-semibold text-[#1d4a2e]/50 md:text-5xl">
                                No animals available
                            </p>
                        )}

                        {!loading && !error && animals.length > 0 && (
                            <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {animals.map((animal) => (
                                    <AnimalCard
                                        key={animal.id}
                                        animal={animal}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </Band>

                <AIFloatingButton />
                <div className="relative z-20"><Footer /></div>
            </div>
        </ReactLenis>
    );
};

export default Animals;