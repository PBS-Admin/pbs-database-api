## Introduction

This is a Next.js headless API app that allows integration between the ABIS Adjutant system and our PBS internal applications.

### Production

Open [https://pbs-database-api.vercel.app/](https://pbs-database-api.vercel.app/) to view the production API

## API Routes

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).

### Live routes

- [`/[slug]`](https://pbs-database-api.vercel.app/dynamic-slug)
- [`/api`](https://pbs-database-api.vercel.app/api)
- [`/api/compjobs`](https://pbs-database-api.vercel.app/api/compjobs)
- [`/api/compjobs/[id]`](https://pbs-database-api.vercel.app/api/compjobs/1)
- [`/api/employees`](https://pbs-database-api.vercel.app/api/employees)
- [`/api/employees/[id]`](https://pbs-database-api.vercel.app/api/employees/1)
- [`/api/projectinfo`](https://pbs-database-api.vercel.app/api/projectinfo)
- [`/api/salesquotes`](https://pbs-database-api.vercel.app/api/salesquotes)
- [`/api/salesquotes/[id]`](https://pbs-database-api.vercel.app/api/salesquotes/1)
- [`/api/secret`](https://pbs-database-api.vercel.app/api/secret)

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/route.ts`. The page auto-updates as you edit the file.
