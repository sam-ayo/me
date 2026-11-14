# The image for the Oracle Cloud VM. See deploy/README.md.
FROM node:24-slim AS build
WORKDIR /app
RUN npm install -g pnpm@9
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# The build reads the post views from Redis. The secret file gives the
# environment for the build only, so the image does not keep the tokens.
RUN --mount=type=secret,id=env,target=/app/.env.production pnpm build
# pdfkit loads its standard fonts with a computed path, so the file trace of
# Next.js does not find them. The resume route needs them to render the PDF.
RUN for d in node_modules/.pnpm/pdfkit@*; do \
      cp -r "$d/node_modules/pdfkit/js/standard-fonts" ".next/standalone/$d/node_modules/pdfkit/js/"; \
    done

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
