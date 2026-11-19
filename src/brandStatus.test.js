import { test } from "node:test";
import assert from "node:assert/strict";
import { closedYearOf, currentLines, describeYear, parseYearNote } from "./brandStatus.js";

const entry = (manufacturer, yearNote = null, region = null) => ({
  brand: "X",
  manufacturer,
  mfgCountry: "USA",
  yearNote,
  region,
  notes: null,
});

test("parseYearNote reads starts, ends and qualifiers", () => {
  assert.deepEqual(parseYearNote(null), { start: null, end: null, isOngoing: false, qualifier: null });
  assert.deepEqual(parseYearNote("2021+"), { start: 2021, end: null, isOngoing: true, qualifier: null });
  assert.deepEqual(parseYearNote("2022"), { start: 2022, end: null, isOngoing: false, qualifier: null });
  assert.deepEqual(parseYearNote("-2020"), { start: null, end: 2020, isOngoing: false, qualifier: null });
  assert.deepEqual(parseYearNote("-mid 2018"), { start: null, end: 2018, isOngoing: false, qualifier: "mid" });
  assert.deepEqual(parseYearNote("2022 worldwide"), {
    start: 2022,
    end: null,
    isOngoing: false,
    qualifier: "worldwide",
  });
  assert.deepEqual(parseYearNote("2021+ reissues"), {
    start: 2021,
    end: null,
    isOngoing: true,
    qualifier: "reissues",
  });
});

test("describeYear phrases the last known date", () => {
  assert.equal(describeYear(parseYearNote("2021+")), "Since 2021");
  assert.equal(describeYear(parseYearNote("2022")), "2022");
  assert.equal(describeYear(parseYearNote("-2020")), "Until 2020");
  assert.equal(describeYear(parseYearNote("2021 some")), "2021, some");
  assert.equal(describeYear(parseYearNote(null)), null);
});

test("a later all-regions entry supersedes ended regional ones (Plan B)", () => {
  const history = [
    entry("HLC", "2022 worldwide"),
    entry("PS Stix", "-2020", "USA"),
    entry("Clutch", "-2021", "Americas"),
    entry("HLC", "-2021", "EU"),
  ];
  const { lines, earlier } = currentLines(history);
  assert.deepEqual(
    lines.map((l) => [l.region, l.entry.manufacturer]),
    [[null, "HLC"]],
  );
  assert.equal(earlier.length, 3);
});

test("an ended entry is dropped when a newer one exists in the same region", () => {
  const { lines } = currentLines([entry("BBS", "2021+"), entry("PS Stix", "-2020")]);
  assert.deepEqual(
    lines.map((l) => l.entry.manufacturer),
    ["BBS"],
  );
});

test("active regional lines are kept alongside the all-regions line", () => {
  const { lines } = currentLines([entry("BBS"), entry("DSM", null, "AU")]);
  assert.deepEqual(
    lines.map((l) => [l.region, l.entry.manufacturer]),
    [
      [null, "BBS"],
      ["AU", "DSM"],
    ],
  );
});

test("within a region, the latest dated entry wins over undated ones", () => {
  const { lines, earlier } = currentLines([entry("PS Stix"), entry("BBS", "2023")]);
  assert.deepEqual(
    lines.map((l) => l.entry.manufacturer),
    ["BBS"],
  );
  assert.deepEqual(
    earlier.map((e) => e.manufacturer),
    ["PS Stix"],
  );
});

test("several undated shops in one region are all kept", () => {
  const { lines } = currentLines([entry("BBS"), entry("Clutch")]);
  assert.equal(lines.length, 2);
});

test("when everything has ended, the most recent ending is shown as last known", () => {
  const { lines } = currentLines([entry("Watson", "-2019"), entry("PS Stix", "-2021")]);
  assert.deepEqual(
    lines.map((l) => [l.entry.manufacturer, l.year.end]),
    [["PS Stix", 2021]],
  );
});

test("closedYearOf matches shops by name, alias or prefix", () => {
  const shops = [
    { name: "PS Stix", closed: 2025 },
    { name: "Watson Laminates", closed: 2023 },
    { name: "BBS / Generator", closed: null },
    { name: "A Third Foot", closed: 1 },
  ];
  assert.equal(closedYearOf("PS Stix", shops), 2025);
  assert.equal(closedYearOf("Watson", shops), 2023);
  assert.equal(closedYearOf("BBS", shops), null);
  assert.equal(closedYearOf("A Third Foot", shops), true);
  assert.equal(closedYearOf("Nobody", shops), null);
});
