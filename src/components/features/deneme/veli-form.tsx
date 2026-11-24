"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addParentNumber, DenemeApiError } from "@/lib/deneme";
import { getTrafficSource, trackDeneme } from "@/lib/deneme-tracking";
import { RaporHazir } from "./rapor-hazir";

/** Students' own numbers aren't called: the PDF links here to add a parent's number. */
export function VeliForm({
	raporKey,
	denemeBaslik,
}: Readonly<{ raporKey: string; denemeBaslik: string }>) {
	const [adSoyad, setAdSoyad] = useState("");
	const [telefon, setTelefon] = useState("");
	const [raporIzni, setRaporIzni] = useState(false);
	const [aramaIzni, setAramaIzni] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sent, setSent] = useState(false);

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		setSending(true);
		setError(null);
		try {
			await addParentNumber(raporKey, {
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
			setSent(true);
		} catch (e) {
			setError(e instanceof DenemeApiError ? e.message : "Bağlantı sorunu, lütfen tekrar deneyin.");
		} finally {
			setSending(false);
		}
	};

	if (sent) {
		return (
			<section role="status" className="rounded-2xl border border-green-200 bg-green-50 p-5">
				<CheckCircle2 className="mb-2 h-7 w-7 text-green-700" aria-hidden="true" />
				<p className="text-foreground">
					Teşekkürler. Çağlar Hoca velini arayıp raporu birlikte değerlendirecek. Raporu veline
					şimdi de gönderebilirsin:
				</p>
				<RaporHazir raporKey={raporKey} denemeBaslik={denemeBaslik} />
			</section>
		);
	}

	return (
		<form onSubmit={submit} className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
			<input
				aria-label="Velinin adı soyadı"
				placeholder="Velinin adı soyadı"
				required
				autoComplete="off"
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
					Bilgilerin rapor ve değerlendirme için işlenmesine ilişkin{" "}
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
	);
}
