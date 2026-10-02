/**
 * Gallery categories shared by the admin form, the review-approval picker,
 * and the public /gallery tabs. Single source of truth so everything stays
 * in sync.
 *
 * "reception" and "family" were merged into one public tab ("Reception &
 * Family"). Existing DB rows may still carry the legacy "family" value, so
 * readers should treat it as an alias of "reception" (see
 * categoryValuesFor).
 */

export const GALLERY_CATEGORIES = [
  { value: "tea_ceremony", en: "Tea Ceremony", vi: "Lễ trà" },
  { value: "ao_dai", en: "Áo Dài", vi: "Áo dài" },
  { value: "reception", en: "Reception & Family", vi: "Tiệc cưới & gia đình" },
  { value: "details", en: "Details", vi: "Chi tiết" },
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]["value"];

const VALID = new Set<string>(GALLERY_CATEGORIES.map((c) => c.value));

export function isGalleryCategory(v: string | undefined | null): v is GalleryCategory {
  return !!v && VALID.has(v);
}

/** DB values matched by a tab — "reception" also matches legacy "family" rows. */
export function categoryValuesFor(tag: GalleryCategory): string[] {
  return tag === "reception" ? ["reception", "family"] : [tag];
}

export function categoryLabel(value: string, lang: "en" | "vi" = "en"): string {
  const effective = value === "family" ? "reception" : value;
  const c = GALLERY_CATEGORIES.find((x) => x.value === effective);
  return c ? c[lang] : value;
}
