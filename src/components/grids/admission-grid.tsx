"use client"

import DynamicGrid from "@/components/dynamic-grid"
import AdmissionScoreCard from "@/components/admission-score-card"
import { StrapiAdmissionScore } from "@/lib/strapi"
import { Calculator } from "lucide-react"

interface AdmissionGridProps {
  items: StrapiAdmissionScore[]
  title?: string
  showRelatedData?: boolean
}

export default function AdmissionGrid({ 
  items, 
  title = "Taban Puanlar",
  showRelatedData = false
}: AdmissionGridProps) {
  return (
    <DynamicGrid
      items={items}
      searchFields={['title']}
      filterConfigs={[]}
      renderItem={(admissionScore: StrapiAdmissionScore) => (
        <AdmissionScoreCard 
          key={admissionScore.id} 
          admissionScore={admissionScore} 
          showRelatedData={showRelatedData}
        />
      )}
      title={title}
      emptyStateConfig={{
        icon: <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />,
        title: 'Taban puan bulunamadı',
        description: 'Filtreleri değiştirerek taban puanları bulabilirsiniz.'
      }}
    />
  )
}