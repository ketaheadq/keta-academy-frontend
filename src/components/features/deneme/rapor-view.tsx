"use client";

import { CheckCircle2, PlayCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { addParentNumber, DenemeApiError, getRapor, type Rapor } from "@/lib/deneme";
import { getTrafficSource, trackDeneme } from "@/lib/deneme-tracking";
import { cn } from "@/lib/utils";

type State =
	| { kind: "loading" }
	| { kind: "missing" }
	| { kind: "pending" }
	| { kind: "error" }
	| { kind: "ready"; rapor: Rapor };

/** Renders the teacher's note: plain text with [title](url) links to the suggested lessons. */
function NoteText({
	text,
	onLinkClick,
}: Readonly<{ text: string; onLinkClick: (url: string) => void }>) {
	return (
		<>
			{text.split(/\n{2,}/).map((paragraph) => (
				<p key={paragraph.slice(0, 40)} className="mb-3 last:mb-0">
					{paragraph.split(/(\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g).map((part, i) => {
						const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
						return link ? (
							<a
								// biome-ignore lint/suspicious/noArrayIndexKey: static split of one paragraph
								key={i}
								href={link[2]}
								onClick={() => onLinkClick(link[2])}
								className="font-medium text-primary underline"
							>
								{link[1]}
							</a>
						) : (
							// biome-ignore lint/suspicious/noArrayIndexKey: static split of one paragraph
							<Fragment key={i}>{part}</Fragment>
						);
					})}
				</p>
			))}
		</>
	);
}

export function RaporView({
	raporKey,
	onizleme,
}: Readonly<{ raporKey: string; onizleme: boolean }>) {
	const [state, setState] = useState<State>({ kind: "loading" });

	useEffect(() => {
		getRapor(raporKey, onizleme)
			.then((data) => {
				if (!data) setState({ kind: "missing" });
				else if (!data.hazir) setState({ kind: "pending" });
				else {
					setState({ kind: "ready", rapor: data });
					if (!onizleme) trackDeneme("rapor_acildi", data.deneme.baslik);
				}
			})
			.catch(() => setState({ kind: "error" }));
	}, [raporKey, onizleme]);

	if (state.kind === "loading")
		return <p className="py-16 text-center text-muted-foreground">Rapor yükleniyor…</p>;
	if (state.kind === "missing")
		return (
			<Message
				title="Rapor bulunamadı"
				text="Linki SMS'teki haliyle açtığınızdan emin olun. Raporlar bir süre sonra silinir."
			/>
		);
	if (state.kind === "pending")
		return (
			<Message title="Raporunuz hazırlanıyor" text="Birkaç dakika sonra bu linki tekrar açın." />
		);
	if (state.kind === "error")
		return (
			<Message title="Rapor yüklenemedi" text="Bağlantınızı kontrol edip sayfayı yenileyin." />
		);

	const { rapor } = state;
	const trackVideo = (url: string) =>
		trackDeneme("rapor_video_tiklama", rapor.deneme.baslik, { url });
	const whatsappText = `Merhaba Çağlar Hoca, ${rapor.deneme.baslik} raporunu sizinle değerlendirmek istiyorum.`;
	const whatsappHref = rapor.whatsappNumarasi
		? `https://wa.me/${rapor.whatsappNumarasi.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappText)}`
		: null;
	const sorted = [...rapor.konular].sort((a, b) => a.oran - b.oran);

	return (
		<div className="space-y-6">
			<header>
				<p className="font-medium text-primary text-sm">{rapor.deneme.baslik}</p>
				<h1 className="mt-1 font-bold text-2xl text-foreground sm:text-3xl">
					Merhaba {rapor.ad}, deneme raporunuz
				</h1>
			</header>

			<section aria-label="Sonuç" className="rounded-2xl border bg-white p-5 shadow-sm">
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					<Stat label="Net" value={rapor.net.toLocaleString("tr-TR")} highlight />
					<Stat label="Doğru" value={rapor.dogru} />
					<Stat label="Yanlış" value={rapor.yanlis} />
					<Stat label="Boş" value={rapor.bos} />
				</div>
				{rapor.siralama && (
					<p className="mt-4 flex items-center gap-2 text-foreground">
						<Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
						Bu denemeyi çözen {rapor.siralama.katilimci.toLocaleString("tr-TR")} öğrencinin %
						{rapor.siralama.yuzde}'inden daha yüksek net.
					</p>
				)}
			</section>

			<section aria-labelledby="konu-baslik" className="rounded-2xl border bg-white p-5 shadow-sm">
				<h2 id="konu-baslik" className="mb-4 font-bold text-foreground text-xl">
					Konu bazında başarı
				</h2>
				<ul className="space-y-3">
					{sorted.map((konu) => (
						<li key={konu.slug}>
							<div className="mb-1 flex justify-between gap-2 text-sm">
								<span className="text-foreground">{konu.ad}</span>
								<span className="shrink-0 text-muted-foreground">
									{konu.dogru}/{konu.toplam} ·{" "}
									<strong className="text-foreground">%{konu.oran}</strong>
								</span>
							</div>
							<div className="h-2 rounded-full bg-secondary" aria-hidden="true">
								<div
									className={cn(
										"h-2 rounded-full",
										konu.oran >= 75
											? "bg-green-600"
											: konu.oran >= 50
												? "bg-amber-500"
												: "bg-red-500",
									)}
									style={{ width: `${Math.max(konu.oran, 3)}%` }}
								/>
							</div>
						</li>
					))}
				</ul>
			</section>

			{rapor.zayifKonular.length > 0 && (
				<section
					aria-labelledby="zayif-baslik"
					className="rounded-2xl border bg-white p-5 shadow-sm"
				>
					<h2 id="zayif-baslik" className="mb-4 font-bold text-foreground text-xl">
						Önce bu konulara çalışın
					</h2>
					<ul className="space-y-4">
						{rapor.zayifKonular.map((konu) => (
							<li key={konu.slug}>
								<p className="font-semibold text-foreground">
									{konu.ad}{" "}
									<span className="font-normal text-muted-foreground">· %{konu.oran}</span>
								</p>
								{konu.videolar.length ? (
									<ul className="mt-2 space-y-2">
										{konu.videolar.map((video) => (
											<li key={video.url}>
												<a
													href={video.url}
													onClick={() => trackVideo(video.url)}
													className="flex items-center gap-2 text-primary underline"
												>
													<PlayCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
													Şu dersi izle: {video.baslik}
												</a>
											</li>
										))}
									</ul>
								) : (
									<p className="mt-1 text-muted-foreground text-sm">
										Bu konunun dersleri yakında eklenecek.
									</p>
								)}
							</li>
						))}
					</ul>
				</section>
			)}

			{rapor.hocaYorumu && (
				<section
					aria-labelledby="yorum-baslik"
					className="rounded-2xl border bg-white p-5 shadow-sm"
				>
					<h2 id="yorum-baslik" className="mb-3 font-bold text-foreground text-xl">
						Çağlar Hoca'nın notu
					</h2>
					<div className="text-foreground leading-relaxed">
						<NoteText text={rapor.hocaYorumu} onLinkClick={trackVideo} />
					</div>
				</section>
			)}

			{rapor.veliNumarasiIstenir ? (
				<ParentForm raporKey={raporKey} denemeBaslik={rapor.deneme.baslik} />
			) : (
				<section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
					<h2 className="font-bold text-foreground text-xl">Bu raporu birlikte değerlendirelim</h2>
					<p className="mt-2 text-foreground">
						Çağlar Hoca bu raporu sizinle 15 dakikada ücretsiz değerlendirsin.
						{rapor.aramaIzni ? " Sizi bu numaradan arayacağız." : ""}
					</p>
					{whatsappHref && (
						<a
							href={whatsappHref}
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => trackDeneme("gorusme_tiklama", rapor.deneme.baslik)}
							className={cn(
								buttonVariants({ size: "lg" }),
								"mt-4 bg-[#25D366] text-white hover:bg-[#1ebe5b]",
							)}
						>
							<WhatsAppIcon className="size-5" /> WhatsApp'tan yazın
						</a>
					)}
				</section>
			)}

			<p className="text-center text-sm">
				<Link href="/deneme-sinavlari" className="text-muted-foreground underline">
					Başka bir deneme çöz
				</Link>
			</p>
		</div>
	);
}

/** Students' own numbers aren't called: ask for a parent's number, who then gets the report too. */
function ParentForm({
	raporKey,
	denemeBaslik,
}: Readonly<{ raporKey: string; denemeBaslik: string }>) {
	const [adSoyad, setAdSoyad] = useState("");
	const [telefon, setTelefon] = useState("");
	const [raporIzni, setRaporIzni] = useState(false);
	const [aramaIzni, setAramaIzni] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sentTo, setSentTo] = useState<string | null>(null);

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		setSending(true);
		setError(null);
		try {
			const response = await addParentNumber(raporKey, {
				adSoyad,
				telefon,
				raporIzni,
				aramaIzni,
				kaynak: getTrafficSource().kaynak,
			});
			trackDeneme("rapor_talebi", denemeBaslik, {
				yakinlik: "Veli",
				arama_izni: aramaIzni,
				rapordan: true,
			});
			setSentTo(response.telefon);
		} catch (e) {
			setError(e instanceof DenemeApiError ? e.message : "Bağlantı sorunu, lütfen tekrar deneyin.");
		} finally {
			setSending(false);
		}
	};

	if (sentTo) {
		return (
			<section role="status" className="rounded-2xl border border-green-200 bg-green-50 p-5">
				<CheckCircle2 className="mb-2 h-7 w-7 text-green-700" aria-hidden="true" />
				<p className="text-foreground">
					Rapor velinize de (<strong>{sentTo}</strong>) gönderilecek.
				</p>
			</section>
		);
	}

	return (
		<section
			aria-labelledby="veli-baslik"
			className="rounded-2xl border border-primary/30 bg-primary/5 p-5"
		>
			<h2 id="veli-baslik" className="font-bold text-foreground text-xl">
				Raporu velinle paylaş
			</h2>
			<p className="mt-1 text-muted-foreground text-sm">
				Velinin numarasını yaz, rapor ona da gönderilsin. Çağlar Hoca raporu velinle 15 dakikada
				ücretsiz değerlendirebilir.
			</p>
			<form onSubmit={submit} className="mt-4 space-y-3">
				<input
					aria-label="Velinin adı soyadı"
					placeholder="Velinin adı soyadı"
					required
					value={adSoyad}
					onChange={(e) => setAdSoyad(e.target.value)}
					className="w-full rounded-lg border border-border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
				<input
					aria-label="Velinin cep telefonu"
					placeholder="05xx xxx xx xx"
					type="tel"
					inputMode="tel"
					required
					value={telefon}
					onChange={(e) => setTelefon(e.target.value)}
					className="w-full rounded-lg border border-border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
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
				{error && (
					<p role="alert" className="text-destructive text-sm">
						{error}
					</p>
				)}
				<Button type="submit" disabled={sending}>
					{sending ? "Gönderiliyor..." : "Veliye gönder"}
				</Button>
			</form>
		</section>
	);
}

function Message({ title, text }: Readonly<{ title: string; text: string }>) {
	return (
		<div className="rounded-2xl border bg-white p-8 text-center">
			<h1 className="font-bold text-2xl text-foreground">{title}</h1>
			<p className="mt-2 text-muted-foreground">{text}</p>
			<Button asChild className="mt-4">
				<Link href="/deneme-sinavlari">Deneme sınavlarına git</Link>
			</Button>
		</div>
	);
}

function Stat({
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
