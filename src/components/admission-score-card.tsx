"use client";

import { Calendar, ExternalLink, FileText, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiAdmissionScore } from "@/lib/strapi";

interface AdmissionScoreCardProps {
	admissionScore: StrapiAdmissionScore;
	showRelatedData?: boolean;
}

export default function AdmissionScoreCard({
	admissionScore,
	showRelatedData = false,
}: AdmissionScoreCardProps) {
	const pathname = usePathname();
	return (
		<Card className="cursor-pointer transition-shadow hover:shadow-lg">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex items-center space-x-2">
							<Badge variant="secondary">
								<Calendar className="mr-1 h-3 w-3" />
								{new Date(admissionScore.publishedAt).toLocaleDateString(
									"tr-TR",
								)}
							</Badge>
							{admissionScore.content && admissionScore.content.length > 0 && (
								<Badge className="bg-green-500">
									<FileText className="mr-1 h-3 w-3" />
									Taban Puanları
								</Badge>
							)}
							{admissionScore.isPopular && (
								<Badge className="bg-blue-500">
									<Star className="mr-1 h-3 w-3" />
									Popüler
								</Badge>
							)}
						</div>

						<CardTitle className="mb-2 text-lg">
							{admissionScore.title}
						</CardTitle>

						{/* Content Preview */}
						{admissionScore.content && admissionScore.content.length > 0 && (
							<div className="mb-3 text-gray-600 text-sm">
								<p className="line-clamp-2">
									{admissionScore.content[0]?.children?.[0]?.text ||
										"İçerik mevcut"}
								</p>
							</div>
						)}

						{/* Related Data */}
						{showRelatedData &&
							admissionScore.related_datas &&
							admissionScore.related_datas.length > 0 && (
								<div className="space-y-1">
									<span className="block font-medium text-gray-700 text-sm">
										İlgili Veriler ({admissionScore.related_datas.length})
									</span>
									<div className="flex flex-wrap gap-1">
										{admissionScore.related_datas.slice(0, 2).map((related) => (
											<Badge
												key={related.id}
												variant="outline"
												className="text-xs"
											>
												{related.title}
											</Badge>
										))}
										{admissionScore.related_datas.length > 2 && (
											<Badge variant="outline" className="text-xs">
												+{admissionScore.related_datas.length - 2} daha
											</Badge>
										)}
									</div>
								</div>
							)}

						{/* Page Reference */}
						{admissionScore.page && (
							<div className="mt-2 text-gray-500 text-xs">
								<strong>Sayfa:</strong> {admissionScore.page.title}
							</div>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Link href={`${pathname}/${admissionScore.slug}`}>
					<Button className="w-full">
						<ExternalLink className="mr-2 h-4 w-4" />
						Detayları Gör
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}
