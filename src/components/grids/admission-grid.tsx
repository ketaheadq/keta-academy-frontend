"use client";

import { Calculator } from "lucide-react";
import AdmissionScoreCard from "@/components/cards/admission-score-card";
import DynamicGrid from "@/components/grids/dynamic-grid";
import type { StrapiAdmissionScore } from "@/lib/strapi";

interface AdmissionGridProps {
	items: StrapiAdmissionScore[];
	title?: string;
	showRelatedData?: boolean;
}

export default function AdmissionGrid({
	items,
	title = "Taban Puanlar",
	showRelatedData = false,
}: AdmissionGridProps) {
	return (
		<DynamicGrid
			items={items}
			searchFields={["title"]}
			filterConfigs={[]}
			renderItem={(admissionScore: StrapiAdmissionScore) => (
				<AdmissionScoreCard
					key={admissionScore.id}
					admissionScore={admissionScore}
					showRelatedData={showRelatedData}
				/>
			)}
			title={title}
			emptyStateConfig={{
				icon: <Calculator className="mx-auto mb-4 h-12 w-12 text-gray-400" />,
				title: "Taban puan bulunamadı",
				description: "Filtreleri değiştirerek taban puanları bulabilirsiniz.",
			}}
		/>
	);
}
