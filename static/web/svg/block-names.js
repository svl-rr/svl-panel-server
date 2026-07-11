/* ──────────────────────────────────────────────────────────────────────────
 * SVL Layout Control — Canonical Block Names
 *
 * Single source of truth mapping JMRI block numbers (IMBA<n> / BLOCK<n>) to
 * human-readable names. Loaded as a plain <script> so it works over both
 * http:// (JMRI web server) and file:// (no fetch/CORS dependency), matching
 * how svl-theme.css is shared.
 *
 * Consumers:
 *   - train-status/web/train-status.html  (event log, CSV export, replay)
 *   - home.html                           (block occupancy mini-map tooltips)
 *
 * To rename a block, edit it HERE only. Deploy this file to the JMRI svg root
 * alongside home.html (same folder level as svl-theme.css).
 *
 * Names were validated against the live dispatch panels. A handful of South
 * blocks differ from the panels' internal sensor classes — see
 * block-names-review.md for the open questions before changing them.
 * ────────────────────────────────────────────────────────────────────────── */
(function (global) {
  var NAMES = {
    // ── Dispatch North ──────────────────────────────────────────────
    // Windsor / Victoria / Upton / Quinn (upper main)
    726: 'Victoria',
    705: 'Upton',          706: 'Upton Siding',      708: 'Upton Intermodal',
    709: 'Windsor Industrial',
    704: 'Ravine',         598: 'Quinn',             599: 'Quinn Siding',
    707: 'Quinn Main',
    // Tracy / Silicon / Paso (lower main)
    654: 'Tracy Depot',    653: 'Tracy Depot',       652: 'Tracy Main',
    649: 'Tracy Siding',   603: 'Silicon Siding',    602: 'Silicon',
    574: 'Paso',
    // Nowheres
    554: 'Nowheres West',  500: 'Nowheres Main NB',  553: 'Nowheres Passenger',
    552: 'Nowheres Yard',  550: 'Nowheres South',    501: 'Nowheres Main SB',
    // Loop / Mt. Marvel
    449: 'Loop NB Upper',  331: 'Loop NB Lower',     450: 'Mt. Marvel',
    448: 'Loop SB Upper',  332: 'Loop SB Lower',

    // ── Dispatch South ──────────────────────────────────────────────
    // Jasper / Kaos / Jericho / Jacksonville (upper)
    335: 'Jasper',         330: 'Kaos',
    302: 'Kalamazoo',      303: 'Kalamazoo Industrial',
    300: 'Jericho NB',     301: 'Jericho SB',
    278: 'Jacksonville NB', 202: 'Jacksonville NB',  203: 'Jacksonville SB',
    // Hallelujah / Greeley / Igo (mid)
    249: 'Hallelujah Industrial', 179: 'Hallelujah',  178: 'Greeley',
    252: 'Igo NB',         253: 'Igo SB',            177: 'Igo Siding',
    // Ebbetts / Eagle / Fryton / Dayton (lower)
    173: 'Ebbetts',        150: 'Eagle',             174: 'Fryton',
    134: 'Fryton Industrial', 132: 'Fryton South',   131: 'Interchange',
    20:  'Interchange South', 133: 'Branch',         130: 'Dayton',
    // Cavanaugh / Bayshore approach
    102: 'Cavanaugh Main', 98:  'Cavanaugh NB',      99:  'Cavanaugh SB',
    19:  'Cavanaugh Siding', 17: 'Dodge',            16:  'Carlsbad'
  };

  global.SVL_BLOCK_NAMES = NAMES;

  // Helper: "Upton (705)" when named, "Block 705" otherwise.
  global.svlBlockLabel = function (num) {
    return NAMES[num] ? NAMES[num] + ' (' + num + ')' : 'Block ' + num;
  };
})(typeof window !== 'undefined' ? window : this);
