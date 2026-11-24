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
			"from-primary to-primary text-foreground bg-linear-to-r bg-clip-text font-bold",
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
}) => <em className={clsx("text-muted-foreground font-medium italic", className)}>{children}</em>;

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
	<u className={clsx("underline decoration-blue-400 decoration-2 underline-offset-2", className)}>
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
}) => <s className={clsx("line-through decoration-red-400 decoration-2", className)}>{children}</s>;

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
			"bg-secondary text-primary rounded-lg border px-2 py-1 font-mono text-sm font-semibold",
			className,
		)}
	>
		{children}
	</code>
);

export const CodeModifierComponent = (props: { children: React.ReactNode }) => (
	<CodeModifier {...props} />
);
