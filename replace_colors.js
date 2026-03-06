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
	if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) return;
	let content = fs.readFileSync(filePath, "utf8");
	const originalContent = content;

	// Replace text colors
	content = content.replace(
		/text-(gray|slate|zinc|neutral|stone)-(800|900|950)/g,
		"text-foreground",
	);
	content = content.replace(
		/text-(gray|slate|zinc|neutral|stone)-(400|500|600|700)/g,
		"text-muted-foreground",
	);

	content = content.replace(
		/text-(blue|indigo|sky|cyan)-(400|500|600|700|800|900)/g,
		"text-primary",
	);
	content = content.replace(/text-(orange|amber|yellow)-(400|500|600|700|800|900)/g, "text-accent");
	content = content.replace(/text-(red|rose|pink)-(400|500|600|700|800|900)/g, "text-destructive");
	content = content.replace(/text-(green|emerald|teal)-(400|500|600|700|800|900)/g, "text-primary"); // Map green to primary if no success color

	// Replace bg colors
	content = content.replace(/bg-(gray|slate|zinc|neutral|stone)-(50|100|200)/g, "bg-secondary");
	content = content.replace(/bg-(gray|slate|zinc|neutral|stone)-(800|900|950)/g, "bg-foreground");

	content = content.replace(/bg-(blue|indigo|sky|cyan)-(500|600|700|800|900)/g, "bg-primary");
	content = content.replace(/bg-(blue|indigo|sky|cyan)-(50|100|200)/g, "bg-primary/10");

	content = content.replace(/bg-(orange|amber|yellow)-(50|100|200)/g, "bg-accent/10");
	content = content.replace(/bg-(orange|amber|yellow)-(500|600|700|800|900)/g, "bg-accent");

	content = content.replace(/bg-(red|rose|pink)-(50|100|200)/g, "bg-destructive/10");
	content = content.replace(/bg-(red|rose|pink)-(500|600|700|800|900)/g, "bg-destructive");

	content = content.replace(/bg-(green|emerald|teal)-(50|100|200)/g, "bg-primary/10");
	content = content.replace(/bg-(green|emerald|teal)-(500|600|700|800|900)/g, "bg-primary");

	// Replace border and ring colors
	content = content.replace(
		/(border|ring)-(gray|slate|zinc|neutral|stone)-(100|200|300|400|500|600|700|800|900)/g,
		"$1-border",
	);
	content = content.replace(
		/(border|ring)-(blue|indigo|sky|cyan)-(100|200|300|400|500|600|700|800|900)/g,
		"$1-primary",
	);
	content = content.replace(
		/(border|ring)-(orange|amber|yellow)-(100|200|300|400|500|600|700|800|900)/g,
		"$1-accent",
	);
	content = content.replace(
		/(border|ring)-(red|rose|pink)-(100|200|300|400|500|600|700|800|900)/g,
		"$1-destructive",
	);
	content = content.replace(
		/(border|ring)-(green|emerald|teal)-(100|200|300|400|500|600|700|800|900)/g,
		"$1-primary",
	);

	// Custom: bg-white text-gray-900 might just be bg-card text-card-foreground. Not touching plain white implicitly, but if we need, we could.

	if (content !== originalContent) {
		fs.writeFileSync(filePath, content, "utf8");
		console.log("Updated", filePath);
	}
}

walkDir(path.join(__dirname, "src"), processFile);
