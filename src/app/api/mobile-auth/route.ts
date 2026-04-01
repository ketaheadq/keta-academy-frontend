import { type NextRequest, NextResponse } from "next/server";

const STRAPI_URL = "https://admin.ketaakademi.com";

export function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	const appRedirect = searchParams.get("redirect");
	const mobile = searchParams.get("mobile") ?? "true";

	// Build the Strapi Google OAuth URL with the mobile params
	const strapiUrl = new URL(`${STRAPI_URL}/api/auth/google`);
	if (appRedirect) strapiUrl.searchParams.set("redirect", appRedirect);
	strapiUrl.searchParams.set("mobile", mobile);

	// Server-side 302 redirect — no JavaScript needed, works in any browser
	return NextResponse.redirect(strapiUrl.toString());
}
