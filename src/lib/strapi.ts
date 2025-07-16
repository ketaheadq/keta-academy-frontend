// New types for Rich Text content
export interface StrapiRichTextBlock {
  type: string
  children: StrapiRichTextNode[]
}

export interface StrapiRichTextNode {
  type: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  children?: StrapiRichTextNode[]
  url?: string
  level?: number
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
  pages : StrapiPage[];
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
}

// Blog Types
export interface StrapiBlog {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: StrapiBlock[];
  related_datas?: StrapiBlog[];
  page?: StrapiPage;
  isPopular: boolean;
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
}

export interface StrapiPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  pageType: 'Üniversite Taban Puanları' | 'Bölüm Taban Puanları' | 'Videolar' | 'Bloglar' | 'Hesaplama Araçları';
  content: string;
  page_category?: StrapiPageCategory;
  admission_scores?: StrapiAdmissionScore[];
  videos?: StrapiVideo[];
  blogs?: StrapiBlog[];
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
  videoURL: string;
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
  
  const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>('quizzes?populate=*');
  return response.data;
}

export async function getQuizBySlug(slug: string) {
  const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>(`quizzes?filters[slug][$eq]=${slug}&populate=*`);
  return response.data[0]; // Return first match
}

export async function getQuizzesBySubject(subjectSlug: string) {
  const response = await fetchStrapiData<StrapiResponse<StrapiQuiz[]>>(`quizzes?filters[subject][slug][$eq]=${subjectSlug}&populate=*`);
  return response.data;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchStrapiDataUsingToken<T>(endpoint: string, token: string): Promise<T> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
export async function fetchStrapiData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.status === 403) {
      console.warn(`⚠️ Permission denied for endpoint: ${endpoint}. Please check Strapi permissions.`);
      // Return empty data structure for 403 errors
      return { data: [] } as T;
    }

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

export async function getPageCategories() {
  const response = await fetchStrapiData<StrapiResponse<StrapiPageCategory[]>>('page-categories?populate=*');
  return response.data;
}

export async function getPageBySlug(slug: string): Promise<StrapiPage | null> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiPage[]>>(`pages?filters[slug][$eq]=${slug}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

export async function getCourse(slug: string) {
  const response = await fetchStrapiData<StrapiResponse<StrapiCourse[]>>(`courses?populate=*&filters[slug][$eq]=${slug}`);
  return response.data[0];
}

export async function getLessonsByCourseId(courseId: number) {
  const response = await fetchStrapiData<StrapiCollectionResponse<StrapiCourseLesson>>(`course-lessons?populate=*&filters[course][id][$eq]=${courseId}`);
  return response.data.sort((a, b) => a.order - b.order);
}

export async function getAllCourseLessons(token: string) {
    const response = await fetchStrapiDataUsingToken<StrapiCollectionResponse<StrapiCourseLesson>>('course-lessons?populate=*', token);
    return response.data.sort((a, b) => a.order - b.order);
}

export async function getSubjects() {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subjects?populate=icon`;
    
    const response = await fetchStrapiData<StrapiResponse<StrapiSubject[]>>('subjects?populate=icon');
    return response.data;
}

export async function getGrades() {
    const url = `${STRAPI_URL}/api/grades`;
    
    const response = await fetchStrapiData<StrapiResponse<StrapiGrade[]>>('grades');
    return response.data;
}

export async function getCourses() {
    const url = `${STRAPI_URL}/api/courses?populate=*`;
    
    const response = await fetchStrapiData<StrapiResponse<StrapiCourse[]>>('courses?populate=*');
    return response.data;
} 

export async function getCoursesBySubject(subjectSlug: string) {
  const response = await fetchStrapiData<StrapiResponse<StrapiCourse[]>>(`courses?filters[subject][slug][$eq]=${subjectSlug}&populate=*`);
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

// Progress-related interfaces
export interface StrapiUserCourseProgress {
  documentId: string;
  id: number;
  user_plus_course_id: string; // Composite ID: user_id + "_" + course_id
  course_status: 'not_started' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface StrapiLessonProgress {
  id: number;
  documentId: string;
  user_plus_lesson_id: string; // Composite ID: user_id + "_" + lesson_id
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiQuizProgressData {
  documentId: string;
  id: number;
  user_plus_quiz_id: string; // Composite ID: user_id + "_" + quiz_id
  score?: number;
  quiz_status: 'not_started' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Update existing StrapiQuizProgress to match the new structure
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

// Progress API functions
export async function getUserCourseProgress(documentId: string, user_id: string, token: string): Promise<StrapiUserCourseProgress | null> {
  try {
    const response = await fetchStrapiDataUsingToken<StrapiResponse<StrapiUserCourseProgress[]>>(`user-course-progresses?filters[user_plus_course_id][$eq]=${user_id}_${documentId}`, token);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return null;
  }
}

export async function updateUserCourseProgress(documentId: string, user_id: string, status: 'not_started' | 'in_progress' | 'completed', token: string): Promise<StrapiUserCourseProgress | null> {
  try {
    const compositeId = `${user_id}_${documentId}`;

    console.log("compositeId", compositeId)
    
    // First, try to get existing progress
    const existingProgress = await getUserCourseProgress(documentId, user_id, token);
    
    console.log('Existing progress:', existingProgress);
    if (existingProgress) {
      // Update existing progress
      const response = await fetch(`${STRAPI_URL}/api/user-course-progresses/${existingProgress.documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            course_status: status
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update course progress: ${response.statusText}`);
      }

      return await response.json();
    } else {
      // Create new progress with composite ID
      const response = await fetch(`${STRAPI_URL}/api/user-course-progresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            user_plus_course_id: compositeId,
            course_status: status
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create course progress: ${response.statusText}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error updating course progress:', error);
    return null;
  }
}

export async function getUserLessonProgress(documentIds: string[], token: string): Promise<StrapiLessonProgress[]> {
  try {
    // We need to get the user ID from the token or pass it as a parameter
    // For now, let's try without filters to get all progress and filter manually
    try {
      const url = `${STRAPI_URL}/api/lesson-progresses`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('All lesson progress data:', data.data)
        
        // Filter by document IDs (we'll need to extract user_id from token or pass it)
        // For now, return all progress data and let the hook filter it
        return data.data
      } else {
        const errorData = await response.json()
        console.log('Error fetching lesson progress:', errorData)
        throw new Error(`Failed to fetch lesson progress: ${response.statusText}`)
      }
    } catch (error) {
      throw error
    }
  } catch (error) {
    console.error('Error fetching lesson progress:', error)
    return []
  }
}

export async function updateLessonProgress(documentId: string, user_id: string, isCompleted: boolean, token: string): Promise<StrapiLessonProgress | null> {
  try {
    const compositeId = `${user_id}_${documentId}`;
    
    // First, try to get existing progress
    const response = await fetch(`${STRAPI_URL}/api/lesson-progresses?filters[user_plus_lesson_id][$eq]=${compositeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lesson progress: ${response.statusText}`);
    }

    const data = await response.json();
    const existingProgress = data.data.length > 0 ? data.data[0] : null;

    if (existingProgress) {
      // Update existing progress
      const updateResponse = await fetch(`${STRAPI_URL}/api/lesson-progresses/${existingProgress.documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            isCompleted: isCompleted
          }
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update lesson progress: ${updateResponse.statusText}`);
      }

      return await updateResponse.json();
    } else {
      // Create new progress with composite ID
      const createResponse = await fetch(`${STRAPI_URL}/api/lesson-progresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            user_plus_lesson_id: compositeId,
            isCompleted: isCompleted
          }
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create lesson progress: ${createResponse.statusText}`);
      }

      return await createResponse.json();
    }
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return null;
  }
}

export async function getUserQuizProgress(quizId: number, token: string): Promise<StrapiQuizProgressData | null> {
  try {
    const compositeId = `${token}_${quizId}`;
    const response = await fetch(`${STRAPI_URL}/api/quiz-progresses?filters[user_plus_quiz_id][$eq]=${compositeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quiz progress: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching quiz progress:', error);
    return null;
  }
}

export async function updateQuizProgress(quizId: number, status: 'not_started' | 'in_progress' | 'completed', score?: number, token?: string): Promise<StrapiQuizProgressData | null> {
  if (!token) {
    console.error('No token provided for quiz progress update');
    return null;
  }

  try {
    const compositeId = `${token}_${quizId}`;
    
    // First, try to get existing progress
    const existingProgress = await getUserQuizProgress(quizId, token);
    
    if (existingProgress) {
      // Update existing progress
      const updateData: any = {
        quiz_status: status
      };
      
      if (score !== undefined) {
        updateData.score = score;
      }

      const response = await fetch(`${STRAPI_URL}/api/quiz-progresses/${existingProgress.documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updateData
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update quiz progress: ${response.statusText}`);
      }

      return await response.json();
    } else {
      // Create new progress with composite ID
      const createData: any = {
        user_plus_quiz_id: compositeId,
        quiz_status: status
      };
      
      if (score !== undefined) {
        createData.score = score;
      }

      const response = await fetch(`${STRAPI_URL}/api/quiz-progresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: createData
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create quiz progress: ${response.statusText}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error updating quiz progress:', error);
    return null;
  }
}

// Admission Score API functions
export async function getAdmissionScores(): Promise<StrapiAdmissionScore[]> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiAdmissionScore[]>>('admission-scores?populate=*');
    return response.data;
  } catch (error) {
    console.error('Error fetching admission scores - check Strapi permissions:', error);
    return [];
  }
}

export async function getAdmissionScoreBySlug(slug: string): Promise<StrapiAdmissionScore | null> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiAdmissionScore[]>>(`admission-scores?filters[slug][$eq]=${slug}&populate=*`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching admission score by slug - check Strapi permissions:', error);
    return null;
  }
}

export async function getAdmissionScoresByPage(pageSlug: string): Promise<StrapiAdmissionScore[]> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiAdmissionScore[]>>(`admission-scores?filters[page][slug][$eq]=${pageSlug}&populate=*`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admission scores by page - check Strapi permissions for admission-scores collection:', error);
    return [];
  }
}

// Video API functions
export async function getVideos(): Promise<StrapiVideo[]> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiVideo[]>>('videos?populate=*');
    return response.data;
  } catch (error) {
    console.error('Error fetching videos - check Strapi permissions:', error);
    return [];
  }
}

export async function getVideoBySlug(slug: string): Promise<StrapiVideo | null> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiVideo[]>>(`videos?filters[slug][$eq]=${slug}&populate=*`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching video by slug - check Strapi permissions:', error);
    return null;
  }
}

export async function getVideosByPage(pageSlug: string): Promise<StrapiVideo[]> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiVideo[]>>(`videos?filters[page][slug][$eq]=${pageSlug}&populate=*`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos by page - check Strapi permissions for videos collection:', error);
    return [];
  }
}

// Blog API functions
export async function getBlogs(): Promise<StrapiBlog[]> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiBlog[]>>('blogs?populate=*');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs - check Strapi permissions:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<StrapiBlog | null> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiBlog[]>>(`blogs?filters[slug][$eq]=${slug}&populate=*`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching blog by slug - check Strapi permissions:', error);
    return null;
  }
}

export async function getBlogsByPage(pageSlug: string): Promise<StrapiBlog[]> {
  try {
    const response = await fetchStrapiData<StrapiResponse<StrapiBlog[]>>(`blogs?filters[page][slug][$eq]=${pageSlug}&populate=*`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs by page - check Strapi permissions for blogs collection:', error);
    return [];
  }
}
