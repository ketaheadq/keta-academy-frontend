"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { StrapiCourse } from "@/lib/strapi";

interface ContinueProps {
    courses: (StrapiCourse & { progress: number })[];
}

export default function Continue({ courses }: ContinueProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    
    // Filter all courses with progress > 0
    const continueCourses = courses.filter(course => course.progress > 0);
    
    // Don't show if no courses in progress
    if (continueCourses.length === 0) {
        return null;
    }
    
    return (
        <>
        {isLoggedIn && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              📈 Kaldığın Yerden Devam Et:
            </h2>
            <div className={`grid ${continueCourses.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {continueCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Calculator className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>
                              {course.subject.name}
                            </CardDescription>
                          </div>
                        </div>
                        <Button size="sm">Resume</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        </>
    )
}