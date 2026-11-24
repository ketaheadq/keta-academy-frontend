import { Award, BookOpen, Clock, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RatingStars } from "@/components/features/tutoring/rating-stars";
import { TutorContactButtons } from "@/components/features/tutoring/tutor-contact-buttons";
import { TutorReviews } from "@/components/features/tutoring/tutor-reviews";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import RichTextRenderer from "@/components/shared/content/rich-text-renderer";
import {
	EMPTY_RATING,
	getContactPage,
	getTutoringProfile,
	getTutorRatingSummaries,
	tutorPath,
} from "@/lib/strapi";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketalearn.cloud";

type PageProps = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const tutor = await getTutoringProfile(decodeURIComponent(slug));
	if (!tutor) return { title: "Öğretmen bulunamadı | KetaLearn" };

	const title = tutor.SEO?.metaTitle || `${tutor.name} – ${tutor.title} | KetaLearn`;
	const description =
		tutor.SEO?.metaDescription ||
		`${tutor.name} ile birebir ${tutor.subjects?.map((s) => s.title).join(", ") || "özel ders"}. Ücretsiz deneme dersi için WhatsApp'tan yazın.`;
	const url = `${FRONTEND_URL}${tutorPath(tutor)}`;
	const image = tutor.SEO?.metaImage?.url || tutor.profilePicture?.url;
	return {
		title,
		description: description.slice(0, 160),
		keywords: tutor.SEO?.keywords,
		alternates: { canonical: url },
		openGraph: {
			title,
			description: description.slice(0, 160),
			url,
			type: "profile",
			siteName: "KetaLearn",
			locale: "tr_TR",
			...(image && { images: [{ url: image, alt: tutor.name }] }),
		},
	};
}

export default async function TutorPage({ params }: PageProps) {
	const { slug } = await params;
	const [tutor, summaries, contactPage] = await Promise.all([
		getTutoringProfile(decodeURIComponent(slug)),
		getTutorRatingSummaries(),
		getContactPage().catch(() => null),
	]);
	if (!tutor) notFound();

	const rating = summaries[tutor.documentId] ?? EMPTY_RATING;
	// Tutor's own number first, then the site's contact number.
	const phone = tutor.phone || contactPage?.phone;
	const expertise = (tutor.experties ?? "")
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

	const stats = [
		{
			icon: Award,
			value: rating.satisfaction !== null ? `%${rating.satisfaction}` : "—",
			label: rating.satisfaction !== null ? "Memnuniyet" : "Henüz oy yok",
		},
		{ icon: Users, value: tutor.studentCount, label: "Öğrenci" },
		{ icon: Clock, value: tutor.exprienceYears, label: "Yıl deneyim" },
	];

	return (
		<div className="min-h-screen bg-secondary">
			<BreadcrumbNav
				breadcrumbs={[
					{ label: "Özel Ders", href: "/ozel-ders" },
					{ label: tutor.name, href: tutorPath(tutor) },
				]}
			/>

			<main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Left: profile, about, reviews */}
					<div className="min-w-0 space-y-6 lg:col-span-2">
						<section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
							<div className="flex flex-col gap-5 sm:flex-row sm:items-center">
								<div className="relative h-28 w-28 shrink-0">
									<Image
										src={tutor.profilePicture?.url || "/placeholder.svg"}
										alt={tutor.name}
										fill
										sizes="112px"
										className="rounded-full border-4 border-white object-cover shadow-lg"
										priority
									/>
								</div>
								<div className="min-w-0">
									<h1 className="font-bold text-2xl text-foreground sm:text-3xl">{tutor.name}</h1>
									<p className="mt-1 font-medium text-primary">{tutor.title}</p>
									<div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
										{rating.count > 0 ? (
											<>
												<RatingStars value={rating.average} />
												<span className="font-semibold text-foreground">
													{rating.average.toLocaleString("tr-TR")}
												</span>
												<a href="#reviews-title" className="text-muted-foreground underline">
													{rating.count} değerlendirme
												</a>
											</>
										) : (
											<span className="text-muted-foreground">Henüz değerlendirme yok</span>
										)}
									</div>
									{tutor.subjects?.length > 0 && (
										<div className="mt-3 flex flex-wrap gap-2">
											{tutor.subjects.map((subject) => (
												<span
													key={subject.slug}
													className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm"
												>
													{subject.title}
												</span>
											))}
										</div>
									)}
								</div>
							</div>

							<div className="mt-6 grid grid-cols-3 gap-2 text-center sm:gap-4">
								{stats.map((stat) => (
									<div key={stat.label} className="rounded-xl bg-primary/10 px-1 py-3">
										<stat.icon className="mx-auto mb-1 h-4 w-4 text-primary" aria-hidden="true" />
										<div className="font-bold text-lg text-primary">{stat.value}</div>
										<div className="text-muted-foreground text-xs">{stat.label}</div>
									</div>
								))}
							</div>
						</section>

						{(tutor.content?.length || expertise.length > 0) && (
							<section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
								<h2 className="mb-4 flex items-center gap-2 font-bold text-foreground text-xl">
									<BookOpen className="h-5 w-5" aria-hidden="true" />
									Hakkında
								</h2>
								{expertise.length > 0 && (
									<div className="mb-4 flex flex-wrap gap-2">
										{expertise.map((item) => (
											<span
												key={item}
												className="rounded-full border bg-white px-3 py-1 text-muted-foreground text-sm"
											>
												{item}
											</span>
										))}
									</div>
								)}
								{tutor.content?.length ? <RichTextRenderer content={tutor.content} /> : null}
							</section>
						)}

						<TutorReviews tutorDocumentId={tutor.documentId} tutorName={tutor.name} />
					</div>

					{/* Right: price + contact (desktop) */}
					<aside className="hidden min-w-0 lg:block">
						<div className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">
							<div className="font-bold text-3xl text-foreground">
								₺{tutor.price}
								<span className="font-normal text-base text-muted-foreground">/saat</span>
							</div>
							<p className="mt-2 text-muted-foreground text-sm">
								Ücretsiz deneme dersi ve seviye tespiti için {tutor.name} ile doğrudan iletişime
								geçin.
							</p>
							<TutorContactButtons tutorName={tutor.name} phone={phone} className="mt-4" />
							{!phone && (
								<p className="mt-4 text-muted-foreground text-sm">
									İletişim bilgisi yakında eklenecek.
								</p>
							)}
						</div>
					</aside>
				</div>
			</main>

			{/* Mobile: price + contact sticky at the bottom while the page is in view (stops above the footer) */}
			{phone && (
				<div className="sticky bottom-0 z-40 border-t bg-white/95 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
					<div className="mx-auto flex max-w-6xl items-center gap-3">
						<div className="shrink-0 font-bold text-foreground text-xl">
							₺{tutor.price}
							<span className="font-normal text-muted-foreground text-xs">/saat</span>
						</div>
						<TutorContactButtons tutorName={tutor.name} phone={phone} compact className="flex-1" />
					</div>
				</div>
			)}
		</div>
	);
}
