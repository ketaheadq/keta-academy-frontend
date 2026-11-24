import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only star row for an average rating (0–5), with partially filled stars. */
export function RatingStars({
	value,
	className,
	starClassName = "h-4 w-4",
}: Readonly<{ value: number; className?: string; starClassName?: string }>) {
	return (
		<span
			className={cn("inline-flex items-center gap-0.5", className)}
			role="img"
			aria-label={`5 üzerinden ${value.toLocaleString("tr-TR")} puan`}
		>
			{[1, 2, 3, 4, 5].map((position) => {
				const fill = Math.max(0, Math.min(1, value - (position - 1)));
				return (
					<span key={position} className="relative inline-block">
						<Star className={cn(starClassName, "text-amber-300")} aria-hidden="true" />
						<span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
							<Star
								className={cn(starClassName, "fill-amber-400 text-amber-400")}
								aria-hidden="true"
							/>
						</span>
					</span>
				);
			})}
		</span>
	);
}
