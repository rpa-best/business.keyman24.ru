FROM node:lts-alpine as runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY . .
# RUN  npm install

# COPY . .

RUN npm run build

EXPOSE 3000

ENV PORT 3000
