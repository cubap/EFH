# Shadowdark Homebrew Edition — Character Randomizer

This repository is a static GitHub Pages site. The only thing here is the
character randomizer, served as a single self-contained page.

## What you'll find

- **`summon.html`** — the character randomizer. Open it directly or visit
  `https://cubap.github.io/EFH/summon.html`. It rolls a complete Shadowdark
  Homebrew Edition character: stats, class, ancestry, background, alignment,
  deity, talent, HP, and a name.

That's all. No build step, no dependencies, no server.

## Development

All development happens on the [`dev`](https://github.com/cubap/EFH/tree/dev)
branch, which contains the full project: the character builder, class and rules
pages, data files, and the source for the randomizer. `main` is reserved for
the published Pages output and should only ever receive the finished
`summon.html`.
