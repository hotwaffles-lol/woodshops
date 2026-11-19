import { useMemo, useState } from "react";
import { BRANDS, CONFIRMED_YEARS, COUNTRIES, MANUFACTURERS, REGIONS } from "./derived.js";
import { confirmedYear, describeYear } from "./brandStatus.js";
import Chevron from "./Chevron.jsx";

const ALL_REGIONS_LABEL = "All regions";

const SORT_FIELDS = {
  brand: (row) => row.brand,
  manufacturer: (row) => row.lines[0].entry.manufacturer,
  country: (row) => row.lines[0].entry.mfgCountry,
};

const COLUMNS = [
  { key: "brand", label: "Brand" },
  { key: null, label: "Region" },
  { key: "manufacturer", label: "Woodshop" },
  { key: "country", label: "Made in" },
  { key: null, label: "Last known" },
  { key: null, label: "Notes" },
];

const YEAR_OPTIONS = CONFIRMED_YEARS.map((year) => ({
  value: String(year),
  label: `${year} or later`,
}));

/**
 * Applies the filters to each brand. The year filter also trims a brand down to the lines
 * confirmed in or after that year, so only matching woodshops show.
 */
function filterBrands({ search, manufacturer, country, region, since }) {
  const query = search.trim().toLowerCase();
  const minYear = since ? Number(since) : null;
  const isRecent = (line) => minYear === null || (confirmedYear(line.year) ?? 0) >= minYear;

  return BRANDS.filter(
    (row) =>
      (!query || row.brand.toLowerCase().includes(query)) &&
      (!manufacturer || row.manufacturers.includes(manufacturer)) &&
      (!country || row.countries.includes(country)) &&
      (!region || row.regions.includes(region)),
  )
    .map((row) => ({
      ...row,
      lines: row.lines.filter(isRecent),
      earlier: row.earlier.filter(isRecent),
    }))
    .filter((row) => row.lines.length > 0);
}

/** Options are plain strings, or { value, label } pairs when the label differs. */
function Select({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} data-set={Boolean(value)}>
        <option value="">Any</option>
        {options.map((option) => {
          const { value: optionValue, label: optionLabel } =
            typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}

/** The shop's own closure note says where its brands went, so it replaces the generic year. */
function closedMessage(closed, closureNote) {
  if (closureNote) return "Likely moved.";
  return closed === true ? "Closed, likely moved." : `Closed in ${closed}, likely moved.`;
}

/** One region's woodshop for a brand: region, woodshop, country, last known date, notes. */
function Line({ region, entry, year, closed, closureNote }) {
  return (
    <div className="line" data-closed={Boolean(closed)}>
      <span className="cell-region" data-all={region === null}>
        {region ?? ALL_REGIONS_LABEL}
      </span>
      <span className="cell-shop">
        <span className="shop-name">{entry.manufacturer}</span>
        {closed && (
          <span className="closed-note">
            <span className="closed">{closedMessage(closed, closureNote)}</span>{" "}
            {closureNote}
          </span>
        )}
      </span>
      <span className="cell-country">{entry.mfgCountry}</span>
      <span className="cell-year">{describeYear(year)}</span>
      <span className="cell-notes">{entry.notes}</span>
    </div>
  );
}

export default function BrandsView({ filters, setFilter, clearFilters }) {
  const [sort, setSort] = useState({ key: "brand", isAscending: true });
  const [showEarlier, setShowEarlier] = useState(false);

  const rows = useMemo(() => {
    const field = SORT_FIELDS[sort.key];
    const direction = sort.isAscending ? 1 : -1;
    return filterBrands(filters).sort((a, b) => direction * field(a).localeCompare(field(b)));
  }, [filters, sort]);

  const hasFilters = Object.values(filters).some(Boolean);

  const toggleSort = (key) =>
    setSort((s) => ({ key, isAscending: s.key === key ? !s.isAscending : true }));

  return (
    <section aria-label="Brands" className="brand-grid">
      <div className="toolbar">
        <div className="filters">
          <label className="field field-search">
            <span className="field-label">Brand</span>
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search brands"
            />
          </label>
          <Select
            label="Woodshop"
            value={filters.manufacturer}
            options={MANUFACTURERS}
            onChange={(v) => setFilter("manufacturer", v)}
          />
          <Select
            label="Made in"
            value={filters.country}
            options={COUNTRIES}
            onChange={(v) => setFilter("country", v)}
          />
          <Select
            label="Region"
            value={filters.region}
            options={REGIONS}
            onChange={(v) => setFilter("region", v)}
          />
          <Select
            label="Confirmed"
            value={filters.since}
            options={YEAR_OPTIONS}
            onChange={(v) => setFilter("since", v)}
          />
        </div>

        <p className="tally" aria-live="polite">
          <span>
            {rows.length} of {BRANDS.length} brands
          </span>
          {hasFilters && (
            <button type="button" className="text-button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
          <label className="toggle">
            <input
              type="checkbox"
              checked={showEarlier}
              onChange={(e) => setShowEarlier(e.target.checked)}
            />
            Show earlier woodshops
          </label>
        </p>

        <div className="grid-head">
          {COLUMNS.map(({ key, label }) => (
            <span key={label}>
              {key ? (
                <button type="button" className="sort" onClick={() => toggleSort(key)}>
                  {label}
                  {sort.key === key && <Chevron isUp={!sort.isAscending} />}
                </button>
              ) : (
                label
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="grid">
        {rows.length === 0 && (
          <p className="empty">
            No brand matches these filters.{" "}
            <button type="button" className="text-button" onClick={clearFilters}>
              Clear filters
            </button>
          </p>
        )}

        {rows.map((row) => (
          <div key={row.brand} className="grid-row brand-row">
            <span className="cell-brand">{row.brand}</span>
            <div className="lines">
              {row.lines.map((line, i) => (
                <Line key={i} {...line} />
              ))}
              {showEarlier && row.earlier.length > 0 && (
                <div className="earlier">
                  {row.earlier.map((line, i) => (
                    <Line key={i} {...line} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
