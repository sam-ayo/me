about me + professional life

Check it [out](https://samayo.me)

## Deploy

The site runs on Cloudflare Workers with [OpenNext](https://opennext.js.org/cloudflare).

1. Put `NEXT_PUBLIC_BASE_URL`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` in `.env.production`. The build puts `NEXT_PUBLIC_BASE_URL` into the browser code.
2. Run `pnpm run deploy`.

The Worker reads the Upstash values from Cloudflare secrets. To change one, run `npx wrangler secret put <NAME>`.
To test the build locally, put the same values in `.dev.vars`, then run `pnpm run preview`.
