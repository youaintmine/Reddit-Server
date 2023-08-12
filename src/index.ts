import "reflect-metadata";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import * as redis from "redis";
import session from "express-session";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  //Integrate Redis
  console.log("This is before");
  const RedisStore = require("connect-redis").default;
  const redisClient = redis.createClient();
  try {
    await redisClient.connect();
  } catch (e) {
    console.error(e);
  }

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5, //5 years
        httpOnly: true,
        sameSite: "lax", //csrf
        secure: __prod__, //cookie only works in https
      },
      saveUninitialized: false,
      secret: "qwerty-env",
      resave: false,
    })
  );
  app.set("trust proxy", true)
  //Integrate graphql server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
    context: ({ req, res }): MyContext => ({ em: orm.em.fork(), req, res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    path: "/",
    cors: { origin: "https://studio.apollographql.com", credentials: true },
  });


  app.get("/", (_, res) => {
    res.send({ message: "Hello Testing Server Route" });
  });
  app.listen(3000, () => {
    console.log("App is listening on port : 3000");
  });
};

main().catch((err) => {
  console.error(err);
});
