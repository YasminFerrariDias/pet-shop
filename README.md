# Pet Shop

Aplicação web de e-commerce para pet shop desenvolvida com Next.js, Prisma e PostgreSQL, com deploy na Vercel.

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
# Instalar dependências
pnpm install

# Subir o banco de dados
docker-compose up -d

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar as migrations
pnpm prisma migrate dev

# Iniciar o servidor
pnpm dev
```

Acesse: `http://localhost:3000`

## Deploy

[pet-shop-five-topaz.vercel.app](https://pet-shop-five-topaz.vercel.app)
