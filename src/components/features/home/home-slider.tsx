"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
		track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
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
		<section
			aria-roledescription="carousel"
			aria-label="Öne çıkanlar"
			className="relative"
			onPointerDown={stopAutoplay}
			onFocusCapture={stopAutoplay}
		>
			<div
				ref={trackRef}
				className="flex snap-x snap-mandatory overflow-x-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
							<div className={styles.copy}>
								{index === 0 ? (
									<h1 className="max-w-3xl text-balance font-bold text-3xl tracking-tight sm:text-5xl">
										{slide.baslik}
									</h1>
								) : (
									<h2 className="max-w-3xl text-balance font-bold text-3xl tracking-tight sm:text-5xl">
										{slide.baslik}
									</h2>
								)}
								{slide.altMetin && (
									<p className="mt-3 max-w-xl text-pretty text-base text-slate-700 sm:mt-4 sm:text-lg">
										{slide.altMetin}
									</p>
								)}
								{slide.link && slide.butonYazisi && (
									<Button asChild size="lg" className="mt-5 sm:mt-6">
										<Link href={slide.link}>
											{slide.butonYazisi} <ArrowRight aria-hidden="true" />
										</Link>
									</Button>
								)}
							</div>
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
						className="rounded-full p-1 text-muted-foreground hover:text-foreground"
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
								"h-2.5 rounded-full transition-all",
								index === active ? "w-6 bg-primary" : "w-2.5 bg-border",
							)}
						/>
					))}
					<button
						type="button"
						onClick={() => goTo(active + 1)}
						aria-label="Sonraki slayt"
						className="rounded-full p-1 text-muted-foreground hover:text-foreground"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			)}
		</section>
	);
}
