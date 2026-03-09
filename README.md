# Who Makes Your Deck?

A searchable database of skateboard deck brands and the woodshops that manufacture them. Built for personal use because I got tired of not knowing who actually presses the boards I buy.

Live at [hotwaffles.lol/woodshops](https://hotwaffles.lol/woodshops/)

---

## What it does

- Lists ~250+ skateboard brands alongside their manufacturer, country of origin, and regional variants
- Shows manufacturing history — when brands have switched woodshops, both entries are recorded with date context
- Separate woodshops directory with details on each manufacturer (est. year, links, status)
- Resellers/distributors section for shops that don't press their own boards
- Filter by manufacturer, country, or region

## Data

All data is community-sourced from the [Slap Magazine Forums woodshop thread](https://www.slapmagazine.com/index.php?topic=120409.0), which has been running since at least 2019 and is maintained by a dedicated group of people who genuinely care about this stuff. Credit to everyone who has contributed to that thread over the years.

Data is periodically scraped and updated but **I make no guarantees about accuracy or completeness**. Brands change manufacturers, woodshops close, and the community doesn't always catch everything in real time. If you need to know for certain who makes a specific board, check the deck itself or ask the brand directly.

## Stack

- Vite + React
- No backend, no database — just a big array of objects and some filtering logic
- Deployed as a static site on AWS S3

## Vibe coded with Claude

This app was built through conversation with [Claude](https://claude.ai) (Anthropic) using [Claude Code](https://claude.ai/claude-code). The data scraping pipeline, UI, and most of the architectural decisions were worked out collaboratively. It's a personal project and the code reflects that — functional over fancy.

## Disclaimer

This is a personal hobby project. Data may be incomplete, outdated, or wrong. Nothing here is official. Don't use this to make important purchasing decisions. I'm just a person on the internet who likes knowing where their skateboard came from.
