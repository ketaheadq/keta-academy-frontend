import {
	Atom,
	Beaker,
	BookOpen,
	Calculator,
	Code,
	Globe,
	Heart,
	type LucideIcon,
	Microscope,
	Music,
	Palette,
	PenTool,
	Star,
	Target,
	Trophy,
	Users,
	Zap,
} from "lucide-react";

// Icon mapping for courses and subjects
export const COURSE_ICONS = {
	// Subject-based icons (matching API response)
	math: Calculator,
	physics: Atom,
	chemistry: Beaker,
	biology: Microscope,
	science: Atom,
	coding: Code,
	programming: Code,
	literature: PenTool,
	english: PenTool,
	history: BookOpen,
	geography: Globe,
	art: Palette,
	music: Music,
	health: Heart,
	social: Users,
	technology: Zap,

	// Specific icons (for more granular control)
	calculator: Calculator,
	atom: Atom,
	beaker: Beaker,
	microscope: Microscope,
	bookOpen: BookOpen,
	code: Code,
	zap: Zap,
	penTool: PenTool,
	globe: Globe,
	palette: Palette,
	heart: Heart,
	users: Users,
	target: Target,
	trophy: Trophy,
	star: Star,
} as const;

// Type for icon keys
export type CourseIconKey = keyof typeof COURSE_ICONS;

// Helper function to get icon component
export const getCourseIcon = (iconKey: string): LucideIcon => {
	return COURSE_ICONS[iconKey as CourseIconKey] || BookOpen;
};
