FROM node:16-alpine AS frontend-builder

COPY frontend/package.json .
COPY frontend/yarn.lock .

RUN yarn install --non-interactive

COPY frontend .

RUN yarn build


FROM node:16-alpine

WORKDIR /chat

COPY backend/package.json .
COPY backend/yarn.lock .

RUN yarn install --production --non-interactive

COPY backend .
COPY --from=frontend-builder dist dist

ENTRYPOINT []

CMD ["node","app.js"]