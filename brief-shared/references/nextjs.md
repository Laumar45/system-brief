# Next.js Briefing Reference

Use this reference only when the target is a web application using Next.js. It supplements, but does not replace, `sections-reference.md`.

## Stack questions to resolve

- Next.js version and App Router or Pages Router.
- Rendering boundary: Server Component, Client Component, static generation, dynamic rendering, or streaming.
- Data source and ownership: browser-only state, server action, Route Handler, external API, or database.
- Authentication, authorization, session storage, and CSRF strategy when accounts exist.
- Cache and revalidation policy for each remote read; never write “use caching” without a TTL or invalidation rule.
- Deployment target (Node, serverless, edge) and environment-variable policy.

## Web-specific brief sections

For UI projects, Visual Identity and Layout remain applicable. In addition, document:

| Area | Required contract |
|---|---|
| Route map | URL, access rule, loading UI, error UI, not-found behavior |
| Server/client boundary | Which component owns data fetching and why |
| Forms and mutations | Validation location, pending state, error response, retry behavior |
| Accessibility | Keyboard order, focus restoration, labels, live-region behavior |
| SEO | Metadata, canonical URL, robots, sitemap, and structured data when relevant |
| Security | Trust boundary, input validation, secret handling, authorization check |

## Recommended contract style

```tsx
type UserListProps = {
  users: readonly User[]
  onSelect: (id: UserId) => void
}
```

The brief must state whether a component is a Server or Client Component, what data it receives, and which event crosses the boundary. Do not pass secrets or server-only clients into client components.

## Skip rules

- A backend-only Route Handler project skips Visual Identity and replaces Layout with a route contract table.
- A static marketing page may skip database and mutation sections, but still documents routes, metadata, accessibility, and responsive states.
- Do not add TanStack Query, a state library, or an ORM without a project-specific reason and an explicit decision.
