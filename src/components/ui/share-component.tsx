"use client";

import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { Share, Twitter, Facebook, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareComponentProps {
    className?: string;
}

const getSocialIcon = (platform: string) => {
    switch (platform) {
        case "twitter":
            return <Twitter className="h-8 w-8" />;
        case "facebook":
            return <Facebook className="h-8 w-8" />;
        case "whatsapp":
            return <MessageCircle className="h-8 w-8" />;
        case "tiktok":
            return (
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <title>Tiktok</title>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            );
        case "copy":
            return <Share className="h-8 w-8" />;
        default:
            return <Share className="h-8 w-8" />;
    }
};

const getSocialColor = (platform: string) => {
    switch (platform) {
        case "twitter":
            return "hover:bg-blue-100 hover:text-blue-600";
        case "facebook":
            return "hover:bg-blue-100 hover:text-blue-700";
        case "whatsapp":
            return "hover:bg-green-100 hover:text-green-600";
        case "tiktok":
            return "hover:bg-gray-900 hover:text-white";
        case "copy":
            return "hover:bg-gray-100 hover:text-gray-700";
        default:
            return "hover:bg-gray-100 hover:text-gray-700";
    }
};

const ShareComponent: FC<ShareComponentProps> = ({ className = "" }) => {
    const shareLink = (platform: string) => {
        const url = window.location.href;
        const title = document.title;
        const text = `${url}`;

        // Check if device supports native sharing
        if (navigator.share && /Mobile|Android|iP(hone|od|ad)|BlackBerry|IEMobile/.test(navigator.userAgent)) {
            navigator.share({
                title: title,
                text: text,
                url: url,
            })
                .then(() => console.log('Sharing successful'))
                .catch((error) => console.log('Sharing failed', error));
        } else {
            let shareUrl = '';
            switch (platform) {
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                    break;
                case 'tiktok':
                    // TikTok doesn't have a direct share URL, so we'll copy the link
                    navigator.clipboard.writeText(url).then(
                        () => toast.success('Link kopyalandı! TikTok\'ta paylaşabilirsiniz.')
                    );
                    return;
                case 'copy':
                    navigator.clipboard.writeText(url).then(
                        () => toast.success('Link kopyalandı!')
                    );
                    return;
                default:
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        }
    };

    const shareButtons = [
        { platform: 'copy', label: 'Linki Kopyala', visible: true },
        { platform: 'twitter', label: 'X', visible: false },
        { platform: 'facebook', label: 'Facebook', visible: false },
        { platform: 'whatsapp', label: 'WhatsApp', visible: false },
        { platform: 'tiktok', label: 'TikTok', visible: false },
    ];

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {shareButtons.map((button) => (
                <Button
                    key={button.platform}
                    variant="ghost"
                    size="lg"
                    className={`h-12 w-12 transition-all ${button.visible ? '' : 'hidden md:flex'} ${getSocialColor(button.platform)}`}
                    onClick={() => shareLink(button.platform)}
                >
                    {getSocialIcon(button.platform)}
                    <span className="sr-only">{button.label}</span>
                </Button>
            ))}
        </div>
    );
};

export default ShareComponent;
