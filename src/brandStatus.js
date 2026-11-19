// Works out where a brand is made now from its forum history entries.
// Year notes are free text from the forum: "2021+", "2022", "-2020", "-mid 2018", "2021 some".

const YEAR_NOTE = /^(-)?\s*(?:(\w+)\s+)?(\d{4})(\+)?\s*(.*)$/;

// A closed value below this is a data placeholder (e.g. `closed: 1`), not a year.
const EARLIEST_PLAUSIBLE_YEAR = 1900;

/** Parses a forum year note. A leading "-" means "until"; a trailing "+" means "since". */
export function parseYearNote(note) {
  const empty = { start: null, end: null, isOngoing: false, qualifier: null };
  const match = note?.trim().match(YEAR_NOTE);
  if (!match) return empty;
  const [, isUntil, prefix, year, plus, rest] = match;
  const qualifier = [prefix, rest].filter(Boolean).join(" ") || null;
  if (isUntil) return { ...empty, end: Number(year), qualifier };
  return { start: Number(year), end: null, isOngoing: Boolean(plus), qualifier };
}

/** Human phrasing of a parsed year note, or null when the forum gave no date. */
export function describeYear(year) {
  const base = year.end
    ? `Until ${year.end}`
    : year.start && year.isOngoing
      ? `Since ${year.start}`
      : year.start
        ? String(year.start)
        : null;
  if (!base) return null;
  return year.qualifier ? `${base}, ${year.qualifier}` : base;
}

/** The year the forum last confirmed this woodshop: its start, or its end once ended. */
export function confirmedYear(year) {
  return year.start ?? year.end ?? null;
}

const hasEnded = (year) => year.end !== null;

/** Keeps the latest-dated entries; undated ones survive only when nothing is dated. */
function latestOf(items) {
  const dated = items.filter((i) => i.year.start !== null);
  if (dated.length === 0) return items;
  const latest = Math.max(...dated.map((i) => i.year.start));
  return dated.filter((i) => i.year.start === latest);
}

function latestEnded(items) {
  const latest = Math.max(...items.map((i) => i.year.end));
  return items.filter((i) => i.year.end === latest);
}

/**
 * Splits a brand's history into current lines (one or more per region, all-regions first)
 * and earlier entries. An ended entry is only shown when the brand has nothing active at all.
 */
export function currentLines(history) {
  const items = history.map((entry) => ({
    entry,
    region: entry.region,
    year: parseYearNote(entry.yearNote),
  }));
  const active = items.filter((i) => !hasEnded(i.year));

  let shown;
  if (active.length > 0) {
    const regions = [...new Set(active.map((i) => i.region))];
    shown = regions.flatMap((region) => latestOf(active.filter((i) => i.region === region)));
  } else {
    shown = latestEnded(items);
  }

  shown.sort((a, b) => (a.region === null ? -1 : b.region === null ? 1 : 0));
  const shownEntries = new Set(shown.map((i) => i.entry));
  return {
    lines: shown,
    earlier: history.filter((entry) => !shownEntries.has(entry)),
  };
}

/**
 * Closure year for a woodshop name as used in brand entries, matched against the woodshop
 * directory by exact name, a "/"-separated alias ("BBS / Generator") or a word prefix
 * ("Watson" → "Watson Laminates"). Returns true when closed with no usable year, null if open
 * or unknown.
 */
export function closedYearOf(manufacturer, shops) {
  const shop = shops.find((s) => {
    const aliases = s.name.split("/").map((part) => part.trim());
    return aliases.includes(manufacturer) || s.name.startsWith(`${manufacturer} `);
  });
  if (!shop?.closed) return null;
  return typeof shop.closed === "number" && shop.closed >= EARLIEST_PLAUSIBLE_YEAR
    ? shop.closed
    : true;
}
