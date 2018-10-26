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

Ask Iswara for `RETREAT_GURU_API_URL` and `RETREAT_GURU_API_TOKEN`

#### Start prisma server and deploy schema

```
docker-compose up -d
npx prisma deploy
```

You'll have access to prisma at http://localhost:4466

#### Start node server

```
npm run dev
```

You'll have access to the node server at http://localhost:4000

#### Start react client

```
cd client
npm start
```

You'll have access to the react client at http://localhost:4000

### Changing the Prisma Schema

If you commit changes to the Prisma Schema, you'll have to re-deploy the change to your local prisma server and generate a new prisma client.

1. Modify the schema file in: `app/dataSources/prisma/datamodel.prisma`
2. Deploy the prisma server with: `npx prisma deploy`
