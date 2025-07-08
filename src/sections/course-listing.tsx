"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StrapiCourse } from "@/lib/strapi";
import { Clock, Users, Star, Play } from "lucide-react";

interface ListCoursesProps {
    courses: StrapiCourse[];
    title: string;
}

export default function ListCourses({ courses, title }: ListCoursesProps) {
    return (
        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {course.grades.map((grade) => ( 
                            <Badge key={grade.id} variant="secondary">{grade.name}</Badge>
                          ))}
                          <Badge variant="outline">{course.slug}</Badge>
                        </div>
                        <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>12</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>2.0</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
    )
}