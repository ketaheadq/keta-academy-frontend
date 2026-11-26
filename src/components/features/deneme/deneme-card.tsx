import { ArrowRight, Clock, FileQuestion, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { type DenemeSummary, SINAV_TURU_LABEL } from "@/lib/deneme";
import { cn } from "@/lib/utils";

/** Exam card for the list page and the home page. The whole card links to the exam page. */
export function DenemeCard({ deneme }: Readonly<{ deneme: DenemeSummary }>) {
	return (
		<article className="group relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5">
			<div className="mb-3 flex flex-wrap gap-2">
				<Badge>{SINAV_TURU_LABEL[deneme.sinavTuru]}</Badge>
				{deneme.sinif && <Badge variant="secondary">{deneme.sinif.title}</Badge>}
				{deneme.ders && <Badge variant="outline">{deneme.ders.title}</Badge>}
			</div>
			<h3 className="text-foreground text-lg leading-snug font-bold">
				<Link href={`/deneme-sinavlari/${deneme.slug}`} className="after:absolute after:inset-0">
					{deneme.baslik}
				</Link>
			</h3>
			{deneme.aciklama && (
				<p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{deneme.aciklama}</p>
			)}
			<div className="text-muted-foreground mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
				<span className="flex items-center gap-1">
					<FileQuestion className="h-4 w-4" aria-hidden="true" /> {deneme.soruSayisi} soru
				</span>
				<span className="flex items-center gap-1">
					<Clock className="h-4 w-4" aria-hidden="true" /> {deneme.sureDakika} dk
				</span>
				{deneme.cozenSayisi !== null && (
					<span className="flex items-center gap-1">
						<Users className="h-4 w-4" aria-hidden="true" />{" "}
						{deneme.cozenSayisi.toLocaleString("tr-TR")} öğrenci çözdü
					</span>
				)}
			</div>
			<div className="mt-auto pt-5">
				<span
					aria-hidden="true"
					className={cn(
						buttonVariants({ size: "sm" }),
						"group-hover:bg-primary w-full transition-colors",
					)}
				>
					Ücretsiz çöz{" "}
					<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
				</span>
			</div>
		</article>
	);
}
