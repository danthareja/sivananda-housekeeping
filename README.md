# Sivananda Housekeeping App

## Development

### Required Software

Make sure the following software exists on your computer:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/) >= v8
- [MongoDB](https://docs.mongodb.com/manual/installation/)

#### Start MongoDB

```
mongod
```

This process will keep running in the background until you restart your machine

#### Clone the repository

```
git clone https://github.com/danthareja/sivananda-housekeeping.git
cd sivananda-housekeeping
```

#### Install dependencies

```
npm install
```

#### Configure environmental variables

```
cp .env.example .env.local
vi .env.local
```

Ask Iswara for `RETREAT_GURU_API_URL` and `RETREAT_GURU_API_TOKEN`

#### Run the development server

```
npm run dev
```

While running, you'll have access to the following resources:

- http://localhost:4000 - GraphQL server
- http://localhost:3000 - React dev server with hot-reloading
