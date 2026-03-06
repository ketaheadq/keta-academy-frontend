"use client";

import { Award, Calendar, FileText, Star, TrendingUp, Users } from "lucide-react";
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
			{
				bg: "bg-linear-to-br from-primary to-primary",
				accent: "bg-primary/10",
				text: "text-primary",
			},
			{
				bg: "bg-linear-to-br from-primary to-primary",
				accent: "bg-primary/10",
				text: "text-primary",
			},
			{
				bg: "bg-linear-to-br from-accent to-destructive",
				accent: "bg-accent/10",
				text: "text-accent",
			},
			{
				bg: "bg-linear-to-br from-primary to-destructive",
				accent: "bg-primary/10",
				text: "text-primary",
			},
			{
				bg: "bg-linear-to-br from-primary to-primary",
				accent: "bg-primary/10",
				text: "text-primary",
			},
			{
				bg: "bg-linear-to-br from-primary to-primary",
				accent: "bg-primary/10",
				text: "text-primary",
			},
		];
		const index = title.length % colors.length;
		return colors[index];
	};

	const colorScheme = getColorScheme(admissionScore.title);

	return (
		<Card
			className="cursor-pointer overflow-hidden border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
			onClick={handleCardClick}
		>
			<CardContent className="p-0">
				<div className="flex h-32">
					{/* Left side - Colorful gradient section */}
					<div
						className={`${colorScheme.bg} relative flex w-24 flex-col items-center justify-center`}
					>
						<div className="absolute inset-0 bg-black/10" />
						<div className="relative z-10 flex flex-col items-center">
							<Award className="mb-1 h-8 w-8 text-white" />
							<div className="text-center font-bold text-white text-xs">
								{admissionScore.isPopular ? "POPÜLER" : "TABAN"}
							</div>
						</div>
						{/* Decorative elements */}
						<div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-white/30" />
						<div className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-white/20" />
					</div>

					{/* Right side - Content section */}
					<div className="flex flex-1 flex-col justify-between p-4">
						{/* Top section */}
						<div className="flex-1">
							<div className="mb-2 flex items-start justify-between">
								<h3 className="mr-2 line-clamp-2 flex-1 font-bold text-foreground text-lg leading-tight">
									{admissionScore.title}
								</h3>
								{admissionScore.isPopular && (
									<Badge className="shrink-0 border-accent bg-accent/10 text-accent">
										<Star className="mr-1 h-3 w-3" />
										Popüler
									</Badge>
								)}
							</div>

							{/* Content preview */}
							{admissionScore.content && admissionScore.content.length > 0 && (
								<p className="mb-2 line-clamp-2 text-muted-foreground text-sm">
									{admissionScore.content[0]?.children?.[0]?.text ||
										"Taban puanları ve detaylar mevcut"}
								</p>
							)}

							{/* Stats row */}
							<div className="flex items-center space-x-4 text-muted-foreground text-xs">
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
						<div className="mt-3 flex items-center justify-between">
							{/* Related data indicator */}
							{showRelatedData &&
								admissionScore.related_datas &&
								admissionScore.related_datas.length > 0 && (
									<div className="flex items-center text-muted-foreground text-xs">
										<Users className="mr-1 h-3 w-3" />
										{admissionScore.related_datas.length} ilgili veri
									</div>
								)}

							<Button
								size="sm"
								className={`${colorScheme.accent} ${colorScheme.text} transition-opacity hover:opacity-90`}
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
