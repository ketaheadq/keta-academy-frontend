import { SlashIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
	breadcrumbs: {
		label: string;
		href: string;
	}[];
}

export function BreadcrumbNav({ breadcrumbs }: Readonly<BreadcrumbNavProps>) {
	return (
		<div className="border-gray-200 border-b px-4">
			<div className="mx-auto">
				<Breadcrumb>
					<BreadcrumbList>
						{/* Home */}
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Anasayfa</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						{/* Dynamic Breadcrumbs */}
						{breadcrumbs.map((breadcrumb) => (
							<Fragment key={breadcrumb.href}>
								<BreadcrumbSeparator>
									<SlashIcon />
								</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link href={breadcrumb.href}>{breadcrumb.label}</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
							</Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</div>
	);
}
