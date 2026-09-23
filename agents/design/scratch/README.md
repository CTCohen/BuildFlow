# Scratch demos (internal testing only)

Throwaway builds for Tyler/agents to poke at while testing the Design Agent — NOT client-facing demos, NOT the
curated examples in `agents/design/demos/`. Anything here can be deleted/overwritten any time; nothing here is
ever sent to a prospect. Gitignored except this README.

To build one: `CLIENT=<slug> npm run build` from `app/`, then copy `app/dist/` here if you want to keep it around
past the next build (Astro's `dist/` gets wiped every build).
