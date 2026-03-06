"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCourseIcon } from "@/lib/icons";
import type { StrapiSubject } from "@/lib/strapi";

export default function BrowseBySubject({ subjects }: Readonly<{ subjects: StrapiSubject[] }>) {
	return (
		<section className="mb-12">
			<h2 className="mb-6 flex items-center font-semibold text-2xl text-foreground">
				📖 Derslere Göre Ara:
			</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				{subjects.map((subject) => {
					const IconComponent = subject.icon?.name ? getCourseIcon(subject.icon?.name) : undefined;
					return (
						<Card
							key={subject.id}
							className="cursor-pointer transition-shadow hover:shadow-lg"
							onClick={() => {
								globalThis.window.location.href = `/konular/${subject.slug}`;
							}}
						>
							<CardContent className="p-6 text-center">
								<div className="mb-3 inline-flex rounded-full bg-primary/10 p-3">
									{IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
								</div>
								<h3 className="font-semibold text-foreground">{subject.title}</h3>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
