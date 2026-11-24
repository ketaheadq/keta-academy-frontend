"use client";

import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	FileQuestion,
	Lock,
	Users,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

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
	const [now, setNow] = useState(() => Date.now());
	const [result, setResult] = useState<SonucOzeti | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const submittedRef = useRef(false);
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
			const response = await submitDeneme(deneme.slug, {
				cevaplar: saved.answers,
				oturumId: getSessionId(),
				sureSaniye: Math.min(limitSeconds, Math.floor((Date.now() - saved.startedAt) / 1000)),
				kaynak: source.kaynak,
				utm: source.utm,
			});
			trackDeneme("deneme_bitir", deneme.baslik, { net: response.net });
			sessionStorage.removeItem(storageKey(deneme.slug));
			setResult(response);
			setStage("result");
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error) {
			submittedRef.current = false;
			setSubmitError(
				error instanceof DenemeApiError ? error.message : "Bağlantı sorunu, lütfen tekrar deneyin.",
			);
		} finally {
			setSubmitting(false);
		}
	}, [saved, deneme.slug, deneme.baslik, limitSeconds]);

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
	const go = (index: number) =>
		setSaved({ ...saved, current: Math.min(total - 1, Math.max(0, index)) });

	return (
		<div className="space-y-4">
			{/* Sticky timer bar */}
			<div className="sticky top-0 z-30 -mx-4 flex items-center justify-between gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
				<div className="text-sm">
					<span className="font-semibold text-foreground">
						Soru {saved.current + 1}/{total}
					</span>
					<span className="ml-2 text-muted-foreground">{answered} cevaplandı</span>
				</div>
				<div
					role="timer"
					aria-label="Kalan süre"
					className={cn(
						"flex items-center gap-1 rounded-full px-3 py-1 font-mono font-semibold text-sm",
						remaining <= 60 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary",
					)}
				>
					<Clock className="h-4 w-4" aria-hidden="true" />
					{formatTime(remaining)}
				</div>
			</div>

			<section
				aria-labelledby="soru-baslik"
				className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
			>
				<h2 id="soru-baslik" className="mb-3 font-semibold text-muted-foreground text-sm">
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
										"flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold text-sm",
										selected
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground",
									)}
								>
									{secenek.harf}
								</span>
								<span className="min-w-0 pt-0.5">
									{secenek.metin}
									<MediaImage media={secenek.gorsel} className="mt-2" />
								</span>
							</button>
						);
					})}
				</fieldset>
				<p className="mt-2 text-muted-foreground text-xs">
					Seçili şıkka tekrar dokunursan soru boş kalır.
				</p>

				<div className="mt-6 flex items-center justify-between gap-2">
					<Button
						variant="outline"
						onClick={() => go(saved.current - 1)}
						disabled={saved.current === 0}
					>
						<ChevronLeft className="h-4 w-4" /> Önceki
					</Button>
					{saved.current < total - 1 ? (
						<Button onClick={() => go(saved.current + 1)}>
							Sonraki <ChevronRight className="h-4 w-4" />
						</Button>
					) : (
						<Button onClick={finish} disabled={submitting}>
							{submitting ? "Gönderiliyor..." : "Sınavı bitir"}
						</Button>
					)}
				</div>
			</section>

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
								"h-9 w-9 rounded-lg border font-medium text-sm",
								index === saved.current && "ring-2 ring-primary",
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
					<p role="alert" className="mt-3 text-destructive text-sm">
						{submitError}
					</p>
				)}
			</nav>
		</div>
	);
}

function Intro({ deneme, onStart }: Readonly<{ deneme: DenemeDetail; onStart: () => void }>) {
	return (
		<div className="grid gap-6 lg:grid-cols-3">
			<section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					<Stat icon={FileQuestion} value={`${deneme.soruSayisi}`} label="soru" />
					<Stat icon={Clock} value={`${deneme.sureDakika} dk`} label="süre" />
					{deneme.cozenSayisi !== null && (
						<Stat
							icon={Users}
							value={deneme.cozenSayisi.toLocaleString("tr-TR")}
							label="öğrenci çözdü"
						/>
					)}
				</div>
				{deneme.konular.length > 0 && (
					<div className="mt-5">
						<h2 className="mb-2 font-semibold text-foreground">Kapsadığı konular</h2>
						<ul className="flex flex-wrap gap-2">
							{deneme.konular.map((k) => (
								<li
									key={k.slug}
									className="rounded-full bg-primary/10 px-3 py-1 text-primary text-sm"
								>
									{k.ad}
								</li>
							))}
						</ul>
					</div>
				)}
				<Button size="lg" className="mt-6 w-full sm:w-auto" onClick={onStart}>
					Kayıt gerekmez, hemen başla
				</Button>
				<p className="mt-2 text-muted-foreground text-sm">
					Süre başla dediğinde başlar. Bitirince netin hemen görünür.
				</p>
			</section>
			<ReportPreview konular={deneme.konular.map((k) => k.ad)} />
		</div>
	);
}

function Stat({
	icon: Icon,
	value,
	label,
}: Readonly<{ icon: typeof Clock; value: string; label: string }>) {
	return (
		<div className="rounded-xl bg-secondary p-3 text-center">
			<Icon className="mx-auto mb-1 h-4 w-4 text-primary" aria-hidden="true" />
			<div className="font-bold text-foreground text-lg">{value}</div>
			<div className="text-muted-foreground text-xs">{label}</div>
		</div>
	);
}

/** Blurred preview of the topic report that unlocks with a phone number. */
function ReportPreview({ konular }: Readonly<{ konular: string[] }>) {
	const rows = konular.length ? konular : ["Konu 1", "Konu 2", "Konu 3"];
	const widths = [72, 38, 55, 84, 46];
	return (
		<aside
			aria-label="Detaylı rapor önizlemesi"
			className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm"
		>
			<h2 className="mb-3 font-semibold text-foreground">Detaylı konu raporu</h2>
			<div aria-hidden="true" className="select-none space-y-3 blur-[3px]">
				{rows.map((name, i) => (
					<div key={name}>
						<div className="mb-1 flex justify-between text-sm">
							<span>{name}</span>
							<span>%{widths[i % widths.length]}</span>
						</div>
						<div className="h-2 rounded-full bg-secondary">
							<div
								className="h-2 rounded-full bg-primary"
								style={{ width: `${widths[i % widths.length]}%` }}
							/>
						</div>
					</div>
				))}
				<p className="text-sm">Önerilen dersler ve hocanın yorumu</p>
			</div>
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/40 p-4 text-center">
				<Lock className="h-6 w-6 text-primary" aria-hidden="true" />
				<p className="font-medium text-foreground text-sm">
					Sınav bitince konu konu raporun hazırlanır.
				</p>
			</div>
		</aside>
	);
}

function Result({ deneme, result }: Readonly<{ deneme: DenemeDetail; result: SonucOzeti }>) {
	return (
		<div className="space-y-6">
			<section
				aria-labelledby="sonuc-baslik"
				className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
			>
				<h2 id="sonuc-baslik" className="font-bold text-2xl text-foreground">
					Sonucun
				</h2>
				<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
					<ResultStat label="Net" value={result.net.toLocaleString("tr-TR")} highlight />
					<ResultStat label="Doğru" value={result.dogru} />
					<ResultStat label="Yanlış" value={result.yanlis} />
					<ResultStat label="Boş" value={result.bos} />
				</div>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<ReportPreview konular={result.konular} />
				<ReportRequestForm deneme={deneme} result={result} />
			</div>
		</div>
	);
}

function ResultStat({
	label,
	value,
	highlight,
}: Readonly<{ label: string; value: string | number; highlight?: boolean }>) {
	return (
		<div
			className={cn(
				"rounded-xl p-4 text-center",
				highlight ? "bg-primary text-primary-foreground" : "bg-secondary",
			)}
		>
			<div className="font-bold text-3xl">{value}</div>
			<div
				className={cn(
					"text-sm",
					highlight ? "text-primary-foreground/80" : "text-muted-foreground",
				)}
			>
				{label}
			</div>
		</div>
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
	const [sentTo, setSentTo] = useState<string | null>(null);

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!yakinlik) {
			setError("Numaranın kime ait olduğunu seçin.");
			setStatus("error");
			return;
		}
		setStatus("sending");
		setError(null);
		try {
			const response = await requestReport(result.sonucAnahtari, {
				adSoyad,
				telefon,
				yakinlik,
				raporIzni,
				aramaIzni,
				kaynak: getTrafficSource().kaynak,
			});
			trackDeneme("rapor_talebi", deneme.baslik, { yakinlik, arama_izni: aramaIzni });
			setSentTo(response.telefon);
		} catch (e) {
			setError(e instanceof DenemeApiError ? e.message : "Bağlantı sorunu, lütfen tekrar deneyin.");
			setStatus("error");
		}
	};

	if (sentTo) {
		return (
			<section role="status" className="rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6">
				<CheckCircle2 className="mb-2 h-8 w-8 text-green-700" aria-hidden="true" />
				<h2 className="font-bold text-foreground text-xl">Raporun hazırlanıyor</h2>
				<p className="mt-2 text-foreground">
					Detaylı rapor <strong>{sentTo}</strong> numarasına SMS ile gönderilecek.
				</p>
				<Button asChild variant="outline" className="mt-4">
					<Link href="/kurslar">Bu arada derslere göz at</Link>
				</Button>
			</section>
		);
	}

	return (
		<section
			aria-labelledby="rapor-form-baslik"
			className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
		>
			<h2 id="rapor-form-baslik" className="font-bold text-foreground text-xl">
				Detaylı raporu telefonuna gönderelim
			</h2>
			<p className="mt-1 text-muted-foreground text-sm">
				Hangi konularda eksik olduğun, hangi dersleri izlemen gerektiği ve hocanın yorumu. E-posta
				istemiyoruz.
			</p>
			<form onSubmit={submit} className="mt-4 space-y-4">
				<div>
					<label htmlFor="rapor-ad" className="mb-1 block font-medium text-sm">
						Numara sahibinin adı soyadı
					</label>
					<input
						id="rapor-ad"
						required
						autoComplete="name"
						value={adSoyad}
						onChange={(e) => setAdSoyad(e.target.value)}
						className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				<div>
					<label htmlFor="rapor-telefon" className="mb-1 block font-medium text-sm">
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
						className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				<fieldset>
					<legend className="mb-1 font-medium text-sm">Numara kime ait?</legend>
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
						Raporun bu numaraya gönderilmesi için{" "}
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
					<p role="alert" className="text-destructive text-sm">
						{error}
					</p>
				)}
				<Button type="submit" className="w-full" disabled={status === "sending"}>
					{status === "sending" ? "Gönderiliyor..." : "Raporu gönder"}
				</Button>
				<p className="text-center text-sm">
					<Link href="/kurslar" className="text-muted-foreground underline">
						Şimdilik istemiyorum, derslere dön
					</Link>
				</p>
			</form>
		</section>
	);
}
