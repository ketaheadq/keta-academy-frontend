"use client";

import { Copy, Share, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
}: ShareButtonProps) {
	const [showShareModal, setShowShareModal] = useState(false);
	const [copySuccess, setCopySuccess] = useState(false);

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
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
		window.open(whatsappUrl, "_blank");
	};

	const handleShareTwitter = () => {
		const text = `${title} - ${description || ""}`;
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
		window.open(twitterUrl, "_blank");
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
				className={`flex items-center space-x-2 ${className}`}
			>
				<Share className="h-4 w-4" />
				<span>Paylaş</span>
			</Button>

			{/* Share Modal */}
			{showShareModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
					<div className="w-full max-w-md rounded-lg bg-white p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-semibold text-lg">Paylaş</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowShareModal(false)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						<div className="space-y-4">
							<div className="rounded-lg bg-gray-50 p-3">
								<p className="mb-1 font-medium text-gray-900 text-sm">
									{title}
								</p>
								{description && (
									<p className="text-gray-600 text-xs">{description}</p>
								)}
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
										className="flex h-16 flex-col items-center space-y-1"
									>
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
											<span className="font-bold text-white text-xs">W</span>
										</div>
										<span className="text-xs">WhatsApp</span>
									</Button>

									<Button
										onClick={handleShareTwitter}
										variant="outline"
										className="flex h-16 flex-col items-center space-y-1"
									>
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-400">
											<span className="font-bold text-white text-xs">T</span>
										</div>
										<span className="text-xs">Twitter</span>
									</Button>

									<Button
										onClick={handleShareFacebook}
										variant="outline"
										className="flex h-16 flex-col items-center space-y-1"
									>
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
											<span className="font-bold text-white text-xs">F</span>
										</div>
										<span className="text-xs">Facebook</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
