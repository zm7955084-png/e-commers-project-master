export function normalizeUrl(s?: string) {
    if (!s) return "";
    if (s.startsWith("//")) return `https:${s}`;
    if (s.startsWith("/")) {
        const base = process.env.NEXT_PUBLIC_API_BASE ?? "https://ecommerce.routemisr.com";
        return `${base.replace(/\/$/, "")}${s}`;
    }
    return s;
}

export function pickImage(item: any) {
    if (!item) return "";
    const candidates = [
        item.product?.imageCover,
        item.imageCover,
        item.image,
        (Array.isArray(item.images) && item.images[0]) || null,
        item.images?.[0],
        item.product?.images?.[0],
        item.imagesUrl?.[0],
        item.product?.image,
    ];

    for (const c of candidates) {
        if (c) return normalizeUrl(String(c));
    }

    return "";
}
