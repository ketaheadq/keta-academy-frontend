"use client";

import { use } from "react";
import CourseGrid from "@/components/grids/course-grid-wrapper";
import type { StrapiGrade } from "@/lib/strapi";
import { getCourses, getGrades, getSettings, getSubjects } from "@/lib/strapi";
import BrowseBySubject from "@/sections/browse-by-subject";
import Continue from "@/sections/continue-wrapper";
import ListCourses from "@/sections/course-listing-wrapper";
import CoursesError from "./courses-error";

export default function Courses() {
  // Fetch data safely with .catch fallbacks
  const settings = use(getSettings().catch(() => null));
  const subjects = use(getSubjects().catch(() => []));
  const courses = use(getCourses().catch(() => []));
  const grades = use(getGrades().catch(() => []));

  // Show error if settings not loaded
  if (!settings) {
    return <CoursesError />;
  }

  // Process grade names
  const gradeNames = grades
    .filter((grade: StrapiGrade) => grade?.title)
    .sort((a: StrapiGrade, b: StrapiGrade) => a.order - b.order)
    .map((grade: StrapiGrade) => grade.title)
    .filter((title, index, array) => array.indexOf(title) === index);

  // Filter popular courses
  const popularCourses = courses.filter((course) => course.isPopular);

  return (
    <section className="relative py-10 md:py-16">
      {/* Background */}
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-tr from-indigo-400/15 to-blue-400/15 blur-3xl" />

      {/* Conditionally Render Sections Only When Data Exists */}

      {/* Continue Section – only if user has progress */}
      {courses.length > 0 && (
        <div className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <Continue courses={courses} />
        </div>
      )}

      {/* All Courses Grid */}
      {courses.length > 0 && (
        <div className="animate-slideUp" style={{ animationDelay: "0.4s" }}>
          <CourseGrid
            courses={courses}
            grades={gradeNames}
            topics={subjects.map((subject) => subject.title)}
            title="📚 Tüm Dersler"
          />
        </div>
      )}

      {/* Popular Courses – only if any course is marked as popular */}
      {popularCourses.length > 0 && (
        <div className="animate-slideUp" style={{ animationDelay: "0.6s" }}>
          <ListCourses courses={popularCourses} title="🔥 Popüler Dersler" />
        </div>
      )}

      {/* Browse by Subject – only if subjects exist */}
      {subjects.length > 0 && (
        <div className="animate-slideUp" style={{ animationDelay: "0.8s" }}>
          <BrowseBySubject subjects={subjects} />
        </div>
      )}
    </section>
  );
}
