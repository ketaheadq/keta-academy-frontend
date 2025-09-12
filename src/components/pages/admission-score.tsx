import { School } from "lucide-react";
import type { StrapiAdmissionScore } from "@/lib/strapi";
import RichTextRenderer from "@/components/rich-text-renderer";

// Types
interface AdmissionScorePageProps {
	admissionScore: StrapiAdmissionScore;
}

export default function AdmissionScorePage({
	admissionScore,
}: AdmissionScorePageProps) {
	// Check if content exists and has meaningful data
	const hasContent = admissionScore.content && admissionScore.content.length > 0;

	// Render
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="text-center">
				<h1 className="font-bold text-3xl text-foreground tracking-tight mb-4">
					{admissionScore.title}
				</h1>
				{hasContent && (
					<div className="mx-auto max-w-4xl">
						<RichTextRenderer content={admissionScore.content} />
					</div>
				)}
			</div>

			{/* No Content Fallback */}
			{!hasContent && (
				<div className="flex flex-col items-center justify-center py-8 text-center">
					<School className="mb-4 h-12 w-12 text-muted-foreground" />
					<h3 className="mb-1 font-semibold text-lg">Genel Bilgiler</h3>
					<p className="text-muted-foreground text-sm max-w-md">
						{admissionScore.title} ile ilgili detaylı taban puan bilgileri aşağıdaki tabloda yer almaktadır.
					</p>
				</div>
			)}
			
			{/* Visual separator */}
			<hr className="border-muted" />
		</div>
	);
}
