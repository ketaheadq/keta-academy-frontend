interface Ipages {
    id: string
    href: string
    displayName: string
}

export const pages: Ipages[] = [
    {
        displayName: "Özel Ders",
        href: "/ozel-ders",
        id: "1"
    },
    {
        displayName: "Dersler",
        href: "/kurslar",
        id : "2"
    }
]