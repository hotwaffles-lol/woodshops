import { useMemo, useState } from "react";
import { BRANDS, COUNTRIES, MANUFACTURERS, REGIONS } from "./derived.js";
import { describeYear, parseYearNote } from "./brandStatus.js";
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

function filterBrands({ search, manufacturer, country, region }) {
  const query = search.trim().toLowerCase();
  return BRANDS.filter(
    (row) =>
      (!query || row.brand.toLowerCase().includes(query)) &&
      (!manufacturer || row.manufacturers.includes(manufacturer)) &&
      (!country || row.countries.includes(country)) &&
      (!region || row.regions.includes(region)),
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} data-set={Boolean(value)}>
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
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
  const [openEarlier, setOpenEarlier] = useState(null);

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
        </div>

        <p className="tally" aria-live="polite">
          {rows.length} of {BRANDS.length} brands
          {hasFilters && (
            <button type="button" className="text-button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
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

        {rows.map((row) => {
          const isEarlierOpen = openEarlier === row.brand;
          const earlierCount = row.earlier.length;
          return (
            <div key={row.brand} className="grid-row brand-row">
              <span className="cell-brand">{row.brand}</span>
              <div className="lines">
                {row.lines.map((line, i) => (
                  <Line key={i} {...line} />
                ))}
                {earlierCount > 0 && (
                  <button
                    type="button"
                    className="earlier-toggle"
                    aria-expanded={isEarlierOpen}
                    onClick={() => setOpenEarlier(isEarlierOpen ? null : row.brand)}
                  >
                    {earlierCount} earlier {earlierCount === 1 ? "woodshop" : "woodshops"}
                    <Chevron isUp={isEarlierOpen} />
                  </button>
                )}
                {isEarlierOpen && (
                  <div className="earlier">
                    {row.earlier.map((entry, i) => (
                      <Line
                        key={i}
                        region={entry.region}
                        entry={entry}
                        year={parseYearNote(entry.yearNote)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
