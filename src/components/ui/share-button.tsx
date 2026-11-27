"use client";

import { Copy, Share, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { FacebookIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { DURATION, EASE_IN, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
	url: string;
	title: string;
	description?: string;
	className?: string;
}

export default function ShareButton({
	url,
	title,
	description,
	className,
}: Readonly<ShareButtonProps>) {
	const [showShareModal, setShowShareModal] = useState(false);
	const [copySuccess, setCopySuccess] = useState(false);
	const [tiktokCopied, setTiktokCopied] = useState(false);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const handleShareWhatsApp = () => {
		const text = `${title} - ${description || ""}`;
		const params = new URLSearchParams({ text: `${text} ${url}` });
		const whatsappUrl = `https://wa.me/?${params.toString()}`;

		window.open(whatsappUrl, "_blank");
	};

	// TikTok has no web share URL: use the device's share sheet (mobile), else copy the link.
	const handleShareTikTok = async () => {
		if (typeof navigator.share === "function") {
			try {
				await navigator.share({ title, text: description, url });
				return;
			} catch (err) {
				if ((err as Error).name === "AbortError") return;
			}
		}
		try {
			await navigator.clipboard.writeText(url);
			setTiktokCopied(true);
			setTimeout(() => setTiktokCopied(false), 2500);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const handleShareFacebook = () => {
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
		window.open(facebookUrl, "_blank");
	};

	return (
		<>
			<Button
				variant="outline"
				onClick={() => setShowShareModal(true)}
				className={cn("flex items-center space-x-2", className)}
			>
				<Share className="h-4 w-4" />
				<span>Paylaş</span>
			</Button>

			<AnimatePresence>
				{showShareModal && (
					<m.div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: DURATION.fast, ease: EASE_IN }}
						onClick={() => setShowShareModal(false)}
					>
						<m.div
							role="dialog"
							aria-modal="true"
							aria-labelledby="share-title"
							className="bg-card w-full max-w-md rounded-lg p-6"
							initial={{ opacity: 0, scale: 0.97, y: 12 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.98, y: 8 }}
							transition={{ duration: DURATION.base, ease: EASE_OUT }}
							onClick={(event) => event.stopPropagation()}
						>
							<div className="mb-4 flex items-center justify-between">
								<h3 id="share-title" className="text-lg font-semibold">
									Paylaş
								</h3>
								<Button
									variant="ghost"
									size="sm"
									aria-label="Paylaşma penceresini kapat"
									onClick={() => setShowShareModal(false)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>

							<div className="space-y-4">
								<div className="bg-secondary rounded-lg p-3">
									<p className="text-foreground mb-1 text-sm font-medium">{title}</p>
									{description && <p className="text-muted-foreground text-xs">{description}</p>}
								</div>

								<div className="space-y-2">
									<Button
										onClick={handleCopyLink}
										className="flex w-full items-center justify-center space-x-2"
										variant={copySuccess ? "secondary" : "default"}
									>
										<Copy className="h-4 w-4" />
										<span>{copySuccess ? "Kopyalandı!" : "Linki Kopyala"}</span>
									</Button>

									<div className="grid grid-cols-3 gap-2">
										<Button
											onClick={handleShareWhatsApp}
											variant="outline"
											className="flex h-16 flex-col items-center gap-1"
										>
											<WhatsAppIcon className="size-6 text-[#25D366]" />
											<span className="text-xs">WhatsApp</span>
										</Button>

										<Button
											onClick={handleShareTikTok}
											variant="outline"
											className="flex h-16 flex-col items-center gap-1"
										>
											<TikTokIcon className="text-foreground size-6" />
											<span className="text-xs">{tiktokCopied ? "Link kopyalandı" : "TikTok"}</span>
										</Button>

										<Button
											onClick={handleShareFacebook}
											variant="outline"
											className="flex h-16 flex-col items-center gap-1"
										>
											<FacebookIcon className="size-6 text-[#0866FF]" />
											<span className="text-xs">Facebook</span>
										</Button>
									</div>
								</div>
							</div>
						</m.div>
					</m.div>
				)}
			</AnimatePresence>
		</>
	);
}
