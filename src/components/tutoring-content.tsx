"use client";

import { Award, Globe, Heart, MessageCircle, Search, Shield, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { StrapiTutoringProfile } from "@/lib/strapi";
import { generateSimpleId } from "@/lib/utils";
import { Button } from "./ui/button";

function TutorCard({ tutor }: Readonly<{ tutor: StrapiTutoringProfile }>) {
	const [showDetails, setShowDetails] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);

	// Parse expertise string into array
	const expertiseList = tutor.experties ? tutor.experties.split(",") : [];
	console.log(tutor.experties);
	const router = useRouter();
	return (
		<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
			{/* Header */}
			<div className="relative p-6 pb-4">
				<div className="flex items-start gap-4">
					<div className="relative">
						<div className="relative h-20 w-20">
							<Image
								src={tutor.profilePicture?.url || "/placeholder.svg"}
								alt={tutor.name}
								fill
								className="rounded-full border-4 border-white object-cover shadow-lg"
							/>
						</div>
						<div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-2 border-white bg-green-500" />
						<div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
							<Shield className="h-3 w-3 text-white" />
						</div>
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between">
							<div>
								<h3 className="mb-1 font-bold text-gray-900 text-xl">{tutor.name}</h3>
								<p className="mb-2 font-medium text-blue-600">{tutor.title}</p>
							</div>

							<button
								type="button"
								onClick={() => setIsFavorite(!isFavorite)}
								className={`rounded-full p-2 transition-colors ${
									isFavorite
										? "bg-red-100 text-red-600"
										: "bg-gray-100 text-gray-400 hover:text-red-500"
								}`}
							>
								<Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
							</button>
						</div>

						<div className="mb-3 flex flex-wrap gap-2">
							{tutor.subjects.slice(0, 2).map((subject) => (
								<span
									key={generateSimpleId()}
									className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs"
								>
									{subject.title}
								</span>
							))}
							{tutor.subjects.length > 2 && (
								<span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600 text-xs">
									+{tutor.subjects.length - 2} daha
								</span>
							)}
						</div>
					</div>
				</div>

				<p className="mt-3 text-gray-600 text-sm leading-relaxed">
					{tutor.experties} alanlarında uzman öğretmen. {tutor.exprienceYears} yıllık deneyimle
					öğrencilere kaliteli eğitim sunmaktadır.
				</p>
			</div>

			{/* Stats */}
			<div className="px-6 pb-4">
				<div className="grid grid-cols-3 gap-4 text-center">
					<div className="rounded-lg bg-green-50 p-3">
						<div className="font-bold text-green-600 text-lg">{tutor.successRate}%</div>
						<div className="text-gray-600 text-xs">Başarı Oranı</div>
					</div>
					<div className="rounded-lg bg-blue-50 p-3">
						<div className="font-bold text-blue-600 text-lg">{tutor.studentCount}</div>
						<div className="text-gray-600 text-xs">Öğrenci</div>
					</div>
					<div className="rounded-lg bg-purple-50 p-3">
						<div className="font-bold text-lg text-purple-600">{tutor.exprienceYears}</div>
						<div className="text-gray-600 text-xs">Yıl Deneyim</div>
					</div>
				</div>
			</div>

			{/* Quick Info */}
			<div className="px-6 pb-4">
				<div className="flex items-center justify-between">
					<div className="font-bold text-2xl text-gray-900">
						₺{tutor.price}
						<span className="font-normal text-gray-600 text-sm">/saat</span>
					</div>
					<div className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
						Çevrimiçi
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="px-6 pb-6">
				<div className="flex gap-2">
					<Button
						onClick={() => router.push("/iletisim")}
						className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
					>
						<MessageCircle className="h-4 w-4" />
						Bize Ulaşın
					</Button>
				</div>

				<button
					type="button"
					onClick={() => setShowDetails(!showDetails)}
					className="mt-2 w-full py-2 font-medium text-blue-600 text-sm hover:text-blue-700"
				>
					{showDetails ? "Daha Az Göster" : "Detayları Göster"}
				</button>
			</div>

			{/* Expanded Details */}
			{showDetails && (
				<div className="border-gray-100 border-t bg-gray-50 px-6 py-6">
					{/* Education & Achievements */}
					<div className="mb-6">
						<h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
							<Award className="h-4 w-4" />
							Uzmanlık Alanları
						</h4>
						<div className="flex flex-wrap gap-2">
							{expertiseList.map((expertise) => (
								<span
									key={generateSimpleId()}
									className="rounded-full border bg-white px-3 py-1 text-gray-700 text-sm"
								>
									{expertise}
								</span>
							))}
						</div>
					</div>

					{/* Subjects */}
					<div className="mb-6">
						<h4 className="mb-3 font-semibold text-gray-900">Verdiği Dersler</h4>
						<div className="flex flex-wrap gap-2">
							{tutor.subjects.map((subject) => (
								<span
									key={generateSimpleId()}
									className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 text-sm"
								>
									{subject.title}
								</span>
							))}
						</div>
					</div>

					{/* Languages */}
					<div className="mb-6">
						<h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
							<Globe className="h-4 w-4" />
							Diller
						</h4>
						<div className="flex gap-2">
							<span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 text-sm">
								Türkçe
							</span>
							<span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 text-sm">
								İngilizce
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default function TutoringContent({ data }: Readonly<{ data: StrapiTutoringProfile[] }>) {
	const tutors = data;
	const [selectedSubject, setSelectedSubject] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("rating");

	// Generate subjects dynamically from tutors
	const subjects = [
		{ id: "all", name: "Tüm Dersler", count: tutors.length },
		...tutors.reduce((acc: any[], tutor) => {
			tutor.subjects.forEach((subject) => {
				const existing = acc.find((s) => s.id === subject.slug);
				if (existing) {
					existing.count++;
				} else {
					acc.push({
						id: subject.slug,
						name: subject.title,
						count: 1,
					});
				}
			});
			return acc;
		}, []),
	];

	const filteredTutors = tutors
		.filter((tutor) => {
			const matchesSubject =
				selectedSubject === "all" ||
				tutor.subjects.some((subject) => subject.slug === selectedSubject);
			const matchesSearch =
				tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tutor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tutor.experties.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesSubject && matchesSearch;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "rating":
					return b.successRate - a.successRate;
				case "price":
					return a.price - b.price;
				case "experience":
					return b.exprienceYears - a.exprienceYears;
				default:
					return 0;
			}
		});

	return (
		<div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
			{/* Filters */}
			<div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					{/* Subject Filters */}
					<div className="flex flex-wrap gap-2">
						{subjects.map((subject) => (
							<button
								type="button"
								key={subject.id}
								onClick={() => setSelectedSubject(subject.id)}
								className={`rounded-full px-4 py-2 font-medium text-sm transition-all ${
									selectedSubject === subject.id
										? "scale-105 bg-blue-600 text-white shadow-lg"
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
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<input
								type="text"
								placeholder="Öğretmen ara..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="rounded-xl border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="rounded-xl border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						>
							<option value="rating">Başarı Oranına Göre</option>
							<option value="price">Fiyata Göre</option>
							<option value="experience">Deneyime Göre</option>
						</select>
					</div>
				</div>
			</div>

			{/* Tutors Grid */}
			<div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
				{filteredTutors.map((tutor) => (
					<TutorCard key={tutor.id} tutor={tutor} />
				))}
			</div>

			{/* Empty State */}
			{filteredTutors.length === 0 && (
				<div className="py-16 text-center">
					<div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
						<Users className="h-12 w-12 text-gray-400" />
					</div>
					<h3 className="mb-4 font-bold text-2xl text-gray-900">Öğretmen bulunamadı</h3>
					<p className="mx-auto mb-6 max-w-md text-gray-600">
						Arama kriterlerinizi değiştirmeyi deneyin veya tüm öğretmenleri görüntüleyin
					</p>
					<button
						type="button"
						onClick={() => {
							setSelectedSubject("all");
							setSearchQuery("");
						}}
						className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
					>
						Filtreleri Temizle
					</button>
				</div>
			)}
		</div>
	);
}
