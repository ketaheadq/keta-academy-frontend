import type { Metadata } from "next";
import { LegalPage } from "@/components/features/legal/legal-page";
import { getContactPage, getTermsAndCondition } from "@/lib/strapi";

export const metadata: Metadata = {
	title: "Hizmet Şartları | KetaLearn",
	description: "KetaLearn'ü kullanırken geçerli olan kullanım koşulları.",
};

export default async function TermsOfServicePage() {
	const [document, contact] = await Promise.all([
		getTermsAndCondition().catch(() => null),
		getContactPage().catch(() => null),
	]);
	return <LegalPage title="Hizmet Şartları" document={document} email={contact?.email || null} />;
}
