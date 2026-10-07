# Contributing

Issues và câu hỏi bằng tiếng Việt đều được chào đón. The rest of this file is in English because the skill files are.

This repository is a set of instructions that an AI agent reads and acts on. That makes it different from ordinary code: a wrong sentence ships a wrong screen to every user, and a hidden sentence could make the agent do something its user never asked for. The rules below exist for that reason.

## What is welcome

- A new tell in `references/tells-mobile.md` or a new rule in `references/layout-mechanics.md`, with a reason, a check and an alternative, **appended with a new ID**. IDs are never renumbered or removed; `MOBILE-DESIGN.md` files and audit reports in other people's projects cite them.
- A correction to a stack reference, with the SDK or library version you verified it against. Claims marked "(verified)" need the same.
- A fix to an unclear or wrong sentence, a broken link, a missing cross-reference.
- A new example run under `examples/<name>/` following the shape of `examples/warehouse`: the locked `MOBILE-DESIGN.md`, the source, screenshots, a README that says what was verified and what was not.
- A new stack reference (`references/stack-<name>.md`) that maps every rule ID to that stack's APIs. Open an issue first so the structure matches the three existing ones.

## What is not accepted

- Scripts, binaries or executables anywhere except `scripts/` (repository tooling) and `examples/*/app/`. The skill itself is Markdown only.
- Anything the agent would read that the user would not see: HTML comments in skill files, zero-width or bidirectional characters, text styled to be invisible.
- Instructions that download and run code, decode payloads, or tell the agent to hide something from the user.
- New numeric dials, new question rounds, or anything that turns the brief gate into an interview. See `SKILL.md` ground rules.
- Taste opinions without a source or a reproduction. "I prefer rounded buttons" is not a rule; "Material 3 filled buttons are pills, see m3.material.io" is.
- Changes to `.github/workflows/` from outside the maintainer, except when discussed in an issue first.

## How to contribute

1. Open an issue or a discussion first for anything larger than a sentence. It saves both of us a rewrite.
2. Fork, branch, change. Run the validator:

   ```bash
   node scripts/validate.mjs
   ```

   It checks file types, hidden characters, suspicious commands, relative links, SKILL.md front matter, that every reference file is reachable from `SKILL.md`, and that no tell or rule ID disappeared.
3. For a stack change, run the example or your own project on that stack and say so in the PR.
4. Open the pull request with the template filled in. CI runs the validator and typechecks the example with a read-only token.
5. The maintainer reviews every PR; `main` only changes through a reviewed pull request. Expect questions about evidence.

## Style

- Short declarative sentences. Numbers and IDs in prose. No marketing adjectives.
- A rule says what to do, why, and how it is checked. If it cannot be checked (grep, count, measure, or quoted evidence), it is not a rule yet.
- Keep the three responsibilities apart: `MOBILE-DESIGN.md` says what, `stack-*.md` says how, `layout-mechanics.md` says how it must behave.
- English in skill files; the user-facing copy inside examples may be in the example's language.

## Security

See `SECURITY.md`. Please report hidden-instruction or unsafe-command issues privately rather than in a public issue.
