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

export interface StrapiSubject {
  id: number;
  documentId: string;
  name: string;
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
  videoURL: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiCourseLesson {
  id: number;
  documentId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  lesson: StrapiLesson;
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
  name: string;
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
  text: string;
  isCorrect: boolean;
  order?: number;
}

// Question Types
export type QuestionType = 'multipleChoice' | 'trueFalse';

// Question Type
export interface StrapiQuestion {
  id: number;
  documentId: string;
  text: StrapiBlock[];
  type: QuestionType;
  explanation?: StrapiBlock[];
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
  return data && data.data && typeof data.data.id === 'number' && data.data.title;
};

export const isQuizCollectionResponse = (data: any): data is StrapiCollectionResponse<StrapiQuiz> => {
  return data && Array.isArray(data.data) && data.meta && data.meta.pagination;
};

// Quiz-related API functions
export async function getQuizzes() {
  const url = `${STRAPI_URL}/api/quizzes?populate=*`;
  console.log('Fetching quizzes from:', url);
  
  const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>('quizzes?populate=*');
  return response.data;
}

export async function getQuizBySlug(slug: string) {
  const url = `${STRAPI_URL}/api/quizzes?filters[slug][$eq]=${slug}&populate=*`;
  console.log('Fetching quiz by slug from:', url);
  
  const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>(`quizzes?filters[slug][$eq]=${slug}&populate=*`);
  return response.data[0]; // Return first match
}

export async function getQuizzesBySubject(subjectSlug: string) {
  const url = `${STRAPI_URL}/api/quizzes?filters[subject][slug][$eq]=${subjectSlug}&populate=*`;
  console.log('Fetching quizzes by subject from:', url);
  
  const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>(`quizzes?filters[subject][slug][$eq]=${subjectSlug}&populate=*`);
  return response.data;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchStrapiData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Strapi data:', error);
    throw error;
  }
}

export async function getSettings(): Promise<StrapiSettings> {
  const response = await fetchStrapiData<StrapiResponse<StrapiSettings>>('setting?populate=*');
  return response.data;
}

export async function getSubjects() {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subjects?populate=icon`;
    console.log('Fetching subjects from:', url);
    
    const response = await fetchStrapiData<StrapiResponse<StrapiSubject[]>>('subjects?populate=icon');
    return response.data;
}

export async function getGrades() {
    const url = `${STRAPI_URL}/api/grades`;
    console.log('Fetching grades from:', url);
    
    const response = await fetchStrapiData<StrapiResponse<StrapiGrade[]>>('grades');
    return response.data;
}

export async function getCourses() {
    const url = `${STRAPI_URL}/api/courses?populate=*`;
    console.log('Fetching courses from:', url);
    
    const response = await fetchStrapiData<StrapiResponse<StrapiCourse[]>>('courses?populate=*');
    return response.data;

} 

export async function getSubjectBySlug(slug: string) {
  const subjects = await getSubjects();
  return subjects.find((subject: StrapiSubject) => subject.slug === slug);
}

// Privacy Policy and Terms API functions
export async function getPrivacyPolicy(): Promise<StrapiPrivacyPolicy> {
  const response = await fetchStrapiData<StrapiResponse<StrapiPrivacyPolicy>>('privacy-policy');
  return response.data;
}

export async function getTermsAndCondition(): Promise<StrapiTermsOfService> {
  const response = await fetchStrapiData<StrapiResponse<StrapiTermsOfService>>('term-and-condition');
  return response.data;
}