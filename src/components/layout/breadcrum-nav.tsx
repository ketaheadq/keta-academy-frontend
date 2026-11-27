"use client";

import { ChevronRight, HouseIcon } from "lucide-react";
import type { Variants } from "motion/react";
import { m } from "motion/react";
import Link from "next/link";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface BreadcrumbNavProps {
	breadcrumbs: {
		label: string;
		href: string;
	}[];
}

const containerVariants: Variants = {
	hidden: { opacity: 0, y: -6 },
	shown: {
		opacity: 1,
		y: 0,
		transition: {
			duration: DURATION.base,
			ease: EASE_OUT,
			staggerChildren: 0.045,
			delayChildren: 0.04,
		},
	},
};

const crumbVariants: Variants = {
	hidden: { opacity: 0, x: -6 },
	shown: {
		opacity: 1,
		x: 0,
		transition: { duration: DURATION.base, ease: EASE_OUT },
	},
};

export function BreadcrumbNav({ breadcrumbs }: Readonly<BreadcrumbNavProps>) {
	return (
		<div className="border-border/60 from-muted/70 via-background to-muted/30 relative isolate overflow-hidden border-b bg-linear-to-r">
			<m.div
				className="relative z-10 mx-auto flex min-h-12 items-center py-2"
				variants={containerVariants}
				initial="hidden"
				animate="shown"
			>
				<Breadcrumb className="w-full min-w-0">
					<BreadcrumbList className="w-full [scrollbar-width:none] flex-nowrap gap-1 overflow-x-auto sm:gap-1.5 [&::-webkit-scrollbar]:hidden">
						<BreadcrumbItem className="shrink-0">
							<m.span variants={crumbVariants} className="inline-flex">
								<BreadcrumbLink
									asChild
									className="group hover:border-border hover:bg-card hover:text-accent focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border border-transparent px-2.5 py-1.5 font-medium hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none"
								>
									<Link href="/" aria-label="Anasayfa">
										<span className="bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground flex size-6 items-center justify-center rounded-full transition-colors">
											<HouseIcon className="size-3.5" />
										</span>
										<span className="hidden sm:inline">Anasayfa</span>
									</Link>
								</BreadcrumbLink>
							</m.span>
						</BreadcrumbItem>

						{breadcrumbs.map((breadcrumb, index) => {
							const isCurrent = index === breadcrumbs.length - 1;

							return (
								<Fragment key={breadcrumb.href}>
									<BreadcrumbSeparator className="text-muted-foreground/40 shrink-0 px-1">
										<m.span variants={crumbVariants} className="inline-flex">
											<ChevronRight className="size-3.5" />
										</m.span>
									</BreadcrumbSeparator>
									<BreadcrumbItem className={cn(isCurrent ? "min-w-0 flex-1" : "shrink-0")}>
										<m.span
											variants={crumbVariants}
											className={cn("inline-flex", isCurrent && "block min-w-0")}
										>
											{isCurrent ? (
												<BreadcrumbPage className="border-border/70 bg-card text-foreground inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 font-medium shadow-sm">
													<span
														aria-hidden="true"
														className="bg-accent size-1.5 shrink-0 rounded-full"
													/>
													<span className="min-w-0 truncate">{breadcrumb.label}</span>
												</BreadcrumbPage>
											) : (
												<BreadcrumbLink
													asChild
													className="group hover:border-border hover:bg-card hover:text-accent focus-visible:ring-ring inline-flex items-center rounded-full border border-transparent px-2.5 py-1.5 font-medium hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none"
												>
													<Link href={breadcrumb.href}>{breadcrumb.label}</Link>
												</BreadcrumbLink>
											)}
										</m.span>
									</BreadcrumbItem>
								</Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</m.div>
			<m.span
				aria-hidden="true"
				className="via-accent/50 absolute inset-x-[15%] bottom-0 h-px origin-left bg-linear-to-r from-transparent to-transparent"
				initial={{ scaleX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.12 }}
			/>
		</div>
	);
}
