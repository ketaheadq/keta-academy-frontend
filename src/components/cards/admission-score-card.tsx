"use client";

import { Calendar, ExternalLink, FileText, Star, TrendingUp, Users, Award } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StrapiAdmissionScore } from "@/lib/strapi";

interface AdmissionScoreCardProps {
	admissionScore: StrapiAdmissionScore;
	showRelatedData?: boolean;
}

export default function AdmissionScoreCard({
	admissionScore,
	showRelatedData = false,
}: Readonly<AdmissionScoreCardProps>) {
	const pathname = usePathname();
	const router = useRouter();

	const handleCardClick = () => {
		router.push(`${pathname}/${admissionScore.slug}`);
	};

	// Generate a color scheme based on the title for consistency
	const getColorScheme = (title: string) => {
		const colors = [
			{ bg: "bg-gradient-to-br from-blue-500 to-purple-600", accent: "bg-blue-100", text: "text-blue-600" },
			{ bg: "bg-gradient-to-br from-green-500 to-teal-600", accent: "bg-green-100", text: "text-green-600" },
			{ bg: "bg-gradient-to-br from-orange-500 to-red-600", accent: "bg-orange-100", text: "text-orange-600" },
			{ bg: "bg-gradient-to-br from-purple-500 to-pink-600", accent: "bg-purple-100", text: "text-purple-600" },
			{ bg: "bg-gradient-to-br from-indigo-500 to-blue-600", accent: "bg-indigo-100", text: "text-indigo-600" },
			{ bg: "bg-gradient-to-br from-emerald-500 to-green-600", accent: "bg-emerald-100", text: "text-emerald-600" },
		];
		const index = title.length % colors.length;
		return colors[index];
	};

	const colorScheme = getColorScheme(admissionScore.title);

	return (
		<Card 
			className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden border-0" 
			onClick={handleCardClick}
		>
			<CardContent className="p-0">
				<div className="flex h-32">
					{/* Left side - Colorful gradient section */}
					<div className={`${colorScheme.bg} w-24 flex flex-col items-center justify-center relative`}>
						<div className="absolute inset-0 bg-black/10" />
						<div className="relative z-10 flex flex-col items-center">
							<Award className="h-8 w-8 text-white mb-1" />
							<div className="text-white text-xs font-bold text-center">
								{admissionScore.isPopular ? "POPÜLER" : "TABAN"}
							</div>
						</div>
						{/* Decorative elements */}
						<div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full" />
						<div className="absolute bottom-2 left-2 w-1 h-1 bg-white/20 rounded-full" />
					</div>

					{/* Right side - Content section */}
					<div className="flex-1 p-4 flex flex-col justify-between">
						{/* Top section */}
						<div className="flex-1">
							<div className="flex items-start justify-between mb-2">
								<h3 className="font-bold text-gray-900 text-lg flex-1 mr-2 leading-tight line-clamp-2">
									{admissionScore.title}
								</h3>
								{admissionScore.isPopular && (
									<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex-shrink-0">
										<Star className="mr-1 h-3 w-3" />
										Popüler
									</Badge>
								)}
							</div>

							{/* Content preview */}
							{admissionScore.content && admissionScore.content.length > 0 && (
								<p className="text-gray-600 text-sm line-clamp-2 mb-2">
									{admissionScore.content[0]?.children?.[0]?.text || "Taban puanları ve detaylar mevcut"}
								</p>
							)}

							{/* Stats row */}
							<div className="flex items-center space-x-4 text-xs text-gray-500">
								<div className="flex items-center">
									<Calendar className="mr-1 h-3 w-3" />
									{new Date(admissionScore.publishedAt).toLocaleDateString("tr-TR")}
								</div>
								{admissionScore.content && admissionScore.content.length > 0 && (
									<div className="flex items-center">
										<FileText className="mr-1 h-3 w-3" />
										Veri Mevcut
									</div>
								)}
							</div>
						</div>

						{/* Bottom section - Action button */}
						<div className="flex items-center justify-between mt-3">
							{/* Related data indicator */}
							{showRelatedData && admissionScore.related_datas && admissionScore.related_datas.length > 0 && (
								<div className="flex items-center text-xs text-gray-500">
									<Users className="mr-1 h-3 w-3" />
									{admissionScore.related_datas.length} ilgili veri
								</div>
							)}

							<Button
								size="sm"
								className={`${colorScheme.accent} ${colorScheme.text} hover:opacity-90 transition-opacity`}
								onClick={(e) => {
									e.stopPropagation();
									handleCardClick();
								}}
							>
								<TrendingUp className="mr-1 h-3 w-3" />
								Detayları Gör
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
