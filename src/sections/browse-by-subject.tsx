"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCourseIcon } from "@/lib/icons";
import { StrapiSubject } from "@/lib/strapi";


export default function BrowseBySubject({ subjects }: { subjects: StrapiSubject[] }) {
    return (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">📖 Derslere Göre Ara:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.map((subject) => {
              const IconComponent = subject.icon?.name ? getCourseIcon(subject.icon?.name) : undefined;
              return (
                <Card
                  key={subject.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    window.location.href = `/konular/${subject.slug}`
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-3 rounded-full mb-3 bg-blue-100">
                      {IconComponent && <IconComponent className="h-6 w-6 text-blue-600" />}
                    </div>
                    <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
    )
}