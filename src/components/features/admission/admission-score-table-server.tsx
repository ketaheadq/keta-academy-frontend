import { getAdmissionScoreTableDataBySlug } from "@/lib/strapi";
import AdmissionScoreTable from "./admission-score-table";

interface AdmissionScoreTableServerProps {
	slug: string;
	title: string;
}

export default async function AdmissionScoreTableServer({
	slug,
	title,
}: Readonly<AdmissionScoreTableServerProps>) {
	const tableData = await getAdmissionScoreTableDataBySlug(slug);

	if (!tableData) {
		return null;
	}

	return <AdmissionScoreTable tableData={tableData} title={title} />;
}
