import clsx from "clsx";

const BoldModifier = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<strong
		className={clsx(
			"bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-gray-900",
			className,
		)}
	>
		{children}
	</strong>
);

export const BoldModifierComponent = (props: { children: React.ReactNode }) => (
	<BoldModifier {...props} />
);

const ItalicModifier = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => <em className={clsx("font-medium text-gray-700 italic", className)}>{children}</em>;

export const ItalicModifierComponent = (props: { children: React.ReactNode }) => (
	<ItalicModifier {...props} />
);

const UnderlineModifier = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<u className={clsx("underline decoration-2 decoration-blue-400 underline-offset-2", className)}>
		{children}
	</u>
);

export const UnderlineModifierComponent = (props: { children: React.ReactNode }) => (
	<UnderlineModifier {...props} />
);

const StrikethroughModifier = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => <s className={clsx("line-through decoration-2 decoration-red-400", className)}>{children}</s>;

export const StrikethroughModifierComponent = (props: { children: React.ReactNode }) => (
	<StrikethroughModifier {...props} />
);

const CodeModifier = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<code
		className={clsx(
			"rounded-lg border bg-gray-100 px-2 py-1 font-mono font-semibold text-blue-600 text-sm",
			className,
		)}
	>
		{children}
	</code>
);

export const CodeModifierComponent = (props: { children: React.ReactNode }) => (
	<CodeModifier {...props} />
);
