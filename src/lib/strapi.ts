// New types for Rich Text content
export interface StrapiRichTextBlock {
	type: string;
	children: StrapiRichTextNode[];
}

export interface StrapiRichTextNode {
	type: string;
	text?: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	code?: boolean;
	children?: StrapiRichTextNode[];
	url?: string;
	level?: number;
}

export interface StrapiImage {
	id: number;
	documentId: string;
	name: string;
	alternativeText: string | null;
	caption: string | null;
	width: number;
	height: number;
	formats: any;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: string | null;
	provider: string;
	provider_metadata: {
		public_id: string;
		resource_type: string;
	};
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface StrapiSettings {
	id: number;
	documentId: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	siteName: string;
	defaultSEODescription: string | null;
	analyticsID: string | null;
	logo: StrapiImage;
	favicon: StrapiImage;
}

export interface StrapiPageCategory {
	id: number;
	documentId: string;
	slug: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	pages: StrapiPage[];
}

// Video Types
export interface StrapiVideo {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	href: string;
	related_datas?: StrapiVideo[];
	page?: StrapiPage;
	isPopular: boolean;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	SEO?: StrapiSEO;
}

// Blog Types
export interface StrapiBlog {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	content: StrapiBlock[];
	image?: StrapiImage;
	category?: string;
	related_datas?: StrapiBlog[];
	page?: StrapiPage;
	isPopular: boolean;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	SEO?: StrapiSEO;
}

// University Types
export interface StrapiUniversity {
	id: number;
	documentId: string;
	title: string;
	description?: string;
	content?: StrapiBlock[];
	slug: string;
	ranking?: number;
	seoTitle?: string;
	seoDescription?: string;
	admission_score?: StrapiAdmissionScore;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// Department Types
export interface StrapiDepartment {
	id: number;
	documentId: string;
	titile: string; // Note: keeping the typo "titile" as per the schema
	content?: StrapiBlock[];
	admission_score?: StrapiAdmissionScore;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// Updated Admission Score Types
export interface StrapiAdmissionScore {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	content: StrapiBlock[];
	tableData: string;
	related_datas?: StrapiAdmissionScore[];
	page?: StrapiPage;
	isPopular: boolean;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	university: StrapiUniversity;
	department: StrapiDepartment;
	SEO?: StrapiSEO;
}

// SEO Component Types (to be created in Strapi)
export interface StrapiSEO {
	id: number;
	metaTitle: string;
	metaDescription: string;
	keywords?: string;
	metaRobots?: string;
	metaImage?: StrapiImage;
}

export interface StrapiPageSEO {
	id: number;
	metaTitle: string;
	metaDescription: string;
	keywords?: string;
	canonicalURL?: string;
	preventIndexing?: boolean;
	metaImage?: StrapiImage;
	structuredData?: any;
}

export interface StrapiPage {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	pageType:
		| "Üniversite Taban Puanları"
		| "Bölüm Taban Puanları"
		| "Videolar"
		| "Bloglar"
		| "Hesaplama Araçları";
	page_category?: StrapiPageCategory;
	admission_scores?: StrapiAdmissionScore[];
	videos?: StrapiVideo[];
	blogs?: StrapiBlog[];
	SEO?: StrapiPageSEO; // SEO component
}

export interface StrapiSubject {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	description: string;
	icon?: {
		id: number;
		name: string;
	};
}

export interface StrapiLesson {
	id: number;
	documentId: string;
	title: string;
	description: string;
	videoURL?: string | null;
	content?: StrapiBlock[];
	attachments?: { id: number; url: string; name: string }[];
	quiz?: StrapiQuiz | null;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	slug: string;
}

export interface StrapiCourseLesson {
	id: number;
	documentId: string;
	order: number;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	lesson: StrapiLesson;
	course: StrapiCourse | number;
}

export interface StrapiCourse {
	id: number;
	documentId: string;
	title: string;
	description: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	slug: string;
	thumbnail: StrapiImage;
	subject: StrapiSubject;
	icon?: {
		id: number;
		name: string;
	};
	grades: StrapiGrade[];
	isPopular: boolean | null;
	course_lessons: StrapiCourseLesson[];
}

export interface StrapiGrade {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	order: number;
}

export interface StrapiResponse<T> {
	data: T;
	meta: any;
}

// Strapi Block Content Type (for rich text fields)
export interface StrapiBlock {
	type: string;
	children: Array<{
		text: string;
		type?: string;
		[key: string]: any;
	}>;
	[key: string]: any;
}

// Answer Option Type
export interface StrapiAnswerOption {
	id: number;
	documentId: string;
	text: string;
	order?: number;
}

// Question Types
export type QuestionType = "multipleChoice" | "trueFalse";

// Question Type
export interface StrapiQuestion {
	id: number;
	documentId: string;
	text: StrapiBlock[];
	type: QuestionType;
	order?: number;
	options: StrapiAnswerOption[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// Quiz Progress Type
export interface StrapiQuizProgress {
	id: number;
	documentId: string;
	score?: number;
	completed: boolean;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// Quiz Type
export interface StrapiQuiz {
	id: number;
	documentId: string;
	title: string;
	description?: string;
	timeLimit?: number; // in minutes
	passingScore?: number; // percentage (0-100)
	maxAttempts?: number;
	shuffleQuestions?: boolean;
	showCorrectAnswers?: boolean;
	questions: StrapiQuestion[];
	lessons?: StrapiLesson[];
	quiz_progresses?: StrapiQuizProgress[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	slug: string;
	thumbnail?: StrapiImage;
	subject?: StrapiSubject;
	grades?: StrapiGrade[];
}

// Privacy Policy and Terms of Service Types
export interface StrapiPrivacyPolicy {
	id: number;
	documentId: string;
	text: StrapiBlock[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface StrapiTermsOfService {
	id: number;
	documentId: string;
	text: StrapiBlock[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

// Collection Response Type for paginated results
export interface StrapiCollectionResponse<T> {
	data: T[];
	meta: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

// Helper types for form data (when creating/updating)
export interface QuizFormData {
	title: string;
	description?: string;
	timeLimit?: number;
	passingScore?: number;
	maxAttempts?: number;
	shuffleQuestions?: boolean;
	showCorrectAnswers?: boolean;
	questions: QuestionFormData[];
	slug: string;
}

export interface QuestionFormData {
	text: StrapiBlock[];
	type: QuestionType;
	explanation?: StrapiBlock[];
	order?: number;
	options: AnswerOptionFormData[];
}

export interface AnswerOptionFormData {
	text: string;
	isCorrect: boolean;
	order?: number;
}

// Type guards
export const isQuizResponse = (data: any): data is StrapiResponse<StrapiQuiz> => {
	return data?.data && typeof data.data.id === "number" && data.data.title;
};

export const isQuizCollectionResponse = (
	data: any,
): data is StrapiCollectionResponse<StrapiQuiz> => {
	return Array.isArray(data?.data) && data?.meta?.pagination;
};

// Quiz-related API functions
export async function getQuizzes() {
	const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>("quizzes?populate=*");
	return response.data;
}

export async function getQuizBySlug(slug: string) {
	const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>(
		`quizzes?filters[slug][$eq]=${slug}&populate=*`,
	);
	return response.data[0]; // Return first match
}

export async function getQuizzesBySubject(subjectSlug: string) {
	const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>(
		`quizzes?filters[subject][slug][$eq]=${subjectSlug}&populate=*`,
	);
	return response.data;
}

const STRAPI_URL =
	(typeof window === "undefined" ? process.env.STRAPI_INTERNAL_URL : undefined) ||
	process.env.NEXT_PUBLIC_STRAPI_URL;

export async function fetchStrapiDataUsingToken<T>(endpoint: string, token: string): Promise<T> {
	try {
		const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching Strapi data:", error);
		throw error;
	}
}
export async function fetchStrapiData<T>(endpoint: string): Promise<T> {
	try {
		const fullUrl = `${STRAPI_URL}/api/${endpoint}`;

		const response = await fetch(fullUrl, {
			headers: {
				"Content-Type": "application/json",
			},
			next: { revalidate: 300 }, // Revalidate every 5 minutes
		});

		if (response.status === 403) {
			console.warn(
				`⚠️ Permission denied for endpoint: ${endpoint}. Please check Strapi permissions.`,
			);
			// Return empty data structure for 403 errors
			return { data: [] } as T;
		}

		if (!response.ok) {
			console.error(`❌ Strapi API error: ${response.status} ${response.statusText}`);
			console.error(`Endpoint: ${endpoint}`);
			throw new Error(`Failed to fetch data: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching Strapi data:", error);
		throw error;
	}
}

export async function getSettings(): Promise<StrapiSettings> {
	const response = await fetchStrapiData<StrapiResponse<StrapiSettings>>("setting?populate=*");
	if (!response.data?.siteName) {
		throw new Error("Site settings have not been published or are unavailable");
	}
	return response.data;
}

export async function getPageCategories() {
	const response = await fetchStrapiData<StrapiResponse<StrapiPageCategory[]>>(
		"page-categories?populate=*",
	);
	return response.data;
}

export async function getPageBySlug(slug: string): Promise<StrapiPage | null> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiPage[]>>(
			`pages?filters[slug][$eq]=${slug}&populate=*`,
		);
		return response.data.length > 0 ? response.data[0] : null;
	} catch (error) {
		console.error("Error fetching page by slug:", error);
		return null;
	}
}

export async function getCourse(slug: string) {
	const response = await fetchStrapiData<StrapiResponse<StrapiCourse[]>>(
		`courses?populate=*&filters[slug][$eq]=${slug}`,
	);
	return response.data[0];
}

export async function getLessonsByCourseId(courseId: number) {
	const response = await fetchStrapiData<StrapiCollectionResponse<StrapiCourseLesson>>(
		`course-lessons?populate[lesson][populate][quiz][populate][questions][populate][options]=true&populate[lesson][populate][attachments]=true&filters[course][id][$eq]=${courseId}`,
	);
	return response.data.sort((a, b) => a.order - b.order);
}

export async function getAllCourseLessons(token: string) {
	const response = await fetchStrapiDataUsingToken<StrapiCollectionResponse<StrapiCourseLesson>>(
		"course-lessons?populate=*",
		token,
	);
	return response.data.sort((a, b) => a.order - b.order);
}

export async function getSubjects() {
	const response = await fetchStrapiData<StrapiResponse<StrapiSubject[]>>("subjects?populate=icon");
	return response.data;
}

export async function getGrades() {
	const response = await fetchStrapiData<StrapiResponse<StrapiGrade[]>>("grades");
	return response.data;
}

export async function getCourses() {
	const response = await fetchStrapiData<StrapiResponse<StrapiCourse[]>>("courses?populate=*");
	return response.data;
}

export async function getCoursesBySubject(subjectSlug: string) {
	const response = await fetchStrapiData<StrapiResponse<StrapiCourse[]>>(
		`courses?filters[subject][slug][$eq]=${subjectSlug}&populate=*`,
	);
	return response.data;
}

export async function getSubjectBySlug(slug: string) {
	const subjects = await getSubjects();
	return subjects.find((subject: StrapiSubject) => subject.slug === slug);
}

// Privacy Policy and Terms API functions
export async function getPrivacyPolicy(): Promise<StrapiPrivacyPolicy> {
	const response = await fetchStrapiData<StrapiResponse<StrapiPrivacyPolicy>>("privacy-policy");
	return response.data;
}

export async function getTermsAndCondition(): Promise<StrapiTermsOfService> {
	const response =
		await fetchStrapiData<StrapiResponse<StrapiTermsOfService>>("term-and-condition");
	return response.data;
}

export type CourseStatus = "not_started" | "in_progress" | "completed";

export type QuizStatus = "not_started" | "in_progress" | "completed";

// Progress-related interfaces
export interface StrapiLessonProgress {
	documentId: string;
	isCompleted: boolean;
}

export interface QuizResult {
	totalQuestions: number;
	correctAnswers: number;
	totalPoints: number;
	earnedPoints: number;
	percentage: number;
	passed: boolean;
	attempts: { questionId: number; selectedAnswer: string; correctAnswer: string; isCorrect: boolean; explanation: StrapiBlock[] }[];
}

async function learningRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
	const response = await fetch(STRAPI_URL + '/api/learning/' + path, {
		...options,
		headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
	});
	if (!response.ok) throw new Error('Learning request failed: ' + response.status);
	return (await response.json()).data;
}

export async function getUserLessonProgress(documentIds: string[], token: string) {
	const rows = await learningRequest<StrapiLessonProgress[]>('lesson-progress', token);
	const requested = new Set(documentIds);
	return rows.filter(row => requested.has(row.documentId));
}

export function updateLessonProgress(documentId: string, isCompleted: boolean, token: string) {
	return learningRequest<StrapiLessonProgress>('lesson-progress/' + encodeURIComponent(documentId), token, {
		method: 'PUT', body: JSON.stringify({ isCompleted }),
	});
}

export function submitQuiz(documentId: string, answers: Record<number, number>, submissionId: string, token: string) {
	return learningRequest<QuizResult>('quizzes/' + encodeURIComponent(documentId) + '/attempts', token, {
		method: 'POST', body: JSON.stringify({ answers, submissionId }),
	});
}

export async function getAdmissionScores(): Promise<StrapiAdmissionScore[]> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiAdmissionScore[]>>(
			"admission-scores?populate=*",
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching admission scores - check Strapi permissions:", error);
		return [];
	}
}

export async function getAdmissionScoreBySlug(slug: string): Promise<StrapiAdmissionScore | null> {
	try {
		console.log(`🔍 Fetching admission score for slug: ${slug}`);
		const response = await fetchStrapiData<StrapiResponse<StrapiAdmissionScore[]>>(
			`admission-scores?filters[slug][$eq]=${slug}&populate[university][populate]=*&populate[department][populate]=*&populate[page][populate]=*&populate[related_datas][populate]=*&populate[SEO][populate]=*&fields[0]=id&fields[1]=documentId&fields[2]=title&fields[3]=slug&fields[4]=content&fields[5]=isPopular&fields[6]=createdAt&fields[7]=updatedAt&fields[8]=publishedAt`,
		);
		console.log(`✅ Admission score found: ${response.data.length > 0 ? "Yes" : "No"}`);
		return response.data.length > 0 ? response.data[0] : null;
	} catch (error) {
		console.error("Error fetching admission score by slug - check Strapi permissions:", error);
		return null;
	}
}

export async function getAdmissionScoresByPage(pageSlug: string): Promise<StrapiAdmissionScore[]> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiAdmissionScore[]>>(
			`admission-scores?filters[page][slug][$eq]=${pageSlug}&populate[university][populate]=*&populate[department][populate]=*&fields[0]=id&fields[1]=documentId&fields[2]=title&fields[3]=slug&fields[5]=isPopular&fields[6]=createdAt&fields[7]=updatedAt&fields[8]=publishedAt&pagination[pageSize]=100`,
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching admission scores by page - check Strapi permissions for admission-scores collection:",
			error,
		);
		return [];
	}
}

export async function getAdmissionScoreTableDataBySlug(slug: string): Promise<string | null> {
	try {
		console.log(`🔍 Fetching table data for admission score slug: ${slug}`);

		const fullUrl = `${STRAPI_URL}/api/admission-scores?filters[slug][$eq]=${slug}&fields[0]=tableData`;

		const response = await fetch(fullUrl, {
			headers: {
				"Content-Type": "application/json",
			},
			next: { revalidate: 3600 }, // Cache for 1 hour
		});

		if (response.status === 403) {
			console.warn(
				`⚠️ Permission denied for table data endpoint: ${slug}. Please check Strapi permissions.`,
			);
			return null;
		}

		if (!response.ok) {
			console.error(`❌ Strapi API error: ${response.status} ${response.statusText}`);
			throw new Error(`Failed to fetch table data: ${response.statusText}`);
		}

		const data = await response.json();
		console.log(`✅ Table data found: ${data.data && data.data.length > 0 ? "Yes" : "No"}`);
		return data.data && data.data.length > 0 ? data.data[0].tableData : null;
	} catch (error) {
		console.error(
			"Error fetching admission score table data by slug - check Strapi permissions:",
			error,
		);
		return null;
	}
}

// University API functions
export async function getUniversities(): Promise<StrapiUniversity[]> {
	try {
		const response =
			await fetchStrapiData<StrapiResponse<StrapiUniversity[]>>("universities?populate=*");
		return response.data;
	} catch (error) {
		console.error("Error fetching universities - check Strapi permissions:", error);
		return [];
	}
}

export async function getUniversityBySlug(slug: string): Promise<StrapiUniversity | null> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiUniversity[]>>(
			`universities?filters[slug][$eq]=${slug}&populate=*`,
		);
		return response.data.length > 0 ? response.data[0] : null;
	} catch (error) {
		console.error("Error fetching university by slug - check Strapi permissions:", error);
		return null;
	}
}

// Department API functions
export async function getDepartments(): Promise<StrapiDepartment[]> {
	try {
		const response =
			await fetchStrapiData<StrapiResponse<StrapiDepartment[]>>("departments?populate=*");
		return response.data;
	} catch (error) {
		console.error("Error fetching departments - check Strapi permissions:", error);
		return [];
	}
}

export async function getDepartmentBySlug(slug: string): Promise<StrapiDepartment | null> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiDepartment[]>>(
			`departments?filters[slug][$eq]=${slug}&populate=*`,
		);
		return response.data.length > 0 ? response.data[0] : null;
	} catch (error) {
		console.error("Error fetching department by slug - check Strapi permissions:", error);
		return null;
	}
}

// Video API functions
export async function getVideos(): Promise<StrapiVideo[]> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiVideo[]>>("videos?populate=*");
		return response.data;
	} catch (error) {
		console.error("Error fetching videos - check Strapi permissions:", error);
		return [];
	}
}

export async function getVideoBySlug(slug: string): Promise<StrapiVideo | null> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiVideo[]>>(
			`videos?filters[slug][$eq]=${slug}&populate=*`,
		);
		return response.data.length > 0 ? response.data[0] : null;
	} catch (error) {
		console.error("Error fetching video by slug - check Strapi permissions:", error);
		return null;
	}
}

export async function getVideosByPage(pageSlug: string): Promise<StrapiVideo[]> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiVideo[]>>(
			`videos?filters[page][slug][$eq]=${pageSlug}&populate=*&pagination[pageSize]=100`,
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching videos by page - check Strapi permissions for videos collection:",
			error,
		);
		return [];
	}
}

// Blog API functions
export async function getBlogs(): Promise<StrapiBlog[]> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiBlog[]>>("blogs?populate=*");
		return response.data;
	} catch (error) {
		console.error("Error fetching blogs - check Strapi permissions:", error);
		return [];
	}
}

export async function getBlogBySlug(slug: string): Promise<StrapiBlog | null> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiBlog[]>>(
			`blogs?filters[slug][$eq]=${slug}&populate=*`,
		);
		return response.data.length > 0 ? response.data[0] : null;
	} catch (error) {
		console.error("Error fetching blog by slug - check Strapi permissions:", error);
		return null;
	}
}

export async function getBlogsByPage(pageSlug: string): Promise<StrapiBlog[]> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiBlog[]>>(
			`blogs?filters[page][slug][$eq]=${pageSlug}&populate=*&pagination[pageSize]=100`,
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching blogs by page - check Strapi permissions for blogs collection:",
			error,
		);
		return [];
	}
}

// Tutoring Profile Types
export interface StrapiTutoringProfile {
	id: number;
	documentId: string;
	name: string;
	title: string;
	content: StrapiBlock[];
	experties: string; // Note: keeping the typo from API
	price: number;
	successRate: number;
	studentCount: number;
	exprienceYears: number; // Note: keeping the typo from API
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	subjects: StrapiSubject[];
	profilePicture: StrapiImage;
}

// Tutoring Profile API functions
export async function getTutoringProfiles(): Promise<StrapiTutoringProfile[]> {
	try {
		const response = await fetchStrapiData<StrapiResponse<StrapiTutoringProfile[]>>(
			"tutoring-profiles?populate=*",
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching tutoring profiles - check Strapi permissions:", error);
		return [];
	}
}

// Contact Page Types
export interface StrapiSocialMediaLink {
	id: number;
	platform: string;
	url: string;
}

export interface StrapiContactPage {
	id: number;
	documentId: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	phone: string;
	email: string;
	address: string;
}

export interface ContactFormData {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	category: string;
}

// Contact Page API functions
export async function getContactPage(): Promise<StrapiContactPage> {
	try {
		const response =
			await fetchStrapiData<StrapiResponse<StrapiContactPage>>("contact-page?populate=*");
		return response.data;
	} catch (error) {
		console.error("Error fetching contact page - check Strapi permissions:", error);
		throw error;
	}
}
