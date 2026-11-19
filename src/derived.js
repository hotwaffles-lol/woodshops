import { RAW_DATA, WOODSHOP_DATA } from "./data.js";
import { closedYearOf, confirmedYear, currentLines, parseYearNote } from "./brandStatus.js";

// Last forum page scraped into data.js. Update alongside each scrape.
export const DATA_UPDATED = "November 2026";

export const SOURCE_THREAD_URL = "https://www.slapmagazine.com/index.php?topic=120409.0";
export const REPO_URL = "https://github.com/hotwaffles-lol/woodshops";

const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort();

/**
 * Closure year (or true) when a line's woodshop has closed and the line doesn't say it
 * started after the closure; null otherwise.
 */
function closedStatus(line) {
  const closed = closedYearOf(line.entry.manufacturer, WOODSHOP_DATA);
  if (!closed || line.year.end) return null;
  if (closed !== true && line.year.start && line.year.start > closed) return null;
  return closed;
}

function closureNote(manufacturer) {
  return WOODSHOP_DATA.find((s) => s.name === manufacturer)?.notes ?? null;
}

function groupByBrand(entries) {
  const groups = new Map();
  entries.forEach((entry) => {
    if (!groups.has(entry.brand)) groups.set(entry.brand, []);
    groups.get(entry.brand).push(entry);
  });
  return [...groups].map(([brand, history]) => {
    const { lines, earlier } = currentLines(history);
    return {
      brand,
      lines: lines.map((line) => {
        const closed = closedStatus(line);
        return {
          ...line,
          closed,
          closureNote: closed ? closureNote(line.entry.manufacturer) : null,
        };
      }),
      earlier: earlier.map((entry) => ({
        entry,
        region: entry.region,
        year: parseYearNote(entry.yearNote),
      })),
      manufacturers: uniqueSorted(lines.map((l) => l.entry.manufacturer)),
      countries: uniqueSorted(lines.map((l) => l.entry.mfgCountry)),
      regions: uniqueSorted(lines.map((l) => l.region)),
    };
  });
}

export const BRANDS = groupByBrand(RAW_DATA);

// Filters and counts use only each brand's current lines, not its earlier woodshops.
export const MANUFACTURERS = uniqueSorted(BRANDS.flatMap((b) => b.manufacturers));
export const COUNTRIES = uniqueSorted(BRANDS.flatMap((b) => b.countries));
export const REGIONS = uniqueSorted(BRANDS.flatMap((b) => b.regions));

/** Every year a current woodshop was confirmed in, newest first, for the year filter. */
export const CONFIRMED_YEARS = [
  ...new Set(
    BRANDS.flatMap((b) => b.lines.map((l) => confirmedYear(l.year))).filter((y) => y !== null),
  ),
].sort((a, b) => b - a);
