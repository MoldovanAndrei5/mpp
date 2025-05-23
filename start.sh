#!/bin/sh

npx prisma migrate deploy
npx prisma db seed
npx tsx src/api/route.ts
