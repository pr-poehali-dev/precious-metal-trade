export type Section = "home" | "catalog" | "sell" | "about" | "contacts";

export interface NavItem {
  key: Section;
  label: string;
}
