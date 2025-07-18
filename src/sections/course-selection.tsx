"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCourseIcon } from "@/lib/icons";
import { StrapiCourse, StrapiSubject } from "@/lib/strapi";

interface CourseSelectionProps {
  grades: string[];
  subjects: StrapiSubject[];
  coursesByGrade: { [grade: string]: (StrapiCourse & { progress: number })[] };
}

export default function CourseSelection({ grades, subjects, coursesByGrade }: CourseSelectionProps) {
  const [selectedGrade, setSelectedGrade] = useState(grades[0] || "");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const coursesForGrade = coursesByGrade[selectedGrade] || [];
  const filteredCourses = selectedSubject === "all" 
    ? coursesForGrade 
    : coursesForGrade.filter(course => course.subject.slug === selectedSubject);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        🎯 Sınıf ve Konu Seç:
      </h2>
      
      {/* Grade Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {grades.map((grade) => (
          <Button
            key={grade}
            variant={selectedGrade === grade ? "default" : "outline"}
            onClick={() => setSelectedGrade(grade)}
            className="text-sm"
          >
            {grade}
          </Button>
        ))}
      </div>

      {/* Subject Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedSubject === "all" ? "default" : "outline"}
          onClick={() => setSelectedSubject("all")}
          className="text-sm"
        >
          Tüm Konular
        </Button>
        {subjects.map((subject) => (
          <Button
            key={subject.id}
            variant={selectedSubject === subject.slug ? "default" : "outline"}
            onClick={() => setSelectedSubject(subject.slug)}
            className="text-sm"
          >
            {subject.title}
          </Button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const IconComponent = getCourseIcon(course.icon?.name || course.subject.slug);
          
          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>
                      {course.subject.title} • {course.duration} dakika
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>İlerleme</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
                <Button className="w-full">
                  {course.progress > 0 ? "Devam Et" : "Başla"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Bu sınıf ve konu için henüz ders bulunmuyor.</p>
        </div>
      )}
    </section>
  );
}