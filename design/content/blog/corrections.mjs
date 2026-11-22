/**
 * Corrections applied to synced Soro articles before they become static pages.
 *
 * Why: the confirmed service area is Helsinki, Espoo, Vantaa and Kauniainen
 * (owner, 22 November 2026). DriveMe does not serve the rest of Uusimaa. A car
 * is always collected in those four cities; a longer drive from there to
 * elsewhere in Finland is available on a separate quote. Several articles
 * written before that decision say "muualla Uudellamaalla" (elsewhere in
 * Uusimaa), which would publish a coverage claim the business does not make.
 *
 * Each entry replaces one exact sentence. build/blog-sync.mjs applies them and
 * then refuses to write anything if a coverage claim is still present (see
 * FORBIDDEN below), so a new or edited article can never slip a wrong claim
 * onto an indexable page unnoticed.
 *
 * The lasting fix is to edit the same sentences in Soro: the widget on /blogi/
 * shows Soro's own text. Once an article is fixed at the source, its entry
 * simply stops matching and can be deleted.
 */

export const CORRECTIONS = [
  [
    'Pidemmät ajot voidaan järjestää koko Suomessa saatavuuden ja erillisen tarjouksen perusteella.',
    'Pidemmät ajot pääkaupunkiseudulta muualle Suomeen voidaan järjestää saatavuuden ja erillisen tarjouksen perusteella.',
  ],
  [
    'Pääkaupunkiseudulla Helsingin, Espoon, Vantaan ja Kauniaisten väliset ajot ovat tyypillisiä, mutta myös muualla Uudellamaalla ja pidemmillä reiteillä toteutus voidaan sopia erikseen.',
    'Palvelemme Helsingissä, Espoossa, Vantaalla ja Kauniaisissa, ja niiden väliset ajot ovat tyypillisiä. Pidemmästä siirrosta pääkaupunkiseudulta muualle Suomeen voidaan sopia erikseen.',
  ],
  [
    'Muualla Uudellamaalla tai pidemmillä reiteillä Suomessa saatavuus, hinta ja aikataulu vahvistetaan reitin mukaan ennen ajoa.',
    'Pidemmillä reiteillä pääkaupunkiseudulta muualle Suomeen saatavuus, hinta ja aikataulu vahvistetaan reitin mukaan ennen ajoa.',
  ],
  [
    'Muualla Uudellamaalla tai pidemmillä kotimaan reiteillä saatavuus, aikataulu ja hinta arvioidaan erikseen ennen ajoa.',
    'Pidemmillä reiteillä pääkaupunkiseudulta muualle Suomeen saatavuus, aikataulu ja hinta arvioidaan erikseen ennen ajoa.',
  ],
  [
    'Pidemmät reitit muualla Uudellamaalla tai Suomessa suunnitellaan erikseen.',
    'Pidemmät reitit pääkaupunkiseudulta muualle Suomeen suunnitellaan erikseen.',
  ],
  [
    'Muualla Uudellamaalla ja pidemmillä reiteillä palvelu voidaan järjestää erikseen sovittavasti, kun saatavuus, hinta ja aikataulu on vahvistettu.',
    'Pidemmät siirrot pääkaupunkiseudulta muualle Suomeen voidaan järjestää erikseen sovittavasti, kun saatavuus, hinta ja aikataulu on vahvistettu.',
  ],
  [
    'Muualla Uudellamaalla ja pidemmillä reiteillä saatavuus, hinta ja aikataulu sovitaan reitin mukaan ennen ajoa.',
    'Pidemmillä reiteillä pääkaupunkiseudulta muualle Suomeen saatavuus, hinta ja aikataulu sovitaan reitin mukaan ennen ajoa.',
  ],
  [
    'Muualla Uudellamaalla ja pidemmillä reiteillä saatavuus, hinta ja aikataulu sovitaan reitin perusteella ennen ajoa.',
    'Pidemmillä reiteillä pääkaupunkiseudulta muualle Suomeen saatavuus, hinta ja aikataulu sovitaan reitin perusteella ennen ajoa.',
  ],
  [
    'Muualla Uudellamaalla ja pidemmillä kotimaan reiteillä saatavuus, hinta ja aikataulu sovitaan erikseen ennen ajoa.',
    'Pidemmillä reiteillä pääkaupunkiseudulta muualle Suomeen saatavuus, hinta ja aikataulu sovitaan erikseen ennen ajoa.',
  ],
];

/**
 * Coverage claims that must not reach a static page. Matched on the article's
 * text with tags removed, case-insensitively. "Pääkaupunkiseutu" is not here:
 * it means exactly Helsinki, Espoo, Vantaa and Kauniainen.
 */
export const FORBIDDEN = [
  /uusimaa/i, /uudellamaalla/i, /uudeltamaalta/i, /uudenmaan/i, /uudellemaalle/i,
  /koko suomessa/i, /koko suomen alueella/i, /valtakunnallisesti/i,
];

/** Apply the corrections to one article's HTML. Returns { html, applied }. */
export function correct(html) {
  let out = html;
  let applied = 0;
  for (const [from, to] of CORRECTIONS) {
    if (out.includes(from)) { out = out.split(from).join(to); applied++; }
  }
  return { html: out, applied };
}

/** The forbidden phrases still present in an article, as readable snippets. */
export function coverageViolations(html) {
  const text = String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const hits = [];
  for (const re of FORBIDDEN) {
    const m = re.exec(text);
    if (m) hits.push(text.slice(Math.max(0, m.index - 60), m.index + 60).trim());
  }
  return hits;
}
