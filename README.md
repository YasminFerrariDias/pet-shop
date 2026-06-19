# Pet Shop

Aplicação web de e-commerce para pet shop desenvolvida com Next.js, Prisma e PostgreSQL.

## Tecnologias

- [Next.js](https://nextjs.org/) — framework React com SSR e App Router
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Prisma](https://www.prisma.io/) — ORM para banco de dados
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
- [Docker](https://www.docker.com/) — ambiente de banco de dados em container
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- [shadcn/ui](https://ui.shadcn.com/) — componentes de interface

## Como Executar

Requisito: [Node.js](https://nodejs.org/), [Docker](https://www.docker.com/) e [pnpm](https://pnpm.io/)

```bash
pnpm install
docker-compose up -d
cp .env.example .env
pnpm prisma migrate dev
pnpm dev
```

## Deploy

[Pet Shop](https://pet-shop-five-topaz.vercel.app)

## Sobre

Projeto fullstack desenvolvido para praticar Next.js com App Router, integração com banco de dados via Prisma e deploy na Vercel.
