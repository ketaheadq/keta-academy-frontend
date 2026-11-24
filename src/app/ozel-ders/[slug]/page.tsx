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
		<div className="bg-secondary min-h-screen">
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
									<h1 className="text-foreground text-2xl font-bold sm:text-3xl">{tutor.name}</h1>
									<p className="text-primary mt-1 font-medium">{tutor.title}</p>
									<div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
										{rating.count > 0 ? (
											<>
												<RatingStars value={rating.average} />
												<span className="text-foreground font-semibold">
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
													className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium"
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
									<div key={stat.label} className="bg-primary/10 rounded-xl px-1 py-3">
										<stat.icon className="text-primary mx-auto mb-1 h-4 w-4" aria-hidden="true" />
										<div className="text-primary text-lg font-bold">{stat.value}</div>
										<div className="text-muted-foreground text-xs">{stat.label}</div>
									</div>
								))}
							</div>
						</section>

						{(tutor.content?.length || expertise.length > 0) && (
							<section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
								<h2 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold">
									<BookOpen className="h-5 w-5" aria-hidden="true" />
									Hakkında
								</h2>
								{expertise.length > 0 && (
									<div className="mb-4 flex flex-wrap gap-2">
										{expertise.map((item) => (
											<span
												key={item}
												className="text-muted-foreground rounded-full border bg-white px-3 py-1 text-sm"
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
							<div className="text-foreground text-3xl font-bold">
								₺{tutor.price}
								<span className="text-muted-foreground text-base font-normal">/saat</span>
							</div>
							<p className="text-muted-foreground mt-2 text-sm">
								Ücretsiz deneme dersi ve seviye tespiti için {tutor.name} ile doğrudan iletişime
								geçin.
							</p>
							<TutorContactButtons tutorName={tutor.name} phone={phone} className="mt-4" />
							{!phone && (
								<p className="text-muted-foreground mt-4 text-sm">
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
						<div className="text-foreground shrink-0 text-xl font-bold">
							₺{tutor.price}
							<span className="text-muted-foreground text-xs font-normal">/saat</span>
						</div>
						<TutorContactButtons tutorName={tutor.name} phone={phone} compact className="flex-1" />
					</div>
				</div>
			)}
		</div>
	);
}
