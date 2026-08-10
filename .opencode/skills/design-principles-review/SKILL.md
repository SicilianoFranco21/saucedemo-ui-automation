---
name: design-principles-review
description: Evaluate TypeScript/OOP code against SOLID, DRY, and KISS as a single coordinated lens — not three independent checks. Use during code review of classes, page objects, components, services, or any object-oriented TypeScript code where duplication, coupling, or over-abstraction might be present.
---

# Design Principles Review (SOLID + DRY + KISS)

This skill evaluates code against three principles that are commonly cited together in reviews but come from different origins:

- **SOLID** (Robert C. Martin) — five OOP-specific design principles.
- **DRY** ("Don't Repeat Yourself", *The Pragmatic Programmer*) — a principle about duplicated *knowledge*, not specific to OOP.
- **KISS** ("Keep It Simple, Stupid") — a general engineering heuristic against unnecessary complexity.

They do not derive from one another. They are grouped here because in practice **they pull in opposite directions**, and a good review has to hold all three in mind at once rather than applying them independently.

## The core tension to check for

- SOLID (especially Open/Closed and Dependency Inversion) pushes toward more abstraction: interfaces, base classes, extension points.
- DRY pushes toward extracting duplicated code into shared helpers/classes.
- KISS is the counterweight to both: it asks whether the abstraction or extraction is actually earning its complexity *right now*.

**Do not evaluate DRY or SOLID findings in isolation.** Every time you're about to recommend a new class, interface, or extracted helper, immediately run it through KISS before including it in the findings. If a DRY-motivated extraction would only be reused once, or a SOLID-motivated abstraction has no second implementation on the horizon, downgrade the finding to `Suggestion` or drop it — don't let it read as a hard requirement.

## SOLID — apply contextually, never force

Apply a principle only when it provides clear, practical value in the code under review. If a principle doesn't clearly apply, don't mention it — do not pad the review with principles for the sake of coverage.

- **S — Single Responsibility**: Each class/method should have one reason to change. Flag classes doing too much (e.g. a class that both drives UI interactions and manages test data).
- **O — Open/Closed**: Prefer extension over modification. Flag repeated `if/else` or `switch` chains on type that should instead be resolved by adding a new subclass. Suggest base class patterns when new variants follow the same structure as existing ones.
- **L — Liskov Substitution**: Subclasses must behave consistently with their base. Flag overrides that: throw where the base doesn't, return different types, or silently no-op a behavior callers expect.
- **I — Interface Segregation**: Don't force classes to implement unused members. Keep interfaces/abstract classes lean — flag a base class with methods only some subclasses need.
- **D — Dependency Inversion**: Depend on abstractions, not concretions, when it improves testability or lets consumers swap implementations. Flag tight coupling to a concrete class (e.g. `new ConcreteThing()` deep inside business logic) only when it actually hurts testability or extensibility in this codebase — not as a blanket rule.

## DRY — genuine duplication only

- Identify **duplicated logic**, not duplicated *shape*. Two classes that happen to have similarly-named methods doing conceptually different things are not a DRY violation.
- A DRY violation is confirmed when: the same business rule, calculation, or interaction sequence is written more than once, and a change to it would require editing more than one place today.
- Do not force DRY extraction when it would: introduce coupling between unrelated concerns, reduce readability at the call site, or create an abstraction for a duplication that's coincidental (same code, unrelated reasons to change — see SRP).

## KISS — the default filter on every other finding

- Before including any recommendation that adds a class, interface, generic, or indirection layer, ask: *"Is this truly needed right now, with the evidence in front of me?"*
- Prefer a clear, slightly repetitive solution over a clever abstracted one that a newcomer to the codebase would need to trace through multiple files to understand.
- A KISS violation looks like: unnecessary generics, a factory for a single concrete type, an interface with exactly one implementation and no planned second one, or premature configuration options for cases that don't exist yet.

## Worked example (TypeScript)

```typescript
// Before — flagged
class LoginPage {
  async login(user: string, pass: string) { /* ... */ }
}
class CheckoutPage {
  async login(user: string, pass: string) { /* duplicated block */ }
}
```

- **DRY**: genuine duplication of the login sequence → recommend extraction.
- **KISS check on the fix**: does this need a `LoginMixin` interface plus a factory? No — a shared `AuthHelper` class or a method on a common base page is enough. Recommending the interface+factory version would be a KISS violation introduced *by* the DRY fix — call that out explicitly if you see it proposed.

```typescript
// Correct-sized fix
abstract class BasePage {
  async login(user: string, pass: string) { /* shared, single implementation */ }
}
```

## Output contract

Return findings in the same severity/location/issue/recommendation shape the calling agent uses. For each finding, tag it as one of: `SOLID (S/O/L/I/D)`, `DRY`, or `KISS`. When a KISS check downgrades or cancels a SOLID/DRY finding, say so explicitly (e.g. "DRY duplication is real, but KISS: a shared method is enough, not a new interface").
