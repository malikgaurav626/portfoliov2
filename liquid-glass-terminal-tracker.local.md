# Liquid Glass Terminal Overhaul Tracker

Do not commit this file.

## Goal

Push the desktop HUD toward a real sci-fi terminal look inspired by the provided screenshot:
- darker glass panels
- mission/status top bar
- stronger terminal chrome
- more cohesive left/right shell
- recruiter panel that feels like a live console

## Scope For First Pass

- Desktop `LargeBody` first
- Keep TV channel work intact
- Focus on shell/layout/chrome before deep content restructuring

## Done

- Created experimental branch: `feature/liquid-glass-terminal-ui`
- Started design audit for:
  - `src/components/Large/LargeBody.jsx`
  - `src/components/RecruiterPanel/RecruiterPanel.jsx`
  - `src/App.css`
- Added a desktop-only top status bar in `LargeBody`
- Added terminal tabs + console prompt area to `RecruiterPanel`
- Added a first-pass liquid-glass visual system in `App.css`
- Removed visible borders from the experiment shell and cards
- Shifted the layout closer to the screenshot:
  - left side as floating widgets
  - right side as a denser dark terminal console
- Restyled the lower-left dock:
  - channel selector
  - transport controls
  - footer/QR/time block
- Fixed the channel selector dropdown in the experimental dock
- Verified with `npm run build`

## In Progress

- Tighten proportions and spacing against the screenshot reference
- Tune icon sizing / spacing in the lower-left dock after visual review

## Next

- Add lower telemetry / dock cards if the first pass feels strong
- Tune per-channel accents so the glass system still reacts to scene theme

## Notes

- Keep this branch exploratory
- Do not commit this tracker
