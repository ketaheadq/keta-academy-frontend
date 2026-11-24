"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	deleteTutorReview,
	EMPTY_RATING,
	getMyTutorReview,
	getTutorReviews,
	saveTutorReview,
	type TutorRatingSummary,
	type TutorReview,
} from "@/lib/strapi";
import { cn } from "@/lib/utils";
import { useIsAuthenticated, useJWT } from "@/stores/auth-store";
import { RatingStars } from "./rating-stars";

const RATING_LABELS = ["", "Çok kötü", "Kötü", "Orta", "İyi", "Mükemmel"];

function StarInput({
	value,
	onChange,
}: Readonly<{ value: number; onChange: (v: number) => void }>) {
	const [hover, setHover] = useState(0);
	const shown = hover || value;
	return (
		<div className="flex items-center gap-3">
			<fieldset className="flex gap-1" onMouseLeave={() => setHover(0)}>
				<legend className="sr-only">Puanınız</legend>
				{[1, 2, 3, 4, 5].map((n) => (
					<button
						key={n}
						type="button"
						aria-label={`${n} yıldız`}
						aria-pressed={value === n}
						onClick={() => onChange(n)}
						onMouseEnter={() => setHover(n)}
						className="focus-visible:ring-primary rounded p-0.5 focus-visible:ring-2 focus-visible:outline-none"
					>
						<Star
							className={cn(
								"h-8 w-8 transition-colors",
								n <= shown ? "fill-amber-400 text-amber-400" : "text-amber-300",
							)}
						/>
					</button>
				))}
			</fieldset>
			<span className="text-muted-foreground text-sm">{RATING_LABELS[shown]}</span>
		</div>
	);
}

export function TutorReviews({
	tutorDocumentId,
	tutorName,
}: Readonly<{ tutorDocumentId: string; tutorName: string }>) {
	const jwt = useJWT();
	const isAuthenticated = useIsAuthenticated();
	const router = useRouter();
	const [reviews, setReviews] = useState<TutorReview[]>([]);
	const [summary, setSummary] = useState<TutorRatingSummary>(EMPTY_RATING);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [hasReview, setHasReview] = useState(false);
	const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

	const loadReviews = useCallback(async () => {
		try {
			const response = await getTutorReviews(tutorDocumentId);
			setReviews(response.data);
			setSummary(response.meta);
		} catch (error) {
			console.error("Could not load reviews", error);
		}
	}, [tutorDocumentId]);

	useEffect(() => {
		void loadReviews();
	}, [loadReviews]);

	useEffect(() => {
		if (!jwt) return;
		getMyTutorReview(tutorDocumentId, jwt)
			.then((mine) => {
				setHasReview(Boolean(mine));
				if (mine) {
					setRating(mine.rating);
					setComment(mine.comment);
				}
			})
			.catch((error) => console.error("Could not load your review", error));
	}, [jwt, tutorDocumentId]);

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!jwt || !rating) return;
		setStatus("saving");
		try {
			await saveTutorReview(tutorDocumentId, { rating, comment }, jwt);
			setHasReview(true);
			setStatus("saved");
			await loadReviews();
			router.refresh(); // re-render the server-side rating in the profile header
		} catch {
			setStatus("error");
		}
	};

	const remove = async () => {
		if (!jwt) return;
		setStatus("saving");
		try {
			await deleteTutorReview(tutorDocumentId, jwt);
			setHasReview(false);
			setRating(0);
			setComment("");
			setStatus("idle");
			await loadReviews();
			router.refresh(); // re-render the server-side rating in the profile header
		} catch {
			setStatus("error");
		}
	};

	return (
		<section
			aria-labelledby="reviews-title"
			className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
		>
			<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h2 id="reviews-title" className="text-foreground text-xl font-bold">
						Öğrenci Değerlendirmeleri
					</h2>
					{summary.count > 0 ? (
						<div className="mt-2 flex flex-wrap items-center gap-2">
							<span className="text-foreground text-2xl font-bold">
								{summary.average.toLocaleString("tr-TR")}
							</span>
							<RatingStars value={summary.average} starClassName="h-5 w-5" />
							<span className="text-muted-foreground text-sm">({summary.count} değerlendirme)</span>
						</div>
					) : (
						<p className="text-muted-foreground mt-1 text-sm">Henüz değerlendirme yok.</p>
					)}
				</div>
				{summary.satisfaction !== null && (
					<div className="bg-primary/10 rounded-xl px-4 py-2 text-center">
						<div className="text-primary text-xl font-bold">%{summary.satisfaction}</div>
						<div className="text-muted-foreground text-xs">Memnuniyet</div>
					</div>
				)}
			</div>

			{/* Form */}
			{isAuthenticated && jwt ? (
				<form onSubmit={submit} className="bg-secondary/50 mb-8 rounded-xl border p-4">
					<h3 className="text-foreground mb-3 font-semibold">
						{hasReview
							? "Değerlendirmenizi güncelleyin"
							: `${tutorName} hakkında ne düşünüyorsunuz?`}
					</h3>
					<StarInput
						value={rating}
						onChange={(value) => {
							setRating(value);
							setStatus("idle");
						}}
					/>
					<label htmlFor="review-comment" className="sr-only">
						Yorumunuz
					</label>
					<textarea
						id="review-comment"
						value={comment}
						onChange={(e) => {
							setComment(e.target.value);
							setStatus("idle");
						}}
						maxLength={1000}
						rows={3}
						placeholder="Deneyiminizi diğer öğrenci ve velilerle paylaşın (isteğe bağlı)"
						className="border-border focus:ring-primary mt-3 w-full rounded-lg border bg-white p-3 text-sm focus:ring-2 focus:outline-none"
					/>
					<div className="mt-3 flex flex-wrap items-center gap-3">
						<Button type="submit" disabled={!rating || status === "saving"}>
							{status === "saving" ? "Kaydediliyor..." : hasReview ? "Güncelle" : "Gönder"}
						</Button>
						{hasReview && (
							<Button type="button" variant="ghost" onClick={remove} disabled={status === "saving"}>
								Değerlendirmemi sil
							</Button>
						)}
						{status === "saved" && (
							<span role="status" className="text-sm text-green-700">
								Teşekkürler, değerlendirmeniz kaydedildi.
							</span>
						)}
						{status === "error" && (
							<span role="alert" className="text-destructive text-sm">
								Bir sorun oluştu, lütfen tekrar deneyin.
							</span>
						)}
					</div>
				</form>
			) : (
				<div className="bg-secondary/50 mb-8 rounded-xl border p-4 text-sm">
					Değerlendirme yapmak için{" "}
					<Link href="/giris" className="text-primary font-medium underline">
						giriş yapın
					</Link>{" "}
					veya{" "}
					<Link href="/kayit-ol" className="text-primary font-medium underline">
						üye olun
					</Link>
					.
				</div>
			)}

			{/* List */}
			{reviews.length > 0 && (
				<ul className="divide-y">
					{reviews.map((review) => (
						<li key={`${review.author}-${review.updatedAt}`} className="py-4">
							<div className="mb-1 flex flex-wrap items-center gap-2">
								<RatingStars value={review.rating} />
								<span className="text-foreground text-sm font-medium">{review.author}</span>
								<span className="text-muted-foreground text-xs">
									{new Date(review.updatedAt).toLocaleDateString("tr-TR")}
								</span>
							</div>
							{review.comment && (
								<p className="text-muted-foreground text-sm whitespace-pre-line">
									{review.comment}
								</p>
							)}
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
