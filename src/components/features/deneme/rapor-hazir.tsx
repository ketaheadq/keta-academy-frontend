"use client";

import { FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { buttonVariants } from "@/components/ui/button";
import { getRaporOzeti } from "@/lib/deneme";
import { trackDeneme } from "@/lib/deneme-tracking";
import { cn } from "@/lib/utils";

const POLL_MS = 3000;
const GIVE_UP_MS = 3 * 60 * 1000;

/**
 * Waits for the PDF report (prepared in the background, usually within a minute), then offers
 * to open it and to share its link on WhatsApp (to oneself or a parent). After a few minutes it
 * shows the link anyway: the link itself says "being prepared" until the PDF is ready.
 */
export function RaporHazir({
	raporKey,
	denemeBaslik,
}: Readonly<{ raporKey: string; denemeBaslik: string }>) {
	const [ready, setReady] = useState(false);
	const [timedOut, setTimedOut] = useState(false);
	const [url, setUrl] = useState(`/rapor/${encodeURIComponent(raporKey)}`);

	useEffect(() => {
		setUrl(`${window.location.origin}/rapor/${encodeURIComponent(raporKey)}`);
		const started = Date.now();
		let timer: ReturnType<typeof setTimeout>;
		let stopped = false;
		const check = async () => {
			const rapor = await getRaporOzeti(raporKey).catch(() => null);
			if (stopped) return;
			if (rapor?.hazir) return setReady(true);
			if (Date.now() - started > GIVE_UP_MS) return setTimedOut(true);
			timer = setTimeout(check, POLL_MS);
		};
		void check();
		return () => {
			stopped = true;
			clearTimeout(timer);
		};
	}, [raporKey]);

	if (!ready && !timedOut) {
		return (
			<p className="text-foreground mt-3 flex items-center gap-2">
				<Loader2 className="text-primary h-5 w-5 animate-spin" aria-hidden="true" />
				Raporun hazırlanıyor, genellikle bir dakikadan kısa sürer…
			</p>
		);
	}

	const shareText = `KetaLearn ${denemeBaslik} deneme raporum: ${url}`;
	return (
		<div className="mt-3">
			{timedOut && !ready && (
				<p className="text-muted-foreground mb-3 text-sm">
					Hazırlanması biraz uzun sürüyor. Linki birkaç dakika sonra açabilirsin.
				</p>
			)}
			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
				<a
					href={url}
					target="_blank"
					rel="noopener"
					onClick={() => trackDeneme("rapor_ac_tiklama", denemeBaslik)}
					className={buttonVariants({ size: "lg" })}
				>
					<FileText aria-hidden="true" /> PDF raporunu aç
				</a>
				<a
					href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
					target="_blank"
					rel="noopener noreferrer"
					onClick={() => trackDeneme("rapor_paylas", denemeBaslik)}
					className={cn(
						buttonVariants({ size: "lg" }),
						"bg-green-700 text-white hover:bg-green-800",
					)}
				>
					<WhatsAppIcon className="size-5" /> WhatsApp'ta paylaş
				</a>
			</div>
			<p className="text-muted-foreground mt-3 text-sm">
				Linki kaydetmek için kendine ya da veline WhatsApp'tan gönderebilirsin.
			</p>
		</div>
	);
}
