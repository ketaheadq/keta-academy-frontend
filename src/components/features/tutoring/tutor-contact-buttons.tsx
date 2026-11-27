"use client";

import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { buttonVariants } from "@/components/ui/button";
import { telUrl, trackTutorContact, tutorWhatsappMessage, whatsappUrl } from "@/lib/contact";
import { cn } from "@/lib/utils";

/** WhatsApp (pre-filled message) and call buttons for a tutor. Renders nothing without a phone. */
export function TutorContactButtons({
	tutorName,
	phone,
	compact = false,
	className,
}: Readonly<{ tutorName: string; phone?: string | null; compact?: boolean; className?: string }>) {
	const whatsapp = whatsappUrl(phone, tutorWhatsappMessage(tutorName));
	const tel = telUrl(phone);
	if (!whatsapp && !tel) return null;

	return (
		<div className={cn("flex gap-2", compact ? "flex-row" : "flex-col sm:flex-row", className)}>
			{whatsapp && (
				<a
					href={whatsapp}
					target="_blank"
					rel="noopener noreferrer"
					onClick={() => trackTutorContact("whatsapp", tutorName)}
					className={cn(
						buttonVariants({ size: compact ? "default" : "lg" }),
						"relative z-10 flex-1 bg-green-700 text-white hover:bg-green-800",
					)}
				>
					<WhatsAppIcon className="size-5" />
					WhatsApp'tan Yaz
				</a>
			)}
			{tel && (
				<a
					href={tel}
					onClick={() => trackTutorContact("phone", tutorName)}
					aria-label={compact ? `${tutorName} ile telefonla görüş` : undefined}
					className={cn(
						buttonVariants({ variant: "outline", size: compact ? "default" : "lg" }),
						"relative z-10",
						compact ? "shrink-0" : "flex-1",
					)}
				>
					<Phone className="size-4" />
					{compact ? <span className="sr-only">Ara</span> : "Ara"}
				</a>
			)}
		</div>
	);
}
