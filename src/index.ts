import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { Post } from "./entities/Post";

const main = async() => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver,PostResolver],
            validate: false
        }),
        context: () => ({em : orm.em.fork()})
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.get('/',(_, res) =>{
        res.send({message : "Hello Testing Server Route"});
    })
    app.listen(3000, () =>{
        console.log("App is listening on port : 3000");
    })
};


main().catch(err => {
    console.error(err);
})