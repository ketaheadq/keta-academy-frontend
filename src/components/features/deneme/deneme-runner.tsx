"use client";

import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	FileQuestion,
	FileText,
	Users,
} from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import RichTextRenderer from "@/components/shared/content/rich-text-renderer";
import { Button } from "@/components/ui/button";
import {
	DenemeApiError,
	type DenemeDetail,
	type Media,
	requestReport,
	type SonucOzeti,
	submitDeneme,
	type Yakinlik,
} from "@/lib/deneme";
import { getSessionId, getTrafficSource, trackDeneme } from "@/lib/deneme-tracking";
import { DURATION, EASE_OUT, slideQuestion } from "@/lib/motion";
import { saveReport } from "@/lib/saved-reports";
import { cn } from "@/lib/utils";
import { useJWT } from "@/stores/auth-store";
import { RaporHazir } from "./rapor-hazir";
import { SavedReportNotice } from "./saved-reports";

type Stage = "intro" | "running" | "result";
type Saved = { startedAt: number; answers: Record<number, string | null>; current: number };

const storageKey = (slug: string) => `keta-deneme:${slug}`;

/** Strapi local uploads are relative ("/uploads/…"); Cloudinary URLs are absolute. */
function mediaUrl(media: Media) {
	if (!media?.url) return null;
	return media.url.startsWith("/")
		? `${process.env.NEXT_PUBLIC_STRAPI_URL ?? ""}${media.url}`
		: media.url;
}

function MediaImage({ media, className }: Readonly<{ media: Media; className?: string }>) {
	const src = mediaUrl(media);
	if (!src || !media) return null;
	return (
		<Image
			src={src}
			alt={media.alt}
			width={media.width ?? 800}
			height={media.height ?? 450}
			className={cn("h-auto max-w-full rounded-lg", className)}
			unoptimized
		/>
	);
}

const formatTime = (seconds: number) =>
	`${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function DenemeRunner({ deneme }: Readonly<{ deneme: DenemeDetail }>) {
	const [stage, setStage] = useState<Stage>("intro");
	const [saved, setSaved] = useState<Saved | null>(null);
	/** +1 forwards, -1 backwards — so the card slides the way the student is moving. */
	const [dir, setDir] = useState(1);
	const [now, setNow] = useState(() => Date.now());
	const [result, setResult] = useState<SonucOzeti | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const submittedRef = useRef(false);
	// Signed-in members get the result saved to their account.
	const jwt = useJWT();
	const total = deneme.sorular.length;
	const limitSeconds = deneme.sureDakika * 60;

	useEffect(() => {
		trackDeneme("deneme_sayfasi_goruntuleme", deneme.baslik);
		getTrafficSource(); // remember where the visitor came from
		// Resume an exam in progress after a refresh.
		const stored = sessionStorage.getItem(storageKey(deneme.slug));
		if (stored) {
			try {
				setSaved(JSON.parse(stored));
				setStage("running");
			} catch {
				sessionStorage.removeItem(storageKey(deneme.slug));
			}
		}
	}, [deneme.slug, deneme.baslik]);

	useEffect(() => {
		if (saved) sessionStorage.setItem(storageKey(deneme.slug), JSON.stringify(saved));
	}, [saved, deneme.slug]);

	const remaining = saved
		? Math.max(0, limitSeconds - Math.floor((now - saved.startedAt) / 1000))
		: limitSeconds;

	const finish = useCallback(async () => {
		if (!saved || submittedRef.current) return;
		submittedRef.current = true;
		setSubmitting(true);
		setSubmitError(null);
		const source = getTrafficSource();
		try {
			const response = await submitDeneme(
				deneme.slug,
				{
					cevaplar: saved.answers,
					oturumId: getSessionId(),
					sureSaniye: Math.min(limitSeconds, Math.floor((Date.now() - saved.startedAt) / 1000)),
					kaynak: source.kaynak,
					utm: source.utm,
				},
				jwt,
			);
			trackDeneme("deneme_bitir", deneme.baslik, { net: response.net });
			sessionStorage.removeItem(storageKey(deneme.slug));
			setResult(response);
			setStage("result");
			// JS `behavior` overrides the CSS reduced-motion guard, so it is decided here.
			const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
		} catch (error) {
			submittedRef.current = false;
			setSubmitError(
				error instanceof DenemeApiError ? error.message : "Bağlantı sorunu, lütfen tekrar deneyin.",
			);
		} finally {
			setSubmitting(false);
		}
	}, [saved, deneme.slug, deneme.baslik, limitSeconds, jwt]);

	useEffect(() => {
		if (stage !== "running") return;
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, [stage]);

	useEffect(() => {
		if (stage === "running" && saved && remaining === 0) void finish();
	}, [stage, saved, remaining, finish]);

	const start = () => {
		trackDeneme("deneme_baslat", deneme.baslik);
		setSaved({ startedAt: Date.now(), answers: {}, current: 0 });
		setNow(Date.now());
		setStage("running");
	};

	if (stage === "intro") return <Intro deneme={deneme} onStart={start} />;
	if (stage === "result" && result) return <Result deneme={deneme} result={result} />;
	if (!saved) return null;

	const question = deneme.sorular[saved.current];
	const answered = Object.values(saved.answers).filter(Boolean).length;
	const choose = (letter: string) =>
		setSaved({
			...saved,
			answers: {
				...saved.answers,
				[saved.current]: saved.answers[saved.current] === letter ? null : letter,
			},
		});
	const go = (index: number) => {
		const next = Math.min(total - 1, Math.max(0, index));
		setDir(next >= saved.current ? 1 : -1);
		setSaved({ ...saved, current: next });
	};

	return (
		<m.div
			className="space-y-4"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: DURATION.slow, ease: EASE_OUT }}
		>
			{/* Sticky timer bar */}
			<div className="sticky top-0 z-30 -mx-4 flex items-center justify-between gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
				<div className="text-sm">
					<span className="text-foreground font-semibold">
						Soru {saved.current + 1}/{total}
					</span>
					<span className="text-muted-foreground ml-2">{answered} cevaplandı</span>
				</div>
				<div
					role="timer"
					aria-label="Kalan süre"
					className={cn(
						"flex items-center gap-1 rounded-full px-3 py-1 font-mono text-sm font-semibold transition-colors duration-300",
						remaining <= 60
							? "bg-destructive/10 text-destructive animate-pulse"
							: "bg-primary/10 text-primary",
					)}
				>
					<Clock className="h-4 w-4" aria-hidden="true" />
					{formatTime(remaining)}
				</div>
			</div>

			<AnimatePresence mode="wait" initial={false}>
				<m.section
					key={saved.current}
					aria-labelledby="soru-baslik"
					variants={slideQuestion(dir)}
					initial="initial"
					animate="animate"
					exit="exit"
					className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
				>
					<h2 id="soru-baslik" className="text-muted-foreground mb-3 text-sm font-semibold">
						{question.no}. soru
					</h2>
					<div className="text-foreground text-lg">
						<RichTextRenderer content={question.metin} />
					</div>
					<MediaImage media={question.gorsel} className="mt-3" />

					<fieldset className="mt-5 space-y-2">
						<legend className="sr-only">Cevabınız</legend>
						{question.secenekler.map((secenek) => {
							const selected = saved.answers[saved.current] === secenek.harf;
							return (
								<button
									key={secenek.harf}
									type="button"
									aria-pressed={selected}
									onClick={() => choose(secenek.harf)}
									className={cn(
										"flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors",
										selected ? "border-primary bg-primary/10" : "border-border hover:bg-secondary",
									)}
								>
									<span
										className={cn(
											"flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
											selected
												? "bg-primary text-primary-foreground"
												: "bg-secondary text-foreground",
										)}
									>
										{secenek.harf}
									</span>
									<span className="min-w-0 pt-0.5">
										{secenek.metin}
										<MediaImage
											media={secenek.gorsel}
											className={cn(
												"max-h-28 w-auto max-w-[min(100%,14rem)] object-contain sm:max-h-32",
												secenek.metin && "mt-2",
											)}
										/>
									</span>
								</button>
							);
						})}
					</fieldset>
					<p className="text-muted-foreground mt-2 text-xs">
						Seçili şıkka tekrar dokunursan soru boş kalır.
					</p>

					<div className="mt-6 flex items-center justify-between gap-2">
						<Button
							variant="outline"
							onClick={() => go(saved.current - 1)}
							disabled={saved.current === 0}
							className="transition-transform active:scale-[0.97]"
						>
							<ChevronLeft className="h-4 w-4" /> Önceki
						</Button>
						{saved.current < total - 1 ? (
							<Button
								onClick={() => go(saved.current + 1)}
								className="transition-transform active:scale-[0.97]"
							>
								Sonraki <ChevronRight className="h-4 w-4" />
							</Button>
						) : (
							<Button
								onClick={finish}
								disabled={submitting}
								className="transition-transform active:scale-[0.97]"
							>
								{submitting ? "Gönderiliyor..." : "Sınavı bitir"}
							</Button>
						)}
					</div>
				</m.section>
			</AnimatePresence>

			{/* Question navigator */}
			<nav aria-label="Sorular" className="rounded-2xl border bg-white p-4 shadow-sm">
				<div className="flex flex-wrap gap-2">
					{deneme.sorular.map((soru, index) => (
						<button
							key={soru.no}
							type="button"
							onClick={() => go(index)}
							aria-current={index === saved.current ? "step" : undefined}
							aria-label={`${soru.no}. soru${saved.answers[index] ? ", cevaplandı" : ""}`}
							className={cn(
								"h-9 w-9 rounded-lg border text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0",
								index === saved.current && "ring-primary scale-105 ring-2",
								saved.answers[index]
									? "border-primary bg-primary text-primary-foreground"
									: "bg-white",
							)}
						>
							{soru.no}
						</button>
					))}
				</div>
				<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
					<p className="text-muted-foreground text-sm">
						{total - answered > 0 ? `${total - answered} soru boş.` : "Bütün sorular cevaplandı."}
					</p>
					<Button variant="secondary" onClick={finish} disabled={submitting}>
						{submitting ? "Gönderiliyor..." : "Sınavı bitir"}
					</Button>
				</div>
				{submitError && (
					<m.p
						role="alert"
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-destructive mt-3 text-sm"
					>
						{submitError}
					</m.p>
				)}
			</nav>
		</m.div>
	);
}

function Intro({ deneme, onStart }: Readonly<{ deneme: DenemeDetail; onStart: () => void }>) {
	return (
		<>
			<SavedReportNotice denemeSlug={deneme.slug} />
			<m.div
				className="grid gap-6 lg:grid-cols-3"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: DURATION.slow, ease: EASE_OUT }}
			>
				<section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
					<m.div
						className="grid grid-cols-2 gap-3 sm:grid-cols-3"
						initial="hidden"
						animate="shown"
						variants={{ shown: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
					>
						<Stat icon={FileQuestion} value={`${deneme.soruSayisi}`} label="soru" />
						<Stat icon={Clock} value={`${deneme.sureDakika} dk`} label="süre" />
						{deneme.cozenSayisi !== null && (
							<Stat
								icon={Users}
								value={deneme.cozenSayisi.toLocaleString("tr-TR")}
								label="öğrenci çözdü"
							/>
						)}
					</m.div>
					{deneme.konular.length > 0 && (
						<div className="mt-5">
							<h2 className="text-foreground mb-2 font-semibold">Kapsadığı konular</h2>
							<ul className="flex flex-wrap gap-2">
								{deneme.konular.map((k) => (
									<li
										key={k.slug}
										className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
									>
										{k.ad}
									</li>
								))}
							</ul>
						</div>
					)}
					<Button
						size="lg"
						onClick={onStart}
						className="mt-6 w-full transition-transform hover:scale-[1.01] active:scale-[0.98] sm:w-auto"
					>
						Kayıt gerekmez, hemen başla
					</Button>
					<p className="text-muted-foreground mt-2 text-sm">
						Süre başla dediğinde başlar. Bitirince netin hemen görünür.
					</p>
				</section>
				<SampleReport />
			</m.div>
		</>
	);
}

function Stat({
	icon: Icon,
	value,
	label,
}: Readonly<{ icon: typeof Clock; value: string; label: string }>) {
	return (
		<m.div
			variants={{
				hidden: { opacity: 0, y: 10 },
				shown: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
			}}
			className="bg-secondary rounded-xl p-3 text-center"
		>
			<Icon className="text-primary mx-auto mb-1 h-4 w-4" aria-hidden="true" />
			<div className="text-foreground text-lg font-bold">{value}</div>
			<div className="text-muted-foreground text-xs">{label}</div>
		</m.div>
	);
}

const ANALIZ_MADDELERI = [
	"Yanlış ve boş bıraktığın her soru: doğru cevap, çözüm ve hocanın ipucu",
	"Konu konu başarı oranın",
	"Eksik konuların için izlemen gereken dersler",
	"Çağlar Hoca'nın yorumu ve bir haftalık çalışma planı",
];

/** First two pages of the sample PDF report; links to the whole sample. */
function SampleReport({ onOpen }: Readonly<{ onOpen?: () => void }>) {
	return (
		<aside
			aria-labelledby="ornek-rapor-baslik"
			className="rounded-2xl border bg-white p-5 shadow-sm"
		>
			<div className="mb-3 flex items-baseline justify-between gap-2">
				<h2 id="ornek-rapor-baslik" className="text-foreground font-semibold">
					Örnek analiz raporu
				</h2>
				<a
					href="/ornek-deneme-raporu.pdf"
					target="_blank"
					rel="noopener"
					onClick={onOpen}
					className="text-primary flex items-center gap-1 text-sm underline"
				>
					<FileText className="h-4 w-4" aria-hidden="true" />
					Örneğin tamamı (PDF)
				</a>
			</div>
			<a
				href="/ornek-deneme-raporu.pdf"
				target="_blank"
				rel="noopener"
				onClick={onOpen}
				aria-label="Örnek raporu PDF olarak aç"
				className="grid grid-cols-2 gap-3"
			>
				{[1, 2].map((page) => (
					<Image
						key={page}
						src={`/images/ornek-deneme-raporu-${page}.jpg`}
						alt=""
						width={744}
						height={1052}
						className="h-auto w-full rounded-md border shadow-sm transition hover:shadow-md"
					/>
				))}
			</a>
			<p className="text-muted-foreground mt-3 text-xs">
				Örnektir: senin raporun kendi cevaplarınla hazırlanır.
			</p>
		</aside>
	);
}

function Result({ deneme, result }: Readonly<{ deneme: DenemeDetail; result: SonucOzeti }>) {
	const [choice, setChoice] = useState<"ask" | "yes" | "no">("ask");
	const formRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (choice !== "yes") return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
	}, [choice]);

	const answer = (value: "yes" | "no") => {
		setChoice(value);
		trackDeneme("analiz_sorusu", deneme.baslik, { cevap: value === "yes" ? "evet" : "hayir" });
	};

	return (
		<m.div
			className="space-y-6"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: DURATION.slow, ease: EASE_OUT }}
		>
			<section
				aria-labelledby="sonuc-baslik"
				className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
			>
				<h2 id="sonuc-baslik" className="text-foreground text-2xl font-bold">
					Sonucun
				</h2>
				<m.div
					className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
					initial="hidden"
					animate="shown"
					variants={{ shown: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
				>
					<ResultStat label="Net" value={result.net.toLocaleString("tr-TR")} highlight />
					<ResultStat label="Doğru" value={result.dogru} />
					<ResultStat label="Yanlış" value={result.yanlis} />
					<ResultStat label="Boş" value={result.bos} />
				</m.div>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="space-y-6">
					<section
						aria-labelledby="analiz-baslik"
						className="border-primary/30 bg-primary/5 rounded-2xl border p-5 sm:p-6"
					>
						<h2 id="analiz-baslik" className="text-foreground text-xl font-bold">
							Geniş analiz raporunu ister misin?
						</h2>
						<p className="text-muted-foreground mt-1 text-sm">
							Ücretsiz. Sonuçlarını Çağlar Hoca'nın gözünden inceleyip PDF olarak hemen burada
							hazırlıyoruz.
						</p>
						<m.ul
							className="text-foreground mt-3 space-y-1.5 text-sm"
							initial="hidden"
							animate="shown"
							variants={{ shown: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
						>
							{ANALIZ_MADDELERI.map((item) => (
								<m.li
									key={item}
									variants={{
										hidden: { opacity: 0, x: -8 },
										shown: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE_OUT } },
									}}
									className="flex gap-2"
								>
									<CheckCircle2
										className="text-primary mt-0.5 h-4 w-4 shrink-0"
										aria-hidden="true"
									/>
									{item}
								</m.li>
							))}
						</m.ul>
						<AnimatePresence mode="wait" initial={false}>
							{choice === "ask" && (
								<m.div
									key="ask"
									className="mt-5 flex flex-wrap gap-3"
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, transition: { duration: 0.12 } }}
								>
									<Button size="lg" onClick={() => answer("yes")}>
										Evet, raporu istiyorum
									</Button>
									<Button size="lg" variant="outline" onClick={() => answer("no")}>
										Hayır, teşekkürler
									</Button>
								</m.div>
							)}
							{choice === "no" && (
								<m.div
									key="no"
									className="mt-5 flex flex-wrap items-center gap-3 text-sm"
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, transition: { duration: 0.12 } }}
								>
									<Button asChild>
										<Link href="/kurslar">Derslere göz at</Link>
									</Button>
									<Link href="/deneme-sinavlari" className="text-muted-foreground underline">
										Başka bir deneme çöz
									</Link>
									<button
										type="button"
										onClick={() => answer("yes")}
										className="text-primary underline"
									>
										Fikrimi değiştirdim, raporu istiyorum
									</button>
								</m.div>
							)}
						</AnimatePresence>
					</section>
					{choice === "yes" && (
						<m.div
							ref={formRef}
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: DURATION.slow, ease: EASE_OUT }}
							className="scroll-mt-24"
						>
							<ReportRequestForm deneme={deneme} result={result} />
						</m.div>
					)}
				</div>
				<SampleReport onOpen={() => trackDeneme("ornek_rapor_tiklama", deneme.baslik)} />
			</div>
		</m.div>
	);
}

function ResultStat({
	label,
	value,
	highlight,
}: Readonly<{ label: string; value: string | number; highlight?: boolean }>) {
	return (
		<m.div
			variants={{
				hidden: { opacity: 0, y: 12, scale: 0.96 },
				shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE_OUT } },
			}}
			className={cn(
				"rounded-xl p-4 text-center",
				highlight ? "bg-primary text-primary-foreground" : "bg-secondary",
			)}
		>
			<div className="text-3xl font-bold">{value}</div>
			<div
				className={cn(
					"text-sm",
					highlight ? "text-primary-foreground/80" : "text-muted-foreground",
				)}
			>
				{label}
			</div>
		</m.div>
	);
}

const YAKINLIK: { value: Yakinlik; label: string }[] = [
	{ value: "Veli", label: "Veli" },
	{ value: "Ogrenci", label: "Öğrenci" },
	{ value: "Diger", label: "Diğer" },
];

function ReportRequestForm({
	deneme,
	result,
}: Readonly<{ deneme: DenemeDetail; result: SonucOzeti }>) {
	const [adSoyad, setAdSoyad] = useState("");
	const [telefon, setTelefon] = useState("");
	const [yakinlik, setYakinlik] = useState<Yakinlik | "">("");
	const [raporIzni, setRaporIzni] = useState(false);
	const [aramaIzni, setAramaIzni] = useState(false);
	const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
	const [error, setError] = useState<string | null>(null);
	const [raporKey, setRaporKey] = useState<string | null>(null);
	const jwt = useJWT();

	const submit = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!yakinlik) {
			setError("Numaranın kime ait olduğunu seçin.");
			setStatus("error");
			return;
		}
		setStatus("sending");
		setError(null);
		try {
			const response = await requestReport(
				result.sonucAnahtari,
				{
					adSoyad,
					telefon,
					yakinlik,
					raporIzni,
					aramaIzni,
					kaynak: getTrafficSource().kaynak,
				},
				jwt,
			);
			trackDeneme("rapor_talebi", deneme.baslik, { yakinlik, arama_izni: aramaIzni });
			setRaporKey(response.raporAnahtari);
			// Keep the link on this device so the home page can show it again later.
			saveReport({
				raporKey: response.raporAnahtari,
				denemeSlug: deneme.slug,
				denemeBaslik: deneme.baslik,
				net: result.net,
				soruSayisi: result.soruSayisi,
			});
		} catch (e) {
			setError(e instanceof DenemeApiError ? e.message : "Bağlantı sorunu, lütfen tekrar deneyin.");
			setStatus("error");
		}
	};

	if (raporKey) {
		return (
			<m.section
				role="status"
				initial={{ opacity: 0, y: 12, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: DURATION.slow, ease: EASE_OUT }}
				className="rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6"
			>
				<m.div
					initial={{ scale: 0.4, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.1 }}
					className="w-fit origin-left"
				>
					<CheckCircle2 className="mb-2 h-8 w-8 text-green-700" aria-hidden="true" />
				</m.div>
				<h2 className="text-foreground text-xl font-bold">Analiz raporun</h2>
				<RaporHazir raporKey={raporKey} denemeBaslik={deneme.baslik} />
				<p className="mt-4 text-sm">
					<Link href="/kurslar" className="text-muted-foreground underline">
						Derslere göz at
					</Link>
				</p>
			</m.section>
		);
	}

	return (
		<m.section
			aria-labelledby="rapor-form-baslik"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: DURATION.slow, ease: EASE_OUT }}
			className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
		>
			<h2 id="rapor-form-baslik" className="text-foreground text-xl font-bold">
				Raporunu hazırlayalım
			</h2>
			<p className="text-muted-foreground mt-1 text-sm">
				Rapor birkaç saniye içinde burada açılır. Numarayı, Çağlar Hoca sonucu sizinle
				değerlendirebilsin diye istiyoruz. E-posta istemiyoruz.
			</p>
			<form onSubmit={submit} className="mt-4 space-y-4">
				<div>
					<label htmlFor="rapor-ad" className="mb-1 block text-sm font-medium">
						Numara sahibinin adı soyadı
					</label>
					<input
						id="rapor-ad"
						required
						autoComplete="name"
						value={adSoyad}
						onChange={(e) => setAdSoyad(e.target.value)}
						className="border-border focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
					/>
				</div>
				<div>
					<label htmlFor="rapor-telefon" className="mb-1 block text-sm font-medium">
						Cep telefonu
					</label>
					<input
						id="rapor-telefon"
						required
						type="tel"
						inputMode="tel"
						autoComplete="tel"
						placeholder="05xx xxx xx xx"
						value={telefon}
						onChange={(e) => setTelefon(e.target.value)}
						className="border-border focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
					/>
				</div>
				<fieldset>
					<legend className="mb-1 text-sm font-medium">Numara kime ait?</legend>
					<div className="flex flex-wrap gap-2">
						{YAKINLIK.map((option) => (
							<label
								key={option.value}
								className={cn(
									"cursor-pointer rounded-full border px-4 py-1.5 text-sm",
									yakinlik === option.value
										? "border-primary bg-primary text-primary-foreground"
										: "bg-white",
								)}
							>
								<input
									type="radio"
									name="yakinlik"
									value={option.value}
									checked={yakinlik === option.value}
									onChange={() => setYakinlik(option.value)}
									className="sr-only"
								/>
								{option.label}
							</label>
						))}
					</div>
				</fieldset>
				<label className="flex items-start gap-2 text-sm">
					<input
						type="checkbox"
						required
						checked={raporIzni}
						onChange={(e) => setRaporIzni(e.target.checked)}
						className="mt-1"
					/>
					<span>
						Bilgilerimin rapor ve değerlendirme için işlenmesine ilişkin{" "}
						<Link href="/gizlilik-politikasi" target="_blank" className="text-primary underline">
							KVKK aydınlatma metnini
						</Link>{" "}
						okudum, onaylıyorum.
					</span>
				</label>
				<label className="flex items-start gap-2 text-sm">
					<input
						type="checkbox"
						checked={aramaIzni}
						onChange={(e) => setAramaIzni(e.target.checked)}
						className="mt-1"
					/>
					<span>
						Rapor hakkında bilgi verilmesi ve kampanyalar için bu numaradan aranmak ve mesaj almak
						istiyorum.
					</span>
				</label>
				{status === "error" && error && (
					<m.p
						role="alert"
						// A short lateral nudge reads as "this was rejected" faster than a fade alone.
						initial={{ opacity: 0, x: 0 }}
						animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
						transition={{ duration: 0.34, ease: "easeOut" }}
						className="text-destructive text-sm"
					>
						{error}
					</m.p>
				)}
				<Button
					type="submit"
					className="w-full transition-transform active:scale-[0.99]"
					disabled={status === "sending"}
				>
					{status === "sending" ? "Hazırlanıyor..." : "Raporumu hazırla"}
				</Button>
			</form>
		</m.section>
	);
}
