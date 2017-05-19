module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/nailpolish',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev',
    },
    useNullAsDefault: true,
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/jetfueltest',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/test/seeds',
    },
  },
  // staging: {
  //   client: 'pg',
  //   connection: process.env.DATABASE_URL + `?ssl=true`,
  //   migrations: {
  //     directory: './db/migrations',
  //   },
  //   useNullAsDefault: true,
  // },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations',
    },
    useNullAsDefault: true,
  },
};
