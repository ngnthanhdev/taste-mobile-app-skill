# Security

This repository contains instructions that AI coding agents read and follow, plus an example app. The threats that matter here are different from a library's:

- **Hidden instructions**: text in a skill file that a reviewer cannot see but an agent can (HTML comments, zero-width or bidirectional characters, white-on-white tricks in rendered Markdown).
- **Unsafe commands**: a reference that tells the agent to download and execute something, decode a payload, or delete files.
- **Instructions that work against the user**: anything telling the agent to hide an action, send data somewhere, or ignore the user's own rules.

The validator in `scripts/validate.mjs` runs on every pull request and blocks the patterns above that it can detect. It is a floor, not a guarantee; the maintainer reviews every change by reading the diff.

## Reporting

Use the private advisory form: https://github.com/ngnthanhdev/taste-mobile-app-skill/security/advisories/new

Include the file and line, what an agent would do when it reads it, and how you found it. Reports are acknowledged within a few days. Please do not open a public issue for a hidden-instruction finding until it is fixed, since users may have the skill installed.

## Scope

In scope: `SKILL.md`, `references/`, `templates/`, `scripts/`, `.github/`. The example under `examples/` is sample code with an in-memory store and no network layer; bugs there are ordinary bug reports.
