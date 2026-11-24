import type { NextRequest } from "next/server";

/**
 * The SMS link (`/rapor/<key>`) opens the PDF report straight away. The PDF is built by
 * Strapi on each request; this route passes it through so the link stays on our domain.
 */
const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
	const { key } = await params;
	const onizleme = request.nextUrl.searchParams.get("onizleme") === "1";
	let response: Response;
	try {
		response = await fetch(
			`${STRAPI_URL}/api/raporlar/${encodeURIComponent(key)}/pdf${onizleme ? "?onizleme=1" : ""}`,
			{ cache: "no-store" },
		);
	} catch {
		return message(502, "Rapor şu an açılamadı", "Birkaç dakika sonra linki tekrar açın.");
	}

	if (response.ok && response.body) {
		const headers = new Headers({
			"Content-Type": "application/pdf",
			"Cache-Control": "private, no-store",
			"X-Robots-Tag": "noindex, nofollow",
		});
		const disposition = response.headers.get("content-disposition");
		if (disposition) headers.set("Content-Disposition", disposition);
		return new Response(response.body, { status: 200, headers });
	}
	if (response.status === 404)
		return message(
			404,
			"Rapor bulunamadı",
			"Linki SMS'teki haliyle açtığınızdan emin olun. Raporlar bir süre sonra silinir.",
		);
	if (response.status === 409)
		return message(
			409,
			"Raporunuz hazırlanıyor",
			"Birkaç dakika sonra bu linki tekrar açın. Bu sayfa kendini yeniler.",
			60,
		);
	return message(502, "Rapor şu an açılamadı", "Birkaç dakika sonra linki tekrar açın.");
}

const escapeHtml = (text: string) =>
	text.replace(
		/[&<>"]/g,
		(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
	);

/** Small standalone page for the cases where there's no PDF to show. */
function message(status: number, title: string, text: string, refreshSeconds?: number) {
	const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
${refreshSeconds ? `<meta http-equiv="refresh" content="${refreshSeconds}">` : ""}
<title>${escapeHtml(title)} | KetaLearn</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f1f5f9;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#0f172a}
main{max-width:28rem;margin:1rem;padding:2rem;background:#fff;border:1px solid #e2e8f0;border-radius:1rem;text-align:center}
h1{margin:0 0 .5rem;font-size:1.5rem}p{margin:0;color:#64748b;line-height:1.5}
a{display:inline-block;margin-top:1.25rem;padding:.6rem 1.1rem;border-radius:.5rem;background:#0f172a;color:#fff;text-decoration:none;font-weight:600}
</style>
</head>
<body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p><a href="/deneme-sinavlari">Deneme sınavlarına git</a></main></body>
</html>`;
	return new Response(html, {
		status,
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "no-store",
			"X-Robots-Tag": "noindex, nofollow",
		},
	});
}
