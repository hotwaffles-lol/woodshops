import { useState } from "react";

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function handleOf(url) {
  const match = url.match(/instagram\.com\/([^/?#]+)/);
  return match ? `@${match[1]}` : "Instagram";
}

function closedLabel(closed) {
  return typeof closed === "number" ? `Closed in ${closed}` : "Closed";
}

/** Directory table for woodshops or resellers, filterable by country. */
export default function ShopsView({ label, shops, intro, showEstablished }) {
  const [country, setCountry] = useState("");
  const countries = [...new Set(shops.map((s) => s.country))].sort();
  const rows = country ? shops.filter((s) => s.country === country) : shops;

  return (
    <section aria-label={label} className="shop-grid" data-established={showEstablished}>
      {intro && <p className="view-intro">{intro}</p>}
      <div className="toolbar">
        <div className="filters">
          <label className="field">
            <span className="field-label">Country</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              data-set={Boolean(country)}
            >
              <option value="">Any</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="tally" aria-live="polite">
          {rows.length} of {shops.length} {label.toLowerCase()}
        </p>

        <div className="grid-head">
          <span>Name</span>
          {showEstablished && <span>Founded</span>}
          <span>Country</span>
          <span>Links</span>
          <span>Notes</span>
        </div>
      </div>

      <div className="grid">
        {rows.map((shop) => (
          <div key={shop.name} className="grid-row">
            <div className="row-line">
              <span className="cell-brand">
                {shop.name}
                {(shop.location || shop.closed) && (
                  <span className="sub">
                    {shop.location}
                    {shop.location && shop.closed && ", "}
                    {shop.closed && <span className="closed">{closedLabel(shop.closed)}</span>}
                  </span>
                )}
              </span>
              {showEstablished && <span className="cell-year">{shop.est}</span>}
              <span className="cell-country">{shop.country}</span>
              <span className="cell-links">
                {shop.websites.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                    {hostOf(url)}
                  </a>
                ))}
                {shop.instagrams.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                    {handleOf(url)}
                  </a>
                ))}
              </span>
              <span className="cell-notes">{shop.notes}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
