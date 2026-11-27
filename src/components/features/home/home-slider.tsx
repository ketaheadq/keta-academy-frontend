"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import styles from "../../../app/hero.module.css";

export type Slide = {
	id: number | string;
	baslik: string;
	altMetin?: string | null;
	butonYazisi?: string | null;
	link?: string | null;
	gorselUrl?: string | null;
};

const AUTOPLAY_MS = 6000;

/** Headline, standfirst and button land one after another as a slide becomes active. */
const copyContainer = {
	hidden: {},
	shown: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const copyLine = {
	hidden: { opacity: 0, y: 14 },
	shown: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

/**
 * Home page slider managed in the panel (Anasayfa Slaytı). Swipe on mobile (scroll snap);
 * autoplay stops for good once the visitor touches, clicks or focuses it.
 * Slides without an image use the current hero artwork.
 */
export function HomeSlider({ slides }: Readonly<{ slides: Slide[] }>) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const [autoplay, setAutoplay] = useState(slides.length > 1);

	const goTo = useCallback((index: number) => {
		const track = trackRef.current;
		if (!track) return;
		const count = track.children.length;
		const next = (index + count) % count;
		// JS `behavior` beats the CSS reduced-motion guard, so it has to be decided here.
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		track.scrollTo({
			left: next * track.clientWidth,
			behavior: reduce ? "auto" : "smooth",
		});
	}, []);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const onScroll = () => setActive(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
		track.addEventListener("scroll", onScroll, { passive: true });
		return () => track.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		if (!autoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = setInterval(() => goTo(active + 1), AUTOPLAY_MS);
		return () => clearInterval(timer);
	}, [autoplay, active, goTo]);

	const stopAutoplay = () => setAutoplay(false);

	return (
		<>
			{slides[0]?.gorselUrl ? (
				<link rel="preload" as="image" href={slides[0].gorselUrl} fetchPriority="high" />
			) : (
				<>
					<link
						rel="preload"
						as="image"
						href="/images/ketalearn-hero-mobile.jpg"
						media="(max-width: 767px)"
						fetchPriority="high"
					/>
					<link
						rel="preload"
						as="image"
						href="/images/ketalearn-hero-tablet.jpg"
						media="(min-width: 768px) and (max-width: 1023px)"
						fetchPriority="high"
					/>
					<link
						rel="preload"
						as="image"
						href="/images/ketalearn-hero-desktop.jpg"
						media="(min-width: 1024px)"
						fetchPriority="high"
					/>
				</>
			)}
			<section
				aria-roledescription="carousel"
				aria-label="Öne çıkanlar"
				className="relative"
				onPointerDown={stopAutoplay}
				onFocusCapture={stopAutoplay}
			>
				<div
					ref={trackRef}
					className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto rounded-3xl [&::-webkit-scrollbar]:hidden"
				>
					{slides.map((slide, index) => (
						<div key={slide.id} className="w-full shrink-0 snap-start">
							<div
								className={cn(styles.hero, slide.gorselUrl && styles.custom)}
								style={
									slide.gorselUrl
										? ({ "--slide-image": `url("${slide.gorselUrl}")` } as React.CSSProperties)
										: undefined
								}
							>
								<m.div
									className={styles.copy}
									variants={copyContainer}
									initial="hidden"
									animate={active === index ? "shown" : "hidden"}
								>
									{index === 0 ? (
										<m.h1
											variants={copyLine}
											className="max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl"
										>
											{slide.baslik}
										</m.h1>
									) : (
										<m.h2
											variants={copyLine}
											className="max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl"
										>
											{slide.baslik}
										</m.h2>
									)}
									{slide.altMetin && (
										<m.p
											variants={copyLine}
											className="mt-3 max-w-xl text-base text-pretty text-slate-700 sm:mt-4 sm:text-lg dark:text-slate-300"
										>
											{slide.altMetin}
										</m.p>
									)}
									{slide.link && slide.butonYazisi && (
										<m.div variants={copyLine}>
											<Button
												asChild
												size="lg"
												className="group mt-5 transition-transform hover:scale-[1.02] active:scale-[0.98] sm:mt-6"
											>
												<Link href={slide.link}>
													{slide.butonYazisi}{" "}
													<ArrowRight
														className="transition-transform group-hover:translate-x-0.5"
														aria-hidden="true"
													/>
												</Link>
											</Button>
										</m.div>
									)}
								</m.div>
							</div>
						</div>
					))}
				</div>

				{slides.length > 1 && (
					<div className="mt-2 flex items-center justify-center gap-3 sm:mt-3">
						<button
							type="button"
							onClick={() => goTo(active - 1)}
							aria-label="Önceki slayt"
							className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-transform duration-200 ease-out hover:scale-125 active:scale-95"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>
						{slides.map((slide, index) => (
							<button
								key={slide.id}
								type="button"
								onClick={() => goTo(index)}
								aria-label={`${index + 1}. slayt`}
								aria-current={index === active}
								className={cn(
									"h-2.5 rounded-full transition-[width,background-color] duration-300 ease-out active:scale-90",
									index === active ? "bg-primary w-6" : "bg-border w-2.5 hover:bg-slate-400",
								)}
							/>
						))}
						<button
							type="button"
							onClick={() => goTo(active + 1)}
							aria-label="Sonraki slayt"
							className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-transform duration-200 ease-out hover:scale-125 active:scale-95"
						>
							<ChevronRight className="h-5 w-5" />
						</button>
					</div>
				)}
			</section>
		</>
	);
}
