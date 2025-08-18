"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCourseIcon } from "@/lib/icons";
import type { StrapiSubject } from "@/lib/strapi";

export default function BrowseBySubject({
	subjects,
}: {
	subjects: StrapiSubject[];
}) {
	return (
		<section className="mb-12">
			<h2 className="mb-6 flex items-center font-semibold text-2xl text-gray-900">
				📖 Derslere Göre Ara:
			</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				{subjects.map((subject) => {
					const IconComponent = subject.icon?.name
						? getCourseIcon(subject.icon?.name)
						: undefined;
					return (
						<Card
							key={subject.id}
							className="cursor-pointer transition-shadow hover:shadow-lg"
							onClick={() => {
								window.location.href = `/konular/${subject.slug}`;
							}}
						>
							<CardContent className="p-6 text-center">
								<div className="mb-3 inline-flex rounded-full bg-blue-100 p-3">
									{IconComponent && (
										<IconComponent className="h-6 w-6 text-blue-600" />
									)}
								</div>
								<h3 className="font-semibold text-gray-900">{subject.title}</h3>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
