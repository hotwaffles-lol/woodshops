import { useState, useMemo } from "react";
import { RAW_DATA, WOODSHOP_DATA, RESELLER_DATA } from "./data.js";

const ALL_MANUFACTURERS = [...new Set(RAW_DATA.map(d => d.manufacturer))].sort();
const ALL_COUNTRIES = [...new Set(RAW_DATA.map(d => d.mfgCountry))].sort();
const ALL_REGIONS = [...new Set(RAW_DATA.map(d => d.region).filter(Boolean))].sort();

const COUNTRY_COLOR = {
  "USA":"#3a7abf","Mexico":"#d4572a","Canada":"#c9363a",
  "China":"#c9a227","Australia":"#3aad72","Brazil":"#27ad6a",
  "UK":"#9b59b6","Europe":"#8e44ad","Unknown":"#555",
  "Netherlands":"#e67e22","Germany":"#6c7a89","Poland":"#922b21",
  "Hungary":"#d4ac0d","Malaysia":"#148f77","South Africa":"#1e8449",
  "France":"#1f618d","Austria":"#7d3c98","Spain":"#c0392b","South America":"#17a589",
};


function Badge({ label, color }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 6px",
      fontSize:"10px", letterSpacing:"0.07em", textTransform:"uppercase",
      border:`1px solid ${color||"#333"}`, color: color||"#666",
    }}>
      {label}
    </span>
  );
}

function RegionBadge({ label }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 6px",
      fontSize:"10px", letterSpacing:"0.07em", textTransform:"uppercase",
      border:"1px solid #555", color:"#888",
    }}>
      {label}
    </span>
  );
}

function Chevron({ up }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: up ? "rotate(180deg)" : "none", transition:"transform 0.15s", flexShrink:0 }}>
      <path d="M1.5 3l3 3 3-3"/>
    </svg>
  );
}

function WoodshopsView() {
  const [wsCountryFilter, setWsCountryFilter] = useState("");

  const WS_COUNTRIES = [...new Set(WOODSHOP_DATA.map(d => d.country))].sort();

  const filteredWS = wsCountryFilter
    ? WOODSHOP_DATA.filter(d => d.country === wsCountryFilter)
    : WOODSHOP_DATA;

  const filteredResellers = wsCountryFilter
    ? RESELLER_DATA.filter(d => d.country === wsCountryFilter)
    : RESELLER_DATA;

  const linkStyle = {
    color:"#555", textDecoration:"none", fontSize:"10px", letterSpacing:"0.08em",
    textTransform:"uppercase", transition:"color 0.15s", whiteSpace:"nowrap",
  };

  function Links({ websites, instagrams }) {
    return (
      <span style={{ display:"inline-flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        {websites.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={e => e.currentTarget.style.color="#ff3c00"}
            onMouseLeave={e => e.currentTarget.style.color="#555"}
          >web ↗</a>
        ))}
        {instagrams.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={e => e.currentTarget.style.color="#ff3c00"}
            onMouseLeave={e => e.currentTarget.style.color="#555"}
          >IG ↗</a>
        ))}
      </span>
    );
  }

  const sectionLabelStyle = {
    fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase",
    color:"#777", fontWeight:700, marginBottom:"10px", marginTop:"32px",
  };

  const rowStyle = (i) => ({
    borderBottom:"1px solid #161616",
    background: i % 2 === 0 ? "transparent" : "#0e0e0e",
  });

  const tdName = { padding:"10px 12px 10px 0", fontWeight:700, color:"#d8d0c4", fontSize:"13px" };
  const tdCountry = { padding:"10px 12px 10px 0", whiteSpace:"nowrap" };
  const tdEst = { padding:"10px 12px 10px 0", fontSize:"11px", color:"#666", whiteSpace:"nowrap" };
  const tdLinks = { padding:"10px 12px 10px 0" };
  const tdNotes = { padding:"10px 0", fontSize:"11px", color:"#888" };

  function ShopTable({ data, showEst }) {
    return (
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
        <thead>
          <tr style={{ borderBottom:"2px solid #1e1e1e" }}>
            <th style={{ padding:"10px 12px 10px 0", textAlign:"left", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", fontWeight:700, color:"#777", whiteSpace:"nowrap" }}>Name</th>
            <th style={{ padding:"10px 12px 10px 0", textAlign:"left", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", fontWeight:700, color:"#777", whiteSpace:"nowrap" }}>Country</th>
            {showEst && <th style={{ padding:"10px 12px 10px 0", textAlign:"left", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", fontWeight:700, color:"#777", whiteSpace:"nowrap" }}>Est.</th>}
            <th style={{ padding:"10px 12px 10px 0", textAlign:"left", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", fontWeight:700, color:"#777" }}>Links</th>
            <th style={{ padding:"10px 0", textAlign:"left", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", fontWeight:700, color:"#777" }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan={showEst ? 5 : 4} style={{ padding:"32px 0", textAlign:"center", color:"#555", fontSize:"12px" }}>No results.</td></tr>
          )}
          {data.map((shop, i) => (
            <tr key={i} style={rowStyle(i)}>
              <td style={tdName}>
                {shop.name}
                {shop.closed && <span style={{ marginLeft:7, fontSize:"9px", color:"#c0392b", letterSpacing:"0.1em", textTransform:"uppercase", border:"1px solid #5a1a1a", padding:"1px 5px" }}>closed{typeof shop.closed === "number" ? ` ${shop.closed}` : ""}</span>}
              </td>
              <td style={tdCountry}>
                <Badge label={shop.country} color={COUNTRY_COLOR[shop.country]}/>
                {shop.location && <span style={{ marginLeft:6, fontSize:"10px", color:"#666" }}>{shop.location}</span>}
              </td>
              {showEst && <td style={tdEst}>{shop.est ? `est. ${shop.est}` : <span style={{color:"#333"}}>—</span>}</td>}
              <td style={tdLinks}><Links websites={shop.websites} instagrams={shop.instagrams}/></td>
              <td style={tdNotes}>{shop.notes || <span style={{color:"#333"}}>—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
        <select value={wsCountryFilter} onChange={e => setWsCountryFilter(e.target.value)}
          style={{
            background:"#141414", border:`1px solid ${wsCountryFilter ? "#ff3c00" : "#222"}`,
            color: wsCountryFilter ? "#ddd5c8" : "#777",
            padding:"10px 28px 10px 11px", fontSize:"12px", fontFamily:"inherit",
            outline:"none", cursor:"pointer", appearance:"none", flex:"0 0 auto",
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9' viewBox='0 0 9 9'%3E%3Cpath d='M1.5 3l3 3 3-3' stroke='%23777' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat:"no-repeat", backgroundPosition:"right 9px center",
          }}>
          <option value="">All Countries</option>
          {WS_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {wsCountryFilter && (
          <button onClick={() => setWsCountryFilter("")}
            style={{ background:"none", border:"1px solid #2a2a2a", color:"#777", padding:"10px 14px", fontSize:"10px", fontFamily:"inherit", cursor:"pointer", letterSpacing:"0.12em", textTransform:"uppercase", transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#ff3c00"; e.currentTarget.style.color="#ff3c00"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#2a2a2a"; e.currentTarget.style.color="#777"; }}
          >Clear ×</button>
        )}
      </div>

      <div style={sectionLabelStyle}>Woodshops & Manufacturers — {filteredWS.length} listed</div>
      <ShopTable data={filteredWS} showEst={true}/>

      <div style={{ ...sectionLabelStyle, marginTop:"48px", paddingTop:"24px", borderTop:"1px solid #161616" }}>
        Resellers & Distributors — {filteredResellers.length} listed
        <span style={{ marginLeft:10, fontWeight:400, color:"#555", letterSpacing:"0.1em", fontSize:"9px" }}>· do not manufacture their own boards</span>
      </div>
      <ShopTable data={filteredResellers} showEst={false}/>

      <div style={{ marginTop:"32px", fontSize:"10px", color:"#555", letterSpacing:"0.1em" }}>
        Directory data: Slap Magazine Forums · Last updated March 2024 · Community sourced
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [mfgFilter, setMfgFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sortKey, setSortKey] = useState("brand");
  const [sortDir, setSortDir] = useState("asc");
  const [regionFilter, setRegionFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("brands");

  const brandMap = useMemo(() => {
    const m = {};
    RAW_DATA.forEach(r => { (m[r.brand] = m[r.brand] || []).push(r); });
    return m;
  }, []);

  const brandRows = useMemo(() =>
    Object.entries(brandMap).map(([brand, entries]) => ({
      brand,
      primary: entries[0],
      entries,
      allMfg: [...new Set(entries.map(e => e.manufacturer))],
      allCountries: [...new Set(entries.map(e => e.mfgCountry))],
      allRegions: [...new Set(entries.map(e => e.region).filter(Boolean))],
    }))
  , [brandMap]);

  const filtered = useMemo(() => {
    let rows = brandRows;
    if (search) { const q = search.toLowerCase(); rows = rows.filter(r => r.brand.toLowerCase().includes(q)); }
    if (mfgFilter) rows = rows.filter(r => r.allMfg.includes(mfgFilter));
    if (countryFilter) rows = rows.filter(r => r.allCountries.includes(countryFilter));
    if (regionFilter) rows = rows.filter(r => r.allRegions.includes(regionFilter));
    return [...rows].sort((a, b) => {
      const av = sortKey === "manufacturer" ? a.primary.manufacturer : sortKey === "country" ? a.primary.mfgCountry : a.brand;
      const bv = sortKey === "manufacturer" ? b.primary.manufacturer : sortKey === "country" ? b.primary.mfgCountry : b.brand;
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [brandRows, search, mfgFilter, countryFilter, regionFilter, sortKey, sortDir]);

  const sort = (k) => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("asc"); } };
  const hasFilters = search || mfgFilter || countryFilter || regionFilter;

  const thStyle = (k) => ({
    padding:"10px 12px 10px 0", textAlign:"left",
    fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", fontWeight:700,
    color: sortKey === k ? "#ff3c00" : "#777", cursor:"pointer", userSelect:"none",
    whiteSpace:"nowrap", transition:"color 0.15s",
  });

  const selectStyle = (active) => ({
    background:"#141414", border:`1px solid ${active ? "#ff3c00" : "#222"}`,
    color: active ? "#ddd5c8" : "#777",
    padding:"10px 28px 10px 11px", fontSize:"12px", fontFamily:"inherit",
    outline:"none", cursor:"pointer", appearance:"none", flex:"1 1 140px",
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9' viewBox='0 0 9 9'%3E%3Cpath d='M1.5 3l3 3 3-3' stroke='%23777' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat:"no-repeat", backgroundPosition:"right 9px center",
  });

  return (
    <div style={{ minHeight:"100vh", background:"#0c0c0c", color:"#d8d0c4", fontFamily:"'Courier New',Courier,monospace" }}>
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0, opacity:0.3,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
      }}/>

      <div style={{ position:"relative", zIndex:1, maxWidth:"1200px", margin:"0 auto", padding:"40px 20px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom:"36px" }}>
          <div style={{ fontSize:"10px", letterSpacing:"0.4em", color:"#666", textTransform:"uppercase", marginBottom:"10px" }}>
            Slap Magazine Forums · 2025 Edition
          </div>
          <h1 style={{ margin:0, lineHeight:0.88, textTransform:"uppercase", fontWeight:900, letterSpacing:"-0.03em", fontSize:"clamp(38px,8vw,76px)" }}>
            Who Makes<br/><span style={{ color:"#ff3c00" }}>Your Deck?</span>
          </h1>
          <div style={{ marginTop:"14px", display:"flex", gap:"20px", flexWrap:"wrap", fontSize:"11px", color:"#666", letterSpacing:"0.1em" }}>
            <span><span style={{ color:"#ff3c00", fontWeight:700 }}>{RAW_DATA.length}</span> entries</span>
            <span><span style={{ color:"#ff3c00", fontWeight:700 }}>{Object.keys(brandMap).length}</span> brands</span>
            <span><span style={{ color:"#ff3c00", fontWeight:700 }}>{ALL_MANUFACTURERS.length}</span> manufacturers</span>
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display:"flex", gap:0, marginBottom:"28px", borderBottom:"1px solid #1e1e1e" }}>
          {[["brands","Brands"],["woodshops","Woodshops"]].map(([v,label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              background:"none", border:"none", borderBottom: view===v ? "2px solid #ff3c00" : "2px solid transparent",
              color: view===v ? "#ff3c00" : "#555", padding:"8px 18px 10px", fontSize:"10px",
              letterSpacing:"0.25em", textTransform:"uppercase", fontFamily:"inherit",
              cursor:"pointer", fontWeight:700, transition:"all 0.15s", marginBottom:"-1px",
            }}>{label}</button>
          ))}
        </div>

        {view === "brands" && (<>
        {/* Filters */}
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
          <div style={{ flex:"1 1 200px", position:"relative" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brand..."
              style={{ width:"100%", boxSizing:"border-box", background:"#141414", border:"1px solid #222",
                color:"#d8d0c4", padding:"10px 11px", fontSize:"13px", fontFamily:"inherit", outline:"none", transition:"border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor="#ff3c00"}
              onBlur={e => e.target.style.borderColor="#222"}
            />
            {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:"9px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:"15px" }}>×</button>}
          </div>
          <select value={mfgFilter} onChange={e => setMfgFilter(e.target.value)} style={selectStyle(!!mfgFilter)}>
            <option value="">All Manufacturers</option>
            {ALL_MANUFACTURERS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={selectStyle(!!countryFilter)}>
            <option value="">All Countries</option>
            {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={selectStyle(!!regionFilter)}>
            <option value="">All Regions</option>
            {ALL_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(""); setMfgFilter(""); setCountryFilter(""); setRegionFilter(""); }}
              style={{ background:"none", border:"1px solid #2a2a2a", color:"#777", padding:"10px 14px", fontSize:"10px", fontFamily:"inherit", cursor:"pointer", letterSpacing:"0.12em", textTransform:"uppercase", transition:"all 0.15s", whiteSpace:"nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#ff3c00"; e.currentTarget.style.color="#ff3c00"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#2a2a2a"; e.currentTarget.style.color="#777"; }}
            >Clear ×</button>
          )}
        </div>

        <div style={{ fontSize:"11px", color:"#666", letterSpacing:"0.08em", marginBottom:"14px" }}>
          {filtered.length} brand{filtered.length !== 1 ? "s" : ""}{hasFilters && <span style={{ color:"#ff3c00" }}> — filtered</span>}
          <span style={{ color:"#555", marginLeft:12 }}>· click rows with history for full timeline</span>
        </div>

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #1e1e1e" }}>
                <th onClick={() => sort("brand")} style={thStyle("brand")}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>Brand {sortKey==="brand" && <Chevron up={sortDir==="desc"}/>}</span>
                </th>
                <th onClick={() => sort("manufacturer")} style={thStyle("manufacturer")}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>Manufacturer {sortKey==="manufacturer" && <Chevron up={sortDir==="desc"}/>}</span>
                </th>
                <th onClick={() => sort("country")} style={thStyle("country")}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>Country {sortKey==="country" && <Chevron up={sortDir==="desc"}/>}</span>
                </th>
                <th style={{ ...thStyle(""), cursor:"default" }}>Region</th>
                <th style={{ ...thStyle(""), cursor:"default" }}>Notes</th>
                <th style={{ width:20 }}/>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding:"48px 0", textAlign:"center", color:"#555" }}>No results.</td></tr>
              )}
              {filtered.map((row, i) => {
                const isExp = expanded === row.brand;
                const hasHist = row.entries.length > 1;
                const evenBg = i % 2 === 0 ? "transparent" : "#0e0e0e";
                return [
                  <tr key={row.brand}
                    onClick={() => hasHist && setExpanded(isExp ? null : row.brand)}
                    style={{ borderBottom: isExp ? "none" : "1px solid #161616", background: isExp ? "#120e00" : evenBg, cursor: hasHist ? "pointer" : "default", transition:"background 0.1s" }}
                    onMouseEnter={e => { if(!isExp) e.currentTarget.style.background="#181000"; }}
                    onMouseLeave={e => { if(!isExp) e.currentTarget.style.background = isExp ? "#120e00" : evenBg; }}
                  >
                    <td style={{ padding:"12px 12px 12px 0", fontWeight:700, color:"#d8d0c4" }}>
                      {row.brand}
                      {hasHist && <span style={{ marginLeft:5, fontSize:"9px", color:"#666" }}>+{row.entries.length-1}</span>}
                    </td>
                    <td style={{ padding:"12px 12px 12px 0", color:"#ff3c00", fontWeight:600 }}>{row.primary.manufacturer}</td>
                    <td style={{ padding:"12px 12px 12px 0" }}>
                      <Badge label={row.primary.mfgCountry} color={COUNTRY_COLOR[row.primary.mfgCountry]}/>
                    </td>
                    <td style={{ padding:"12px 12px 12px 0" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
                        {row.allRegions.length > 0 ? row.allRegions.map(r => <RegionBadge key={r} label={r}/>) : <span style={{color:"#333"}}>—</span>}
                      </span>
                    </td>
                    <td style={{ padding:"12px 12px 12px 0", color:"#999", fontSize:"12px" }}>
                      {[row.primary.yearNote, row.primary.notes].filter(Boolean).join(" · ") || <span style={{color:"#333"}}>—</span>}
                    </td>
                    <td style={{ padding:"12px 0", color:"#666", textAlign:"right" }}>
                      {hasHist && <Chevron up={isExp}/>}
                    </td>
                  </tr>,
                  isExp && (
                    <tr key={`${row.brand}-exp`}>
                      <td colSpan={6} style={{ background:"#120e00", borderBottom:"1px solid #161616", padding:0 }}>
                        <div style={{ borderLeft:"2px solid #ff3c00" }}>
                          <div style={{ padding:"6px 12px 8px 14px", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"#777", fontWeight:700 }}>
                            Full History — {row.entries.length} entries
                          </div>
                          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
                            <tbody>
                              {row.entries.map((e, ei) => (
                                <tr key={ei} style={{ borderTop:"1px solid #1a1000" }}>
                                  <td style={{ padding:"7px 12px 7px 14px", color:"#ff3c00", fontWeight:600, width:180 }}>{e.manufacturer}</td>
                                  <td style={{ padding:"7px 12px", width:90 }}>
                                    <Badge label={e.mfgCountry} color={COUNTRY_COLOR[e.mfgCountry]}/>
                                  </td>
                                  <td style={{ padding:"7px 12px" }}>
                                    {e.region ? <RegionBadge label={e.region}/> : <span style={{color:"#333"}}>—</span>}
                                  </td>
                                  <td style={{ padding:"7px 12px", color:"#888", fontSize:"11px" }}>
                                    {[e.yearNote, e.notes].filter(Boolean).join(" · ") || <span style={{color:"#444"}}>—</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )
                ];
              })}
            </tbody>
          </table>
        </div>
        </>)}

        {view === "woodshops" && (
          <WoodshopsView />
        )}

        {/* Footer */}
        <div style={{ marginTop:"56px", paddingTop:"18px", borderTop:"1px solid #161616", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8, fontSize:"10px", letterSpacing:"0.15em", textTransform:"uppercase", color:"#555" }}>
          <span>Data: Slap Magazine Forums 2025 · Community sourced · Not official</span>
          <a href="https://www.slapmagazine.com/index.php?topic=120409.0" target="_blank" rel="noopener noreferrer"
            style={{ color:"#555", textDecoration:"none", transition:"color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color="#ff3c00"}
            onMouseLeave={e => e.currentTarget.style.color="#555"}
          >Source Thread ↗</a>
        </div>
      </div>
    </div>
  );
}
