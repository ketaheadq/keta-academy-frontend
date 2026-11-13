"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

interface AuthSectionProps {
	mobile?: boolean;
	onNavigate?: () => void;
}

export default function AuthSection({ mobile = false, onNavigate }: Readonly<AuthSectionProps>) {
	const { user, isAuthenticated, signOut } = useAuthStore();

	const handleSignOut = async () => {
		await signOut();
		onNavigate?.();
	};

	const handleLinkClick = () => {
		onNavigate?.();
	};

	const avatar = user?.picture ? (
		<Image
			src={user.picture}
			alt=""
			width={32}
			height={32}
			className="h-8 w-8 shrink-0 rounded-full border-2 object-cover"
		/>
	) : (
		<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
			<User className="h-4 w-4 text-background" aria-hidden="true" />
		</div>
	);

	if (mobile && isAuthenticated && user) {
		return (
			<div className="rounded-xl border border-border bg-secondary/40 p-3">
				<div className="flex items-center gap-3 px-1">
					{avatar}
					<div className="min-w-0 wrap-anywhere">
						<p className="font-semibold text-foreground text-sm">{user.name}</p>
						<p className="text-muted-foreground text-xs">{user.email}</p>
					</div>
				</div>
				<div className="mt-3 space-y-1 border-border border-t pt-2">
					<Link
						href="/derslerim"
						onClick={handleLinkClick}
						className="flex min-h-11 items-center rounded-lg px-2 font-medium text-foreground text-sm hover:bg-secondary"
					>
						Derslerim
					</Link>
					<button
						type="button"
						onClick={handleSignOut}
						className="flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left font-medium text-destructive text-sm hover:bg-secondary"
					>
						<LogOut className="h-4 w-4" aria-hidden="true" />
						Çıkış Yap
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center space-x-4">
			{isAuthenticated && user ? (
				// User is logged in - show user info and logout
				<div className="flex items-center space-x-4">
					{/* User Profile Dropdown */}
					<div className="group relative">
						<button
							type="button"
							className="flex items-center space-x-2 text-muted-foreground transition-colors hover:text-background"
						>
							{avatar}
							<span className="font-medium">{user.name}</span>
							<ChevronDown className="h-4 w-4" />
						</button>

						{/* Dropdown Menu */}
						<div className="invisible absolute top-full right-0 z-50 mt-2 w-48 rounded-md border bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
							<div className="py-2">
								<div className="border-border border-b px-4 py-2">
									<p className="font-medium text-foreground text-sm">{user.name}</p>
									<p className="text-muted-foreground text-xs">{user.email}</p>
								</div>
								<Link
									href="/derslerim"
									onClick={handleLinkClick}
									className="block px-4 py-2 text-muted-foreground text-sm hover:bg-secondary hover:text-primary-foreground"
								>
									Derslerim
								</Link>
								<button
									type="button"
									onClick={handleSignOut}
									className="flex w-full items-center space-x-2 px-4 py-2 text-left text-muted-foreground text-sm hover:bg-secondary hover:text-destructive"
								>
									<LogOut className="h-4 w-4" />
									<span>Çıkış Yap</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			) : (
				// User is not logged in - show login/signup buttons
				<>
					<Link href="/giris" onClick={handleLinkClick}>
						<Button
							variant="ghost"
							className="font-medium text-text transition-colors hover:text-background"
						>
							Giriş Yap
						</Button>
					</Link>
					<Link href="/kayit-ol" onClick={handleLinkClick}>
						<Button className="rounded-lg bg-primary px-4 py-2 text-background transition-colors hover:bg-primary">
							Üye Ol
						</Button>
					</Link>
				</>
			)}
		</div>
	);
}
