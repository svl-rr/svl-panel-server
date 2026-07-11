# Block Name Review — Panel Source Cross-Reference

The names in [`block-names.js`](block-names.js) were validated against the live
dispatch panels during ops. While wiring up the canonical source, the
authoritative dispatch SVGs in `svl-panel-server`
(`static/web/svg/userPanels/DispatchNorth.svg`, `DispatchSouth.svg`) were
parsed for their internal sensor **class** names (e.g. `class="sensor FrytonSiding"`).

Most agree with the deployed names. The items below **disagree** — worth a
dispatcher's eyes before changing, since the panel class can sometimes be a
control-point/signal-group label rather than the block's station name.

| Block | Current name (`block-names.js`) | Panel sensor class | Note |
|------:|----------------------------------|--------------------|------|
| 177 | Igo Siding | `FrytonSiding` | **Likely wrong.** 177 sits in the Fryton/Ebbetts row on the South panel; was an editor pre-fill guess, never confirmed live. Probably **Fryton Siding**. |
| 599 | Quinn Siding | `RavineMain` | **Likely wrong.** Panel groups 599 with Ravine, not Quinn. Probably **Ravine** (or Ravine Siding). |
| 202 | Jacksonville NB | `JacksonvilleSB` | Direction may be **reversed** — panel marks 202 as SB. |
| 203 | Jacksonville SB | `JacksonvilleNB` | Direction may be **reversed** — panel marks 203 as NB. |
| 102 | Cavanaugh Main | `BayshoreSingle` | 102 may be the **Bayshore single-track approach**, not Cavanaugh. |
| 331 | Loop NB Lower | `LoopOuter` | Cosmetic — different naming scheme (Outer/Inner vs NB/SB Lower). |
| 332 | Loop SB Lower | `LoopInner` | Cosmetic — see above. |

Blocks whose panel class **confirms** the current name (no action): 150 Eagle,
173 Ebbetts, 174 Fryton, 178 Greeley, 179 Hallelujah, 252/253 Igo NB/SB,
300/301 Jericho NB/SB, 330 Kaos, 450 Mt. Marvel, 574 Paso, 602/603 Silicon
(Main/Siding).

> 653 also reports class `PasoMain`, but it was confirmed live as **Tracy
> Depot** — a case where the class is a shared signal-group label, not the
> block name. Left as Tracy Depot.

**To resolve:** confirm the 5 flagged blocks on the panel, then edit
`block-names.js` (single source) — the train log, CSV, replay, and home map all
read from it.
