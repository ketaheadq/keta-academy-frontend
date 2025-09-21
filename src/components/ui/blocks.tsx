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
			<div className="relative overflow-hidden rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
				<Image
					src={image.url}
					alt={image.alternativeText || ""}
					width={image.width || 1200}
					height={image.height || 800}
					className="h-auto w-full"
					style={{
						maxWidth: "100%",
						height: "auto",
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			</div>
			{image.caption && (
				<div className="mt-4 text-center">
					<p className="px-4 font-light text-gray-500 text-sm italic">{image.caption}</p>
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
