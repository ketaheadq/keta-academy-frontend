"use client";

import { CheckCircle, Send } from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormData } from "@/lib/strapi";

export default function ContactForm() {
	const [formData, setFormData] = useState<ContactFormData>({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
		category: "general",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Generate unique IDs for each field
	const categoryId = useId();
	const nameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const subjectId = useId();
	const messageId = useId();

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsSubmitting(false);
		setIsSubmitted(true);

		// Reset form after 3 seconds
		setTimeout(() => {
			setIsSubmitted(false);
			setFormData({
				name: "",
				email: "",
				phone: "",
				subject: "",
				message: "",
				category: "general",
			});
		}, 3000);
	};

	return (
		<Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
			<CardHeader className="pb-6">
				<CardTitle className="text-2xl text-gray-800">Bize Mesaj Gönderin</CardTitle>
				<CardDescription className="text-base">
					Formu doldurarak bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isSubmitted ? (
					<div className="py-12 text-center">
						<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
							<CheckCircle className="h-10 w-10 text-green-600" />
						</div>
						<h3 className="mb-2 font-semibold text-2xl text-gray-800">Mesajınız Gönderildi!</h3>
						<p className="mb-4 text-gray-600">
							Teşekkür ederiz. En kısa sürede size dönüş yapacağız.
						</p>
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							24 saat içinde yanıt vereceğiz
						</Badge>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Category Selection */}
						<div>
							<label htmlFor={categoryId} className="mb-2 block font-medium text-gray-700 text-sm">
								Konu Kategorisi
							</label>
							<select
								id={categoryId}
								name="category"
								value={formData.category}
								onChange={handleInputChange}
								className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
								required
							>
								<option value="general">Genel Bilgi</option>
								<option value="support">Teknik Destek</option>
								<option value="tutoring">Özel Ders</option>
								<option value="partnership">İş Birliği</option>
								<option value="feedback">Geri Bildirim</option>
							</select>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							{/* Name */}
							<div>
								<label htmlFor={nameId} className="mb-2 block font-medium text-gray-700 text-sm">
									Ad Soyad *
								</label>
								<Input
									id={nameId}
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Adınızı ve soyadınızı girin"
									className="h-12"
									required
								/>
							</div>

							{/* Email */}
							<div>
								<label htmlFor={emailId} className="mb-2 block font-medium text-gray-700 text-sm">
									E-posta *
								</label>
								<Input
									id={emailId}
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="E-posta adresinizi girin"
									className="h-12"
									required
								/>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							{/* Phone */}
							<div>
								<label htmlFor={phoneId} className="mb-2 block font-medium text-gray-700 text-sm">
									Telefon
								</label>
								<Input
									id={phoneId}
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
									placeholder="Telefon numaranızı girin"
									className="h-12"
								/>
							</div>

							{/* Subject */}
							<div>
								<label htmlFor={subjectId} className="mb-2 block font-medium text-gray-700 text-sm">
									Konu *
								</label>
								<Input
									id={subjectId}
									type="text"
									name="subject"
									value={formData.subject}
									onChange={handleInputChange}
									placeholder="Mesajınızın konusunu girin"
									className="h-12"
									required
								/>
							</div>
						</div>

						{/* Message */}
						<div>
							<label htmlFor={messageId} className="mb-2 block font-medium text-gray-700 text-sm">
								Mesaj *
							</label>
							<Textarea
								id={messageId}
								name="message"
								value={formData.message}
								onChange={handleInputChange}
								placeholder="Mesajınızı detaylı olarak yazın..."
								rows={6}
								className="resize-none"
								required
							/>
						</div>

						{/* Submit Button */}
						<div className="pt-4">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="h-12 w-full transform bg-linear-to-r from-blue-600 to-purple-600 font-semibold text-lg text-white transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 disabled:transform-none"
							>
								{isSubmitting ? (
									<div className="flex items-center gap-2">
										<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
										<span>Gönderiliyor...</span>
									</div>
								) : (
									<div className="flex items-center gap-2">
										<Send className="h-5 w-5" />
										<span>Mesajı Gönder</span>
									</div>
								)}
							</Button>
						</div>

						<p className="text-center text-gray-500 text-sm">
							Mesajınızı göndererek{" "}
							<a href="/privacy" className="text-blue-600 hover:underline">
								gizlilik politikamızı
							</a>{" "}
							kabul etmiş olursunuz.
						</p>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
