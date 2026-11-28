"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { dropdownDown } from "@/lib/motion";
import { useAuthStore } from "@/stores/auth-store";

interface AuthSectionProps {
	mobile?: boolean;
	onNavigate?: () => void;
}

/** Closing is delayed so moving the pointer from the trigger to the panel does not dismiss it. */
const CLOSE_DELAY_MS = 140;

export default function AuthSection({ mobile = false, onNavigate }: Readonly<AuthSectionProps>) {
	const { user, isAuthenticated, signOut } = useAuthStore();
	const [menuOpen, setMenuOpen] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const keepOpen = () => {
		clearTimeout(closeTimer.current);
		setMenuOpen(true);
	};
	const scheduleClose = () => {
		closeTimer.current = setTimeout(() => setMenuOpen(false), CLOSE_DELAY_MS);
	};
	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === "Escape") setMenuOpen(false);
	};

	useEffect(() => () => clearTimeout(closeTimer.current), []);

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
		<div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
			<User className="text-background h-4 w-4" aria-hidden="true" />
		</div>
	);

	if (mobile && isAuthenticated && user) {
		return (
			<div className="border-border bg-secondary/40 rounded-xl border p-3">
				<div className="flex items-center gap-3 px-1">
					{avatar}
					<div className="min-w-0 wrap-anywhere">
						<p className="text-foreground text-sm font-semibold">{user.name}</p>
						<p className="text-muted-foreground text-xs">{user.email}</p>
					</div>
				</div>
				<div className="border-border mt-3 space-y-1 border-t pt-2">
					<Link
						href="/derslerim"
						onClick={handleLinkClick}
						className="dropdown-item text-foreground flex min-h-11 items-center rounded-lg px-2 text-sm font-medium"
					>
						Derslerim
					</Link>
					<button
						type="button"
						onClick={handleSignOut}
						className="text-destructive hover:bg-secondary flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-sm font-medium transition-colors"
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
					<div className="relative">
						<button
							type="button"
							aria-expanded={menuOpen}
							aria-haspopup="menu"
							onMouseEnter={keepOpen}
							onMouseLeave={scheduleClose}
							onFocus={keepOpen}
							onBlur={scheduleClose}
							onKeyDown={handleKeyDown}
							className="accent-link text-muted-foreground flex items-center space-x-2 rounded"
						>
							{avatar}
							<span className="font-medium">{user.name}</span>
							<m.span
								animate={{ rotate: menuOpen ? 180 : 0 }}
								transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
								aria-hidden="true"
								className="flex"
							>
								<ChevronDown className="h-4 w-4" />
							</m.span>
						</button>

						{/* Dropdown Menu */}
						<AnimatePresence>
							{menuOpen && (
								<m.div
									initial="initial"
									animate="animate"
									exit="exit"
									variants={dropdownDown}
									role="menu"
									onMouseEnter={keepOpen}
									onMouseLeave={scheduleClose}
									onFocus={keepOpen}
									onBlur={scheduleClose}
									onKeyDown={handleKeyDown}
									className="bg-popover absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-md border shadow-lg"
								>
									<div className="py-2">
										<div className="border-border border-b px-4 py-2">
											<p className="text-foreground text-sm font-medium">{user.name}</p>
											<p className="text-muted-foreground text-xs">{user.email}</p>
										</div>
										<Link
											role="menuitem"
											href="/derslerim"
											onClick={() => {
												setMenuOpen(false);
												handleLinkClick();
											}}
											className="dropdown-item text-muted-foreground block px-4 py-2 text-sm"
										>
											Derslerim
										</Link>
										<button
											type="button"
											role="menuitem"
											onClick={handleSignOut}
											className="text-muted-foreground hover:bg-secondary hover:text-destructive flex w-full items-center space-x-2 px-4 py-2 text-left text-sm transition-colors"
										>
											<LogOut className="h-4 w-4" />
											<span>Çıkış Yap</span>
										</button>
									</div>
								</m.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			) : (
				// User is not logged in - show login/signup buttons
				<>
					<Link href="/giris" onClick={handleLinkClick}>
						<Button variant="ghost" className="text-foreground font-medium">
							Giriş Yap
						</Button>
					</Link>
					<Link href="/kayit-ol" onClick={handleLinkClick}>
						<Button className="bg-primary text-primary-foreground hover:bg-primary rounded-lg px-4 py-2 transition-all hover:scale-[1.03] active:scale-[0.97]">
							Üye Ol
						</Button>
					</Link>
				</>
			)}
		</div>
	);
}
