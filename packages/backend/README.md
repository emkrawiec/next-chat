# @next-chat/backend
Node.js backend for next-chat.

Stack:
- Node.js with Typescript,
- `Express.js`,
- `PostgreSQL` with `Prisma` ORM,
- Websockets with `Socket.io`,
- Auth with `Passport`, local strategy,
- Cache with `Redis`,
- `Stripe` for payment processing
- Asynchronous task processing with `Redis` backend with `Bull`,
- Transactional emails with `Mailjet`,
- Email templating with `MJML` and `Handlebars`,
- `worker_threads` backed by Piscina thread pool for CPU intensive tasks (e.g. image resizing with `Sharp`),
- Global error handling with `Sentry`, loggin with `winston`
