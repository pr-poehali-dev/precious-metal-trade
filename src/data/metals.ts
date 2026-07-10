export const SELL_ITEMS = [
  { id: "gold", name: "Золото", symbol: "XAU", purity: "999.9", defaultPrice: 10314, img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/d4adee9f-63bd-4111-9624-ed7b47e7154f.jpg" },
  { id: "silver", name: "Серебро", symbol: "XAG", purity: "999", defaultPrice: 171, img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/9e2715fb-de1f-43b0-a923-a1f70c44791f.jpg" },
  { id: "gold585", name: "Лом Золото", symbol: "AU", purity: "585", defaultPrice: 6100, img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/363a4f64-874a-4469-a531-2a489685e54d.jpg" },
];

export const METALS = [
  {
    id: "gold",
    name: "Золото",
    symbol: "XAU",
    price: 7842.50,
    change: +1.24,
    unit: "за грамм",
    img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/9f8fc474-95d4-4d76-9e4b-ff5bed8c09e8.jpg",
    desc: "Инвестиционное золото высшей пробы 999.9. Мерные слитки и монеты.",
    purity: "999.9",
    minWeight: "1 г",
    chartPoints: [120, 118, 125, 122, 130, 128, 135, 133, 140, 138, 145],
  },
  {
    id: "silver",
    name: "Серебро",
    symbol: "XAG",
    price: 92.30,
    change: -0.47,
    unit: "за грамм",
    img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/e29aa351-29f9-429b-bf8d-575ff5280a0e.jpg",
    desc: "Серебро 999 пробы в слитках и монетах. Промышленное и инвестиционное.",
    purity: "999",
    minWeight: "10 г",
    chartPoints: [100, 98, 102, 99, 97, 95, 96, 94, 93, 92, 92],
  },
];
