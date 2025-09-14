"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
	children: React.ReactNode;
	className?: string;
}

export default function BackButton({ children, className }: Readonly<BackButtonProps>) {
	const router = useRouter();

	const handleGoBack = () => {
		router.back();
	};

	return (
		<Button onClick={handleGoBack} className={className}>
			{children}
		</Button>
	);
}
