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