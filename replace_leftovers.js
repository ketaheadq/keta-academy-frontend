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

	// text mappings
	content = content.replace(/text-gray-300/g, "text-muted-foreground");
	content = content.replace(/bg-gray-300/g, "bg-muted");

	content = content.replace(/text-purple-(400|500|600)/g, "text-primary");
	content = content.replace(/bg-purple-(50|100)/g, "bg-primary/10");

	content = content.replace(/bg-blue-400/g, "bg-primary");
	content = content.replace(/bg-blue-400\/10/g, "bg-primary/10");
	content = content.replace(/text-blue-(50|100|200)/g, "text-primary-foreground"); // Assuming dark mode / coloured background

	if (content !== originalContent) {
		fs.writeFileSync(filePath, content, "utf8");
		console.log("Updated", filePath);
	}
}

walkDir(path.join(__dirname, "src"), processFile);
