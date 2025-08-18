"use client";

import AdmissionScoreCard from "@/components/admission-score-card";
import type { StrapiAdmissionScore } from "@/lib/strapi";
import DynamicListing from "./dynamic-listing";

interface AdmissionListingProps {
	admissionScores: StrapiAdmissionScore[];
	title: React.ReactNode;
}

export default function AdmissionListing({
	admissionScores,
	title,
}: AdmissionListingProps) {
	return (
		<DynamicListing
			items={admissionScores}
			title={title}
			renderItem={(admissionScore) => (
				<AdmissionScoreCard
					key={admissionScore.id}
					admissionScore={admissionScore}
					showRelatedData={true}
				/>
			)}
			maxItems={3}
			gridColumns={{ md: 2, lg: 3 }}
		/>
	);
}
