# Database-Viewer

A tool to work with databases, currently only PostgreSQL supported and currently no plans to support other dbs

## Structure

- `data-loader`: module to load data from db, used by `server` and `electron-app`
- `electron-app`: desktop app!
- `frontend`: React module, used by `electron-app` and `web-graphql-frontend`
- `server`: node.js server to serve graphql data
- `types`: types are shared across other modules
- `web-graphql-frontend`: React frontend for browser, includes code for loading data from server

## How to

Before begin, install Postgres

[Here is a link](https://www.postgresqltutorial.com/postgresql-sample-database/)
to a sample database with instructions

To launch in browser:
```shell
cd web-graphql-frontend
yarn
yarn start

# in second terminal
cd server
yarn
yarn start
```

Try to find a `+` sign in the left sidebar, it will open a dialog to connect to database, write database credentials and hit connect.
After dialog will close - reload the page, need to fix it, after reloading you should see a tree in sidebar

To launch in electron app:
```shell
cd electron-app
yarn
yarn start
```

And the same as above about `+` sign.
