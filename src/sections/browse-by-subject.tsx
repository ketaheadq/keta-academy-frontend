"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCourseIcon } from "@/lib/icons";
import type { StrapiSubject } from "@/lib/strapi";

export default function BrowseBySubject({ subjects }: Readonly<{ subjects: StrapiSubject[] }>) {
	return (
		<section className="mb-12">
			<h2 className="text-foreground mb-6 flex items-center text-2xl font-semibold">
				📖 Derslere Göre Ara:
			</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				{subjects.map((subject) => {
					const IconComponent = subject.icon?.name ? getCourseIcon(subject.icon?.name) : undefined;
					return (
						<Card
							key={subject.id}
							className="group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
							onClick={() => {
								globalThis.window.location.href = `/konular/${subject.slug}`;
							}}
						>
							<CardContent className="p-6 text-center">
								<div className="bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground mb-3 inline-flex rounded-full p-3 transition-colors duration-300">
									{IconComponent && <IconComponent className="h-6 w-6" />}
								</div>
								<h3 className="text-foreground group-hover:text-accent font-semibold transition-colors">
									{subject.title}
								</h3>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
