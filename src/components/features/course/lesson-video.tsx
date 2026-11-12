"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

interface YouTubePlayer {
	destroy: () => void;
}

type YouTubeWindow = Window & {
	YT?: {
		Player?: new (
			iframe: HTMLIFrameElement,
			options: { events: { onStateChange: (event: { data: number }) => void } },
		) => YouTubePlayer;
		PlayerState: { ENDED: number };
	};
	onYouTubeIframeAPIReady?: () => void;
};

export default function LessonVideo({
	videoId,
	title,
	onEnded,
}: Readonly<{ videoId: string; title: string; onEnded: () => void }>) {
	const container = useRef<HTMLDivElement>(null);
	const onEndedRef = useRef(onEnded);

	useEffect(() => {
		onEndedRef.current = onEnded;
	}, [onEnded]);

	useEffect(() => {
		const host = container.current;
		if (!host) return;

		const browser = window as YouTubeWindow;
		const params = new URLSearchParams({ enablejsapi: "1", origin: browser.location.origin });
		const iframe = document.createElement("iframe");
		iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params}`;
		iframe.title = title;
		iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
		iframe.allowFullscreen = true;
		iframe.className = "absolute inset-0 h-full w-full border-0";

		let active = true;
		let player: YouTubePlayer | undefined;
		const previousReady = browser.onYouTubeIframeAPIReady;
		const attachPlayer = () => {
			const api = browser.YT;
			if (!active || player || !api?.Player) return;
			player = new api.Player(iframe, {
				events: {
					onStateChange: ({ data }) => {
						if (active && data === api.PlayerState.ENDED) onEndedRef.current();
					},
				},
			});
		};
		const handleReady = () => {
			previousReady?.();
			attachPlayer();
		};
		browser.onYouTubeIframeAPIReady = handleReady;
		host.appendChild(iframe);
		attachPlayer();

		return () => {
			active = false;
			if (browser.onYouTubeIframeAPIReady === handleReady) {
				browser.onYouTubeIframeAPIReady = previousReady;
			}
			player?.destroy();
			iframe.remove();
		};
	}, [title, videoId]);

	return (
		<>
			<Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
			<div ref={container} className="relative aspect-video overflow-hidden rounded-t-lg bg-black" />
		</>
	);
}
