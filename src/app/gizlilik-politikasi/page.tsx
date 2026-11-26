import type { Metadata } from "next";
import { LegalPage } from "@/components/features/legal/legal-page";
import { getContactPage, getPrivacyPolicy } from "@/lib/strapi";

export const metadata: Metadata = {
	title: "Gizlilik Politikası ve KVKK Aydınlatma Metni | KetaLearn",
	description: "KetaLearn'ün kişisel verileri nasıl işlediği ve haklarınız.",
};

export default async function PrivacyPolicyPage() {
	const [document, contact] = await Promise.all([
		getPrivacyPolicy().catch(() => null),
		getContactPage().catch(() => null),
	]);
	return (
		<LegalPage title="Gizlilik Politikası" document={document} email={contact?.email || null} />
	);
}
