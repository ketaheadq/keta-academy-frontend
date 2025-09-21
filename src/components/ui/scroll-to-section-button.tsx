"use client";

import { Button } from "./button";

interface ScrollToSectionButtonProps {
	children: React.ReactNode;
	className?: string;
	sectionId: string;
}

export default function ScrollToSectionButton({
	children,
	className,
	sectionId,
}: Readonly<ScrollToSectionButtonProps>) {
	const scrollToSection = () => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	return (
		<Button onClick={scrollToSection} className={className}>
			{children}
		</Button>
	);
}
