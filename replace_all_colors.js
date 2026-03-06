const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
	if (!fs.existsSync(dir)) return;
	fs.readdirSync(dir).forEach((f) => {
		const dirPath = path.join(dir, f);
		const isDirectory = fs.statSync(dirPath).isDirectory();
		isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
	});
}

function processFile(filePath) {
	if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts") && !filePath.endsWith(".css")) return;
	let content = fs.readFileSync(filePath, "utf8");
	const originalContent = content;

	const prefixes = ["text", "bg", "border", "ring", "from", "via", "to", "fill", "stroke"];

	prefixes.forEach((prefix) => {
		// primary colors
		["blue", "indigo", "sky", "cyan", "purple", "violet", "teal", "emerald", "green"].forEach(
			(color) => {
				// Replace with opacity handle e.g. bg-blue-500/10 -> bg-primary/10.
				// If we replace bg-blue-500 with bg-primary, bg-primary/10 becomes bg-primary/10. Wait, if it has /10, it will become bg-primary/10.
				// This regex will match the color and number
				content = content.replace(
					new RegExp(`${prefix}-${color}-(500|600|700|800|900)`, "g"),
					`${prefix}-primary`,
				);
				content = content.replace(
					new RegExp(`${prefix}-${color}-(50|100|200|300|400)`, "g"),
					`${prefix}-primary/20`,
				);
			},
		);

		// accent colors
		["amber", "yellow", "lime", "orange"].forEach((color) => {
			content = content.replace(
				new RegExp(`${prefix}-${color}-(500|600|700|800|900)`, "g"),
				`${prefix}-accent`,
			);
			content = content.replace(
				new RegExp(`${prefix}-${color}-(50|100|200|300|400)`, "g"),
				`${prefix}-accent/20`,
			);
		});

		// destructive colors
		["red", "rose", "pink", "fuchsia"].forEach((color) => {
			content = content.replace(
				new RegExp(`${prefix}-${color}-(500|600|700|800|900)`, "g"),
				`${prefix}-destructive`,
			);
			content = content.replace(
				new RegExp(`${prefix}-${color}-(50|100|200|300|400)`, "g"),
				`${prefix}-destructive/20`,
			);
		});

		// neutral colors bg
		["slate", "gray", "zinc", "neutral", "stone"].forEach((color) => {
			if (prefix === "text") {
				content = content.replace(
					new RegExp(`${prefix}-${color}-(800|900|950)`, "g"),
					"text-foreground",
				);
				content = content.replace(
					new RegExp(`${prefix}-${color}-(400|500|600|700)`, "g"),
					"text-muted-foreground",
				);
				content = content.replace(
					new RegExp(`${prefix}-${color}-(50|100|200|300)`, "g"),
					"text-muted",
				);
			} else if (prefix === "bg") {
				content = content.replace(
					new RegExp(`${prefix}-${color}-(800|900|950)`, "g"),
					"bg-foreground",
				);
				content = content.replace(
					new RegExp(`${prefix}-${color}-(50|100|200|300)`, "g"),
					"bg-secondary",
				);
				content = content.replace(
					new RegExp(`${prefix}-${color}-(400|500|600|700)`, "g"),
					"bg-muted",
				);
			} else if (prefix === "border" || prefix === "ring") {
				content = content.replace(
					new RegExp(`${prefix}-${color}-\\d{2,3}`, "g"),
					`${prefix}-border`,
				);
			} else {
				content = content.replace(
					new RegExp(`${prefix}-${color}-\\d{2,3}`, "g"),
					`${prefix}-muted`,
				);
			}
		});
	});

	// Cleanup stacked opacities like bg-primary/20/10 -> bg-primary/10 (assuming the latter opacity is the intended custom one)
	content = content.replace(/\/20\/(\d+)/g, "/$1");

	// Also replace some from/to that might look weird e.g. from-primary/20 to-primary
	// that's valid tailwind though so we can keep it.

	if (content !== originalContent) {
		fs.writeFileSync(filePath, content, "utf8");
		console.log("Updated", filePath);
	}
}

walkDir(path.join(__dirname, "src"), processFile);
