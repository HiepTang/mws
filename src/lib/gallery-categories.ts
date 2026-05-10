/**
 * Gallery categories shared by the admin form, the review-approval picker,
 * and the public /gallery tabs. Single source of truth so everything stays
 * in sync.
 */

export const GALLERY_CATEGORIES = [
  { value: "tea_ceremony", en: "Tea Ceremony", vi: "Lễ trà" },
  { value: "ao_dai", en: "Áo Dài", vi: "Áo dài" },
  { value: "reception", en: "Reception", vi: "Tiệc cưới" },
  { value: "family", en: "Family", vi: "Gia đình" },
  { value: "details", en: "Details", vi: "Chi tiết" },
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]["value"];

const VALID = new Set<string>(GALLERY_CATEGORIES.map((c) => c.value));

export function isGalleryCategory(v: string | undefined | null): v is GalleryCategory {
  return !!v && VALID.has(v);
}

export function categoryLabel(value: string, lang: "en" | "vi" = "en"): string {
  const c = GALLERY_CATEGORIES.find((x) => x.value === value);
  return c ? c[lang] : value;
}
