import clsx from "clsx";
import Image from "next/image";

const ContentImage = ({
	image,
	className,
}: {
	image: {
		url?: string;
		alternativeText?: string | null;
		width?: number;
		height?: number;
		caption?: string | null;
	};
	className?: string;
}) => {
	if (!image?.url) return null;

	return (
		<div className={clsx("group my-12", className)}>
			<div className="relative aspect-[2/1] overflow-hidden rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
				<Image
					src={image.url}
					alt={image.alternativeText || ""}
					fill
					sizes="(min-width: 1024px) 800px, (min-width: 768px) 80vw, 100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			</div>
			{image.caption && (
				<div className="mt-4 text-center">
					<p className="text-muted-foreground px-4 text-sm font-light italic">{image.caption}</p>
				</div>
			)}
		</div>
	);
};

export const ImageModifierComponent = (props: {
	image: {
		url?: string;
		alternativeText?: string | null;
		width?: number;
		height?: number;
		caption?: string | null;
	};
}) => <ContentImage {...props} />;
