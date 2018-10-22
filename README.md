# Sivananda Housekeeping App

## Development

Make sure [Docker](https://docs.docker.com/install/) is installed

#### Install dependencies

```
npm install
```

#### Copy example env vars in environmental variables
```
cp .env.example .env
```

#### Start prisma server locally and deploy schema

```
docker-compose up -d
npx prisma deploy
```

#### Start node server locally

```
npm run dev
```

### Changing the Prisma Schema

If you commit changes to the Prisma Schema, you'll have to re-deploy the change to your local prisma server and generate a new prisma client.

Update Prisma Schema

```
prisma/datamodel.prisma
```

Deploy Prisma Server

```
npx prisma deploy
```
