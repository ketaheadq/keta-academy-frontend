"use client";

import { ArrowRight, Search, Users } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DURATION, EASE_OUT } from "@/lib/motion";
import {
	EMPTY_RATING,
	type StrapiTutoringProfile,
	type TutorRatingSummary,
	tutorPath,
} from "@/lib/strapi";
import { RatingStars } from "./rating-stars";
import { TutorContactButtons } from "./tutor-contact-buttons";

function TutorCard({
	tutor,
	rating,
	phone,
}: Readonly<{ tutor: StrapiTutoringProfile; rating: TutorRatingSummary; phone?: string | null }>) {
	const href = tutorPath(tutor);
	const subjects = tutor.subjects ?? [];

	return (
		// The name link stretches over the whole card (after:inset-0); contact buttons sit above it (z-10).
		<article className="border-border group bg-card relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
			<div className="flex items-start gap-4 p-6 pb-4">
				<div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
					<Image
						src={tutor.profilePicture?.url || "/placeholder.svg"}
						alt=""
						fill
						sizes="(min-width: 640px) 80px, 64px"
						className="border-card rounded-full border-4 object-cover shadow-lg"
					/>
				</div>

				<div className="min-w-0 flex-1">
					<h3 className="text-foreground group-hover:text-primary text-xl font-bold transition-colors">
						<Link href={href} className="after:absolute after:inset-0 hover:underline">
							{tutor.name}
						</Link>
					</h3>
					<p className="text-primary mb-2 font-medium">{tutor.title}</p>
					<div className="flex flex-wrap items-center gap-2 text-sm">
						{rating.count > 0 ? (
							<>
								<RatingStars value={rating.average} />
								<span className="text-foreground font-semibold">
									{rating.average.toLocaleString("tr-TR")}
								</span>
								<span className="text-muted-foreground">({rating.count})</span>
							</>
						) : (
							<span className="text-muted-foreground">Henüz değerlendirme yok</span>
						)}
					</div>
				</div>
			</div>

			{subjects.length > 0 && (
				<div className="flex flex-wrap gap-2 px-6 pb-4">
					{subjects.slice(0, 3).map((subject) => (
						<span
							key={subject.slug}
							className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium"
						>
							{subject.title}
						</span>
					))}
					{subjects.length > 3 && (
						<span className="bg-secondary text-muted-foreground rounded-full px-2 py-1 text-xs font-medium">
							+{subjects.length - 3} daha
						</span>
					)}
				</div>
			)}

			{/* Stats */}
			<div className="px-6 pb-4">
				<div className="grid grid-cols-3 gap-2 text-center sm:gap-4">
					<div className="bg-primary/10 rounded-lg px-1 py-2 sm:p-3">
						<div className="text-primary text-lg font-bold">
							{rating.satisfaction !== null ? `%${rating.satisfaction}` : "—"}
						</div>
						<div className="dark:text-muted-foreground text-xs text-slate-600">Memnuniyet</div>
					</div>
					<div className="bg-primary/10 rounded-lg px-1 py-2 sm:p-3">
						<div className="text-primary text-lg font-bold">{tutor.studentCount}</div>
						<div className="dark:text-muted-foreground text-xs text-slate-600">Öğrenci</div>
					</div>
					<div className="bg-primary/10 rounded-lg px-1 py-2 sm:p-3">
						<div className="text-primary text-lg font-bold">{tutor.exprienceYears}</div>
						<div className="dark:text-muted-foreground text-xs text-slate-600">Yıl Deneyim</div>
					</div>
				</div>
			</div>

			<div className="mt-auto px-6 pb-6">
				<div className="mb-4 flex items-center justify-between">
					<div className="text-foreground text-2xl font-bold">
						₺{tutor.price}
						<span className="text-muted-foreground text-sm font-normal">/saat</span>
					</div>
					<span
						className="text-primary flex items-center gap-1 text-sm font-medium"
						aria-hidden="true"
					>
						Profili gör{" "}
						<ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
					</span>
				</div>
				<TutorContactButtons tutorName={tutor.name} phone={phone} compact />
			</div>
		</article>
	);
}

export default function TutoringContent({
	data,
	ratings,
	fallbackPhone,
}: Readonly<{
	data: StrapiTutoringProfile[];
	ratings: Record<string, TutorRatingSummary>;
	/** Contact page phone, used for tutors without their own number. */
	fallbackPhone?: string | null;
}>) {
	const tutors = data;
	const ratingOf = (tutor: StrapiTutoringProfile) => ratings[tutor.documentId] ?? EMPTY_RATING;
	const [selectedSubject, setSelectedSubject] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("rating");

	// Generate subjects dynamically from tutors
	const subjects = [
		{ id: "all", name: "Tüm Dersler", count: tutors.length },
		...tutors.reduce<{ id: string; name: string; count: number }[]>((acc, tutor) => {
			tutor.subjects.forEach((subject) => {
				const existing = acc.find((s) => s.id === subject.slug);
				if (existing) {
					existing.count++;
				} else {
					acc.push({
						id: subject.slug,
						name: subject.title,
						count: 1,
					});
				}
			});
			return acc;
		}, []),
	];

	const filteredTutors = tutors
		.filter((tutor) => {
			const matchesSubject =
				selectedSubject === "all" ||
				tutor.subjects.some((subject) => subject.slug === selectedSubject);
			const matchesSearch =
				tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tutor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(tutor.experties ?? "").toLowerCase().includes(searchQuery.toLowerCase());
			return matchesSubject && matchesSearch;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "rating":
					return ratingOf(b).average - ratingOf(a).average || ratingOf(b).count - ratingOf(a).count;
				case "price":
					return a.price - b.price;
				case "experience":
					return b.exprienceYears - a.exprienceYears;
				default:
					return 0;
			}
		});

	return (
		<div id="ogretmenler" className="mx-auto scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
			<h2 className="sr-only">Öğretmenler</h2>
			{/* Filters */}
			<div className="border-border bg-card mb-8 rounded-2xl border p-4 shadow-sm sm:p-6">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					{/* Subject Filters */}
					<div className="flex flex-wrap gap-2">
						{subjects.map((subject) => (
							<button
								type="button"
								key={subject.id}
								onClick={() => setSelectedSubject(subject.id)}
								className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out active:scale-95 ${
									selectedSubject === subject.id
										? "bg-primary text-background scale-[1.02] shadow-lg"
										: "bg-secondary hover:bg-secondary dark:text-muted-foreground text-slate-600"
								}`}
							>
								{subject.name} ({subject.count})
							</button>
						))}
					</div>

					{/* Search and Sort */}
					<div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row lg:w-auto lg:shrink-0">
						<div className="relative min-w-0 flex-1">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
							<input
								type="text"
								placeholder="Öğretmen ara..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="border-border focus:ring-primary w-full min-w-0 rounded-xl border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2"
							/>
						</div>

						<select
							aria-label="Öğretmen sıralama"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="border-border focus:ring-primary w-full min-w-0 rounded-xl border px-4 py-2 focus:border-transparent focus:ring-2 sm:w-auto"
						>
							<option value="rating">Puana Göre</option>
							<option value="price">Fiyata Göre</option>
							<option value="experience">Deneyime Göre</option>
						</select>
					</div>
				</div>
			</div>

			{/* Tutors Grid */}
			<AnimatePresence mode="wait" initial={false}>
				<m.div
					key={`${selectedSubject}|${sortBy}`}
					variants={{
						hidden: {},
						shown: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
					}}
					initial="hidden"
					animate="shown"
					exit={{ opacity: 0, transition: { duration: 0.1 } }}
					className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
				>
					{filteredTutors.map((tutor) => (
						<m.div
							key={tutor.id}
							variants={{
								hidden: { opacity: 0, y: 12 },
								shown: { opacity: 1, y: 0 },
							}}
							className="[&>*]:h-full"
						>
							<TutorCard
								tutor={tutor}
								rating={ratingOf(tutor)}
								phone={tutor.phone || fallbackPhone}
							/>
						</m.div>
					))}
				</m.div>
			</AnimatePresence>

			{/* Empty State */}
			{filteredTutors.length === 0 && (
				<m.div
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: DURATION.base, ease: EASE_OUT }}
					className="py-16 text-center"
				>
					<div className="bg-secondary mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full">
						<Users className="text-muted-foreground h-12 w-12" />
					</div>
					<h3 className="text-foreground mb-4 text-2xl font-bold">Öğretmen bulunamadı</h3>
					<p className="text-muted-foreground mx-auto mb-6 max-w-md">
						Arama kriterlerinizi değiştirmeyi deneyin veya tüm öğretmenleri görüntüleyin
					</p>
					<button
						type="button"
						onClick={() => {
							setSelectedSubject("all");
							setSearchQuery("");
						}}
						className="bg-primary text-background hover:bg-primary rounded-xl px-6 py-3 font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
					>
						Filtreleri Temizle
					</button>
				</m.div>
			)}
		</div>
	);
}
