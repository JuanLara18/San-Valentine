# Contributing

Thanks for wanting to make Love Quest better. Contributions are welcome — here's what fits the project well.

## What's most useful

- **New languages** — add a JSON file in `src/i18n/` and register it in `index.ts`. See [Customization Guide](docs/CUSTOMIZING.md#adding-a-new-language).
- **Mobile improvements** — the game runs on all screen sizes but there's always room to improve touch experience.
- **Bug fixes** — especially around level progression, audio initialization, or platform edge cases.
- **Level design** — new levels added to `LevelManager.ts` following the existing data structure.

## What to keep in mind

The north star of this project is **a non-developer being able to fork, customize, and deploy in under 5 minutes**. Any change that makes that harder is likely out of scope, no matter how technically interesting.

## How to submit a change

1. Fork the repo
2. Create a branch: `git checkout -b fix/your-topic`
3. Make your change — keep it focused
4. Test it locally: `npm install && npm run dev`
5. Open a pull request with a clear description of what changed and why

## Local setup

```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # check that the production build passes
```

No special tooling required beyond Node 20+.
