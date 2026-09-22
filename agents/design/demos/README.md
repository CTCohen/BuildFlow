# Demo builds

Persistent, git-ignored-but-documented storage for generated demo site builds that are worth keeping around for
review — not the ephemeral build output Astro or the smoke-test agent produce on every run.

## What lives here vs. what doesn't

- **`app/dist/`** is Astro's own build output. It's gitignored, gets wiped and regenerated on every `astro
  build`, and is never a storage location — don't save anything there.
- **`agents/design/out/smoke/`** (the smoke-test agent's default `--out`, see `agents/design/smoke.mjs`) is
  scratch space for a single smoke-test run: N sample clients through the QA loop, linked from one `index.html`.
  It gets overwritten by the next run and isn't meant to be kept.
- **`agents/design/demos/<tranche>/<vertical>-<slug>/`** (here) is where a build gets copied when it's worth
  keeping around past the run that produced it — a build Tyler wants to re-look at, one flagged in a QA
  escalation, a reference build for a design-system review, or a demo about to go out in outreach. `<tranche>` is
  `micro`, `smb`, or `mid-market` (see the tranche subfolders below); `<vertical>` and `<slug>` match the
  client's own `vertical`/`slug` fields (e.g. `hvac-deljoheating`).

## What's tracked in git

Only this README and any curated review report (a `.md` writeup of what was reviewed and why) are tracked. The
generated HTML/CSS/JS/assets themselves are **not** tracked — see the root `.gitignore` entry for
`agents/design/demos/*/*/`. Nothing here is a build artifact of record; if a build needs to survive a
`git clone`, that's a hosting/deployment concern (`systems/hosting.md`), not this folder.

## How something gets here

Not automated yet. Today: copy (never move) a build's output directory from wherever it was generated
(`agents/design/out/smoke/<slug>/` or a one-off `runWithQa` output) into
`agents/design/demos/<tranche>/<vertical>-<slug>/`. If/when this becomes a scripted step (e.g. a `--save`
flag on `smoke.mjs` or a promote-to-demos script), document that here and in the relevant `systems/design-*.md`
file at the same time.
