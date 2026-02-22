# Icon System Documentation

## Overview
The application uses a centralized icon system that maps string identifiers to Lucide React icons. This allows you to store simple string values in your Strapi backend instead of complex icon objects.

## How It Works

### 1. Icon Mapping
All icons are defined in `/src/lib/icons.ts`:
- `COURSE_ICONS`: Maps string keys to Lucide React icon components
- `SUBJECT_ICON_MAP`: Maps subject names to default icon keys
- Helper functions: `getCourseIcon()` and `getSubjectIcon()`

### 2. Usage in Components
```typescript
import { getCourseIcon, getSubjectIcon } from "@/lib/icons";

// Get icon by string key
const IconComponent = getCourseIcon("calculator");

// Get default icon for a subject
const subjectIcon = getSubjectIcon("Math"); // returns "calculator"
```

### 3. Course Object Structure
```typescript
interface Course {
  title: string;
  subject: string;
  icon?: string; // Optional - falls back to subject default
  progress: number;
}
```

## Strapi Backend Integration

### Option 1: Use Subject Defaults (Recommended)
In your Strapi course model, you only need:
```json
{
  "title": "Advanced Calculus",
  "subject": "Math",
  "progress": 0
}
```
The system will automatically use the calculator icon for Math courses.

### Option 2: Explicit Icon Override
For specific courses that need different icons:
```json
{
  "title": "Biology Lab",
  "subject": "Science",
  "icon": "microscope",
  "progress": 0
}
```

### Option 3: Icon Enum in Strapi
Create an enumeration field in Strapi with these values:
```
calculator, atom, beaker, microscope, bookOpen, code, zap, penTool, globe, palette, music, heart, users, target, trophy, star
```

## Available Icons

### Math & Science
- `calculator` - Calculator (default for Math)
- `atom` - Atom (default for Physics/Science)
- `beaker` - Beaker (default for Chemistry)
- `microscope` - Microscope (for Biology)

### Technology
- `code` - Code brackets (default for Coding/Programming)
- `zap` - Lightning bolt (for Technology)

### General Academic
- `bookOpen` - Open book (default fallback)
- `penTool` - Pen (for Literature/English)
- `globe` - Globe (for Geography)

### Arts & Social
- `palette` - Paint palette (for Art)
- `music` - Music note (for Music)
- `heart` - Heart (for Health)
- `users` - Users (for Social Studies)

### Achievement
- `target` - Target (for goals)
- `trophy` - Trophy (for achievements)
- `star` - Star (for favorites)

## Adding New Icons

1. Import the icon from `lucide-react` in `/src/lib/icons.ts`
2. Add it to the `COURSE_ICONS` object
3. Optionally add subject mappings to `SUBJECT_ICON_MAP`
4. Update this documentation

## Benefits

- **Simple Backend**: Store only string identifiers
- **Centralized**: All icon logic in one place
- **Flexible**: Support both explicit icons and subject defaults
- **Type-safe**: TypeScript ensures valid icon keys
- **Maintainable**: Easy to add new icons or change mappings 