import { School } from "lucide-react";
import RichTextRenderer from "@/components/rich-text-renderer";
import type { StrapiAdmissionScore } from "@/lib/strapi";

// Types
interface AdmissionScorePageProps {
	admissionScore: StrapiAdmissionScore;
}

export default function AdmissionScorePage({ admissionScore }: AdmissionScorePageProps) {
	// Check if content exists and has meaningful data
	const hasContent = admissionScore.content && admissionScore.content.length > 0;

	// Render
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="text-center">
				<h1 className="mb-4 font-bold text-3xl text-foreground tracking-tight">
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
					<p className="max-w-md text-muted-foreground text-sm">
						{admissionScore.title} ile ilgili detaylı taban puan bilgileri aşağıdaki tabloda yer
						almaktadır.
					</p>
				</div>
			)}

			{/* Visual separator */}
			<hr className="border-muted" />
		</div>
	);
}
