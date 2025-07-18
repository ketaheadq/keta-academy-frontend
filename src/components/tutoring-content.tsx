"use client"

import { useState, useEffect } from "react"
import {
  Star,
  Clock,
  Users,
  Award,
  MessageCircle,
  Video,
  CheckCircle,
  Globe,
  Search,
  Calendar,
  Heart,
  Shield,
} from "lucide-react"
import { getTutoringProfiles, StrapiTutoringProfile } from "@/lib/strapi"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

function TutorCard({ tutor }: { tutor: StrapiTutoringProfile }) {
  const [showDetails, setShowDetails] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Parse experties string into array
  const expertiseList = tutor.experties ? tutor.experties.split(', ') : []

  const router = useRouter()
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={tutor.profilePicture?.url || "/placeholder.svg"}
              alt={tutor.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-green-500"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{tutor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{tutor.title}</p>
                
              </div>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {tutor.subjects.slice(0, 2).map((subject, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {subject.title}
                </span>
              ))}
              {tutor.subjects.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{tutor.subjects.length - 2} daha
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mt-3">
          {tutor.experties} alanlarında uzman öğretmen. {tutor.exprienceYears} yıllık deneyimle öğrencilere kaliteli eğitim sunmaktadır.
        </p>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">{tutor.successRate}%</div>
            <div className="text-xs text-gray-600">Başarı Oranı</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">{tutor.studentCount}</div>
            <div className="text-xs text-gray-600">Öğrenci</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-600">{tutor.exprienceYears}</div>
            <div className="text-xs text-gray-600">Yıl Deneyim</div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="px-6 pb-4">

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            ₺{tutor.price}
            <span className="text-sm font-normal text-gray-600">/saat</span>
          </div>
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Çevrimiçi
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <Button 
            onClick={() => router.push("/iletisim")}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Bize Ulaşın
          </Button>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium py-2"
        >
          {showDetails ? "Daha Az Göster" : "Detayları Göster"}
        </button>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-gray-100 px-6 py-6 bg-gray-50">
          {/* Education & Achievements */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Uzmanlık Alanları
            </h4>
            <div className="flex flex-wrap gap-2">
              {expertiseList.map((expertise, index) => (
                <span key={index} className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border">
                  {expertise}
                </span>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Verdiği Dersler</h4>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.map((subject, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {subject.title}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Diller
            </h4>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Türkçe</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">İngilizce</span>
            </div>
          </div>

          {/* Sample Testimonial */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Son Değerlendirmeler</h4>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Öğrenci</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{tutor.subjects[0]?.title}</span>
              </div>
              <p className="text-sm text-gray-700">
                Harika bir öğretmen! {tutor.name} sayesinde çok şey öğrendim ve başarılı oldum.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TutoringContent({data}: {data: StrapiTutoringProfile[]}) {
  const tutors = data
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")


  // Generate subjects dynamically from tutors
  const subjects = [
    { id: "all", name: "Tüm Dersler", count: tutors.length },
    ...tutors.reduce((acc: any[], tutor) => {
      tutor.subjects.forEach(subject => {
        const existing = acc.find(s => s.id === subject.slug)
        if (existing) {
          existing.count++
        } else {
          acc.push({
            id: subject.slug,
            name: subject.title,
            count: 1
          })
        }
      })
      return acc
    }, [])
  ]

  const filteredTutors = tutors
    .filter((tutor) => {
      const matchesSubject =
        selectedSubject === "all" || tutor.subjects.some((subject) => subject.slug === selectedSubject)
      const matchesSearch =
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.experties.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSubject && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.successRate - a.successRate
        case "price":
          return a.price - b.price
        case "experience":
          return b.exprienceYears - a.exprienceYears
        default:
          return 0
      }
    })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Subject Filters */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSubject === subject.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {subject.name} ({subject.count})
              </button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Öğretmen ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Başarı Oranına Göre</option>
              <option value="price">Fiyata Göre</option>
              <option value="experience">Deneyime Göre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {filteredTutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      {/* Empty State */}
      {filteredTutors.length === 0 && (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Öğretmen bulunamadı</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Arama kriterlerinizi değiştirmeyi deneyin veya tüm öğretmenleri görüntüleyin
          </p>
          <button
            onClick={() => {
              setSelectedSubject("all")
              setSearchQuery("")
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  )
} 