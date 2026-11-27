"use client";

import { Share } from "lucide-react";
import type { FC } from "react";
import { toast } from "sonner";
import { FacebookIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";

interface ShareComponentProps {
	className?: string;
}

const getSocialIcon = (platform: string) => {
	switch (platform) {
		case "facebook":
			return <FacebookIcon className="size-7 text-[#0866FF]" />;
		case "whatsapp":
			return <WhatsAppIcon className="size-7 text-[#25D366]" />;
		case "tiktok":
			return <TikTokIcon className="size-7" />;
		case "copy":
			return <Share className="h-8 w-8" />;
		default:
			return <Share className="h-8 w-8" />;
	}
};

const getSocialColor = (platform: string) => {
	switch (platform) {
		case "facebook":
			return "hover:bg-primary/10 hover:text-primary";
		case "whatsapp":
			return "hover:bg-primary/10 hover:text-primary";
		case "tiktok":
			return "hover:bg-foreground hover:text-background";
		case "copy":
			return "hover:bg-secondary hover:text-muted-foreground";
		default:
			return "hover:bg-secondary hover:text-muted-foreground";
	}
};

const ShareComponent: FC<ShareComponentProps> = ({ className = "" }) => {
	const shareLink = (platform: string) => {
		const url = globalThis.location.href;
		const title = document.title;
		const text = `${url}`;

		// Check if device supports native sharing
		if (
			navigator.share &&
			/Mobile|Android|iP(hone|od|ad)|BlackBerry|IEMobile/.test(navigator.userAgent)
		) {
			navigator
				.share({
					title: title,
					text: text,
					url: url,
				})
				.then(() => console.log("Sharing successful"))
				.catch((error) => console.log("Sharing failed", error));
		} else {
			let shareUrl = "";
			switch (platform) {
				case "linkedin":
					shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
					break;
				case "facebook":
					shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
					break;
				case "whatsapp":
					shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
					break;
				case "tiktok":
					// TikTok doesn't have a direct share URL, so we'll copy the link
					navigator.clipboard
						.writeText(url)
						.then(() => toast.success("Link kopyalandı! TikTok'ta paylaşabilirsiniz."))
						.catch(() => toast.error("Link kopyalanamadı."));
					return;
				case "copy":
					navigator.clipboard
						.writeText(url)
						.then(() => toast.success("Link kopyalandı!"))
						.catch(() => toast.error("Link kopyalanamadı."));
					return;
				default:
					break;
			}

			if (shareUrl) {
				window.open(shareUrl, "_blank");
			}
		}
	};

	const shareButtons = [
		{ platform: "copy", label: "Linki Kopyala", visible: true },
		{ platform: "facebook", label: "Facebook", visible: false },
		{ platform: "whatsapp", label: "WhatsApp", visible: false },
		{ platform: "tiktok", label: "TikTok", visible: false },
	];

	return (
		<div className={`flex items-center space-x-2 ${className}`}>
			{shareButtons.map((button) => (
				<Button
					key={button.platform}
					variant="ghost"
					size="lg"
					className={`h-12 w-12 transition-all ${button.visible ? "" : "hidden md:flex"} ${getSocialColor(button.platform)}`}
					onClick={() => shareLink(button.platform)}
				>
					{getSocialIcon(button.platform)}
					<span className="sr-only">{button.label}</span>
				</Button>
			))}
		</div>
	);
};

export default ShareComponent;
