import { useState } from "react";
import { RESELLER_DATA, WOODSHOP_DATA } from "./data.js";
import {
  BRANDS,
  DATA_UPDATED,
  MANUFACTURERS,
  REPO_URL,
  SOURCE_THREAD_URL,
} from "./derived.js";
import DeckEdge from "./DeckEdge.jsx";
import BrandsView from "./BrandsView.jsx";
import ShopsView from "./ShopsView.jsx";

const VIEWS = {
  brands: "Brands",
  woodshops: "Woodshops",
  resellers: "Resellers",
};

const VIEW_COUNTS = {
  brands: BRANDS.length,
  woodshops: WOODSHOP_DATA.length,
  resellers: RESELLER_DATA.length,
};

const NO_FILTERS = { search: "", manufacturer: "", country: "", region: "" };

export default function App() {
  const [view, setView] = useState("brands");
  const [filters, setFilters] = useState(NO_FILTERS);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <div className="page">
      <header className="masthead">
        <h1>Woodshops</h1>
        <p className="lede">
          Which woodshop presses each skateboard brand&rsquo;s decks. {BRANDS.length} brands,{" "}
          {MANUFACTURERS.length} woodshops, compiled from the Slap forum thread.
        </p>
        <DeckEdge />
      </header>

      <nav className="tabs" aria-label="Sections">
        {Object.entries(VIEWS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className="tab"
            aria-current={view === key ? "page" : undefined}
            onClick={() => setView(key)}
          >
            {label} <span className="tab-count">{VIEW_COUNTS[key]}</span>
          </button>
        ))}
      </nav>

      <main>
        {view === "brands" && (
          <BrandsView
            filters={filters}
            setFilter={setFilter}
            clearFilters={() => setFilters(NO_FILTERS)}
          />
        )}
        {view === "woodshops" && (
          <ShopsView label="Woodshops" shops={WOODSHOP_DATA} showEstablished />
        )}
        {view === "resellers" && (
          <ShopsView
            label="Resellers"
            shops={RESELLER_DATA}
            intro="Resellers and distributors sell boards made by other woodshops. They don't press their own."
          />
        )}
      </main>

      <footer className="footer">
        <p>
          Data from the{" "}
          <a href={SOURCE_THREAD_URL} target="_blank" rel="noopener noreferrer">
            Slap Magazine forum thread
          </a>
          , last updated {DATA_UPDATED}. Community sourced, not official, and possibly wrong.
          Source on{" "}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
        <p>
          Built through conversation with{" "}
          <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">
            Claude
          </a>{" "}
          using Claude Code. A personal hobby project by someone who likes knowing where their
          skateboard came from.
        </p>
      </footer>
    </div>
  );
}
