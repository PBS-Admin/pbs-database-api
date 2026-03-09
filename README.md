## Introduction

This is a Next.js app with an API that allows integration between the ABIS Adjutant system and our PBS internal applications.

### Production

Open [https://pbs-database-api.vercel.app/](https://pbs-database-api.vercel.app/) to view the production API

## API Routes

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).

### Live routes

- [`/api/employees`](https://pbs-database-api.vercel.app/api/employees)
- [`/api/employees/[id]`](https://pbs-database-api.vercel.app/api/employees/1)
- [`/api/projectinfo`](https://pbs-database-api.vercel.app/api/projectinfo)


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
