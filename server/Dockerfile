FROM node:18-alpine
WORKDIR /usr/src/app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# Copy source
COPY . .

ENV PORT 5174
EXPOSE 5174

CMD ["node", "index.js"]
