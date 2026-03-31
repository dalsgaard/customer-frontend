# Customer Frontend

A fun project exploring Lit web components with signals and Web Awesome UI, deployable to AWS via CDK.

## Stack

- **[Lit](https://lit.dev/)** — Web Components library
- **[Web Awesome](https://shoelace.style/)** (Shoelace) — UI component library built on Lit
- **[@lit-labs/signals](https://github.com/lit/lit/tree/main/packages/labs/signals)** — reactive signals for Lit
- **Vite + TypeScript** — local dev and builds
- **S3 + CloudFront via CDK** — AWS deployment

## Project Structure

```
customer-frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts
│   └── components/
│       └── app-root.ts        # sample Lit + signals component
└── infra/                     # CDK stack
    ├── cdk.json
    ├── package.json
    ├── tsconfig.json
    ├── bin/app.ts
    └── lib/frontend-stack.ts  # S3 + CloudFront
```

## Signals

Signals are defined outside components and shared freely across the tree:

```ts
import { signal } from "@lit-labs/signals";

const count = signal(0);
```

Components opt in to signal reactivity via `SignalWatcher`:

```ts
export class MyComponent extends SignalWatcher(LitElement) {
  render() {
    return html`<p>${count.get()}</p>`;
  }
}
```

## Local Development

```bash
npm install
npm run dev
```

## Deploy to AWS

Build the frontend first, then deploy the CDK stack:

```bash
npm run build

cd infra
npm install
npm run deploy
```

The CDK stack provisions:
- S3 bucket (private, no public access) with OAC
- CloudFront distribution with HTTPS redirect
- SPA-friendly 404 → 200 routing
- Outputs the CloudFront URL on deploy
