export interface AdRow {
  id: string;
  name: string;
  thumb: "photo" | "logo";
  on: boolean;
  delivery: "learning" | "preparing" | "active" | "off";
  recommendations?: number;
  hasExport?: boolean;
  results: number | null;
  resultLabel: string;
  costPerResult: number | null;
  costLabel: string;
  amountSpent: number;
  impressions: number | null;
  reach: number | null;
  frequency: number | null;
  cpm: number | null;
  linkClicks: number | null;
  ends: string;
  attribution: string;
  attributionSub: string;
  bidStrategy: string;
  bidStrategySub: string;
  lastEdit: string;
  lastEditSub: string;
  qualityRanking: string | null;
  qualityRankingSub?: string;
  engagementRanking: string | null;
  engagementRankingSub?: string;
  conversionRanking: string | null;
  conversionRankingSub?: string;
  adSetName: string;
  adSetSub: string;
}

const ATTR = "7-day click or …";
const ATTR_SUB = "All conversions";
const EDIT = "15 Jul 2026, 12:30";
const EDIT31 = "15 Jul 2026, 12:31";
const BELOW35 = "Bottom 35% of a…";
const BELOW20 = "Bottom 20% of a…";

const base = {
  attribution: ATTR,
  attributionSub: ATTR_SUB,
  bidStrategy: "Highest volume",
  bidStrategySub: "Leads",
  ends: "Ongoing",
  lastEditSub: "Today",
  costLabel: "Per lead (form)",
};

/** Ads inside ad set "Gurgaon – Ip –5" (10 ads) */
export const adsForAdSet: AdRow[] = [
  {
    ...base, id: "d1", name: "Static 5 – Copy 2", thumb: "photo", on: true,
    delivery: "learning", hasExport: true,
    results: 1, resultLabel: "Lead (Form)", costPerResult: 1728.5,
    amountSpent: 1728.5, impressions: 2289, reach: 1820, frequency: 1.26,
    cpm: 755.13, linkClicks: 19, lastEdit: EDIT,
    qualityRanking: null, engagementRanking: null, conversionRanking: null,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d2", name: "Remix 4 – Copy", thumb: "logo", on: true,
    delivery: "learning", hasExport: true,
    results: 1, resultLabel: "Lead (Form)", costPerResult: 826.81,
    amountSpent: 826.81, impressions: 1484, reach: 1236, frequency: 1.2,
    cpm: 557.15, linkClicks: 6, lastEdit: EDIT,
    qualityRanking: "Below average", qualityRankingSub: BELOW35,
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d3", name: "Ai 1", thumb: "logo", on: true,
    delivery: "learning", hasExport: true,
    results: 1, resultLabel: "Lead (Form)", costPerResult: 2145.02,
    amountSpent: 2145.02, impressions: 3197, reach: 2516, frequency: 1.27,
    cpm: 670.95, linkClicks: 17, lastEdit: EDIT,
    qualityRanking: "Below average", qualityRankingSub: BELOW35,
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d4", name: "Static 1", thumb: "logo", on: true,
    delivery: "learning", recommendations: 1, hasExport: true,
    results: 3, resultLabel: "Leads (Form)", costPerResult: 2589.71,
    amountSpent: 7769.12, impressions: 30242, reach: 15573, frequency: 1.94,
    cpm: 256.9, linkClicks: 234, lastEdit: EDIT,
    qualityRanking: "Average",
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d5", name: "Ai 2", thumb: "logo", on: true,
    delivery: "preparing",
    results: null, resultLabel: "Lead (Form)", costPerResult: null,
    amountSpent: 973.12, impressions: 1192, reach: 936, frequency: 1.27,
    cpm: 816.38, linkClicks: 4, lastEdit: EDIT,
    qualityRanking: "Below average", qualityRankingSub: BELOW35,
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d6", name: "VO Video 1 – Copy 2", thumb: "logo", on: true,
    delivery: "learning", hasExport: true,
    results: 2, resultLabel: "Leads (Form)", costPerResult: 4602.53,
    amountSpent: 9205.06, impressions: 11781, reach: 8068, frequency: 1.46,
    cpm: 781.35, linkClicks: 80, lastEdit: EDIT,
    qualityRanking: "Average",
    engagementRanking: "Below average", engagementRankingSub: BELOW35,
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d7", name: "Video 2 – Copy 2", thumb: "logo", on: true,
    delivery: "learning", hasExport: true,
    results: 18, resultLabel: "Leads (Form)", costPerResult: 2850.42,
    amountSpent: 51307.51, impressions: 109209, reach: 54965, frequency: 1.99,
    cpm: 469.81, linkClicks: 1077, lastEdit: EDIT,
    qualityRanking: "Below average", qualityRankingSub: BELOW35,
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d8", name: "Ai 3", thumb: "logo", on: true,
    delivery: "preparing", hasExport: true,
    results: 1, resultLabel: "Lead (Form)", costPerResult: 4924.41,
    amountSpent: 4924.41, impressions: 5972, reach: 4377, frequency: 1.36,
    cpm: 824.58, linkClicks: 37, lastEdit: EDIT,
    qualityRanking: "Average",
    engagementRanking: "Below average", engagementRankingSub: BELOW35,
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d9", name: "Ai 4", thumb: "logo", on: true,
    delivery: "preparing",
    results: null, resultLabel: "Lead (Form)", costPerResult: null,
    amountSpent: 2383.99, impressions: 4066, reach: 3084, frequency: 1.32,
    cpm: 586.32, linkClicks: 23, lastEdit: EDIT,
    qualityRanking: "Below average", qualityRankingSub: BELOW35,
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
  {
    ...base, id: "d10", name: "Video 3", thumb: "logo", on: false,
    delivery: "off",
    results: null, resultLabel: "Lead (Form)", costPerResult: null,
    amountSpent: 5293.78, impressions: 11299, reach: 8145, frequency: 1.39,
    cpm: 468.52, linkClicks: 67, lastEdit: EDIT,
    qualityRanking: "Average",
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    adSetName: "Gurgaon – Ip –5", adSetSub: "9 active ads",
  },
];

/**
 * Ads across the whole campaign ("Ads for 1 Campaign", 261 total, first
 * page of rows). Impressions/amount-spent for cells hidden in the
 * reference are derived (impressions = reach × frequency; spent = CPM ×
 * impressions / 1000); the user will supply exact values later.
 */
function derive(reach: number, freq: number, cpm: number) {
  const impressions = Math.round(reach * freq);
  return {
    impressions,
    amountSpent: Math.round((cpm * impressions) / 10) / 100,
  };
}

const IP5 = { adSetName: "Gurgaon – Ip -5", adSetSub: "9 active ads" };
const IP4 = { adSetName: "Gurgaon – Ip -4", adSetSub: "12 active ads" };
const AP3 = { adSetName: "Gurgaon -Ap 3", adSetSub: "9 active ads" };

const noRank = {
  qualityRanking: null as string | null,
  engagementRanking: null as string | null,
  conversionRanking: null as string | null,
};

export const adsForCampaign: AdRow[] = [
  {
    ...base, id: "e1", name: "Static 5 – Copy 2", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 1820, frequency: 1.26, cpm: 755.13,
    linkClicks: 19, lastEdit: EDIT, ...derive(1820, 1.26, 755.13),
    ...noRank, ...IP5,
  },
  {
    ...base, id: "e2", name: "Static 5 – Copy", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 16593, frequency: 1.49, cpm: 162.34,
    linkClicks: 167, lastEdit: EDIT31, ...derive(16593, 1.49, 162.34),
    ...noRank, ...AP3,
  },
  {
    ...base, id: "e3", name: "Video 3", thumb: "logo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 552, frequency: 1.17, cpm: 1047.51,
    linkClicks: 4, lastEdit: EDIT, ...derive(552, 1.17, 1047.51),
    qualityRanking: "Below average", qualityRankingSub: BELOW35,
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    ...IP4,
  },
  {
    ...base, id: "e4", name: "Static 6 – Copy", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 48559, frequency: 2.25, cpm: 169.27,
    linkClicks: 634, lastEdit: EDIT31, ...derive(48559, 2.25, 169.27),
    ...noRank, ...AP3,
  },
  {
    ...base, id: "e5", name: "Static 3 – Copy", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 23919, frequency: 1.92, cpm: 155.09,
    linkClicks: 401, lastEdit: EDIT31, ...derive(23919, 1.92, 155.09),
    ...noRank, ...AP3,
  },
  {
    ...base, id: "e6", name: "Ai 3 – Copy 2", thumb: "logo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 18794, frequency: 1.65, cpm: 520.73,
    linkClicks: 209, lastEdit: EDIT31, ...derive(18794, 1.65, 520.73),
    qualityRanking: "Average",
    engagementRanking: "Below average", engagementRankingSub: BELOW35,
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    ...AP3,
  },
  {
    ...base, id: "e7", name: "Static 8", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 3544, frequency: 1.29, cpm: 369.55,
    linkClicks: 39, lastEdit: EDIT, ...derive(3544, 1.29, 369.55),
    ...noRank, ...IP4,
  },
  {
    ...base, id: "e8", name: "Static 3", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 1870, frequency: 1.26, cpm: 350.7,
    linkClicks: 24, lastEdit: EDIT, ...derive(1870, 1.26, 350.7),
    ...noRank, ...IP4,
  },
  {
    ...base, id: "e9", name: "Static 2 – Copy", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 11483, frequency: 1.43, cpm: 146.19,
    linkClicks: 122, lastEdit: EDIT31, ...derive(11483, 1.43, 146.19),
    ...noRank, ...AP3,
  },
  {
    ...base, id: "e10", name: "Static 9", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 1148, frequency: 1.25, cpm: 343.51,
    linkClicks: 16, lastEdit: EDIT, ...derive(1148, 1.25, 343.51),
    ...noRank, ...IP4,
  },
  {
    ...base, id: "e11", name: "Static 1", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 3885, frequency: 1.37, cpm: 410.57,
    linkClicks: 31, lastEdit: EDIT, ...derive(3885, 1.37, 410.57),
    ...noRank, ...IP4,
  },
  {
    ...base, id: "e12", name: "Static 5", thumb: "photo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 26132, frequency: 2.5, cpm: 217.64,
    linkClicks: 404, lastEdit: EDIT, ...derive(26132, 2.5, 217.64),
    ...noRank, ...IP4,
  },
  {
    ...base, id: "e13", name: "Remix 4 – Copy", thumb: "logo", on: true,
    delivery: "learning", results: null, resultLabel: "Lead (Form)",
    costPerResult: null, reach: 1236, frequency: 1.2, cpm: 557.15,
    linkClicks: 6, lastEdit: EDIT,
    ...derive(1236, 1.2, 557.15),
    qualityRanking: "Below average", qualityRankingSub: BELOW35,
    engagementRanking: "Average",
    conversionRanking: "Below average", conversionRankingSub: BELOW20,
    ...IP5,
  },
];

export const adsMeta = {
  accountName: "RV 2",
  accountId: "1609980979625964",
  opportunityScore: 76,
  dateRange: "Last 30 days: 15 Jun 2026 - 14 Jul 2026",
  adSetTotalAds: 10,
  campaignTotalAds: 261,
  campaignPageRange: "1-200 of 261",
};
