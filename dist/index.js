"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_core_1 = require("apollo-server-core");
const core_1 = require("@mikro-orm/core");
const constant_1 = require("./constant");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const redis = __importStar(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const app = (0, express_1.default)();
    console.log("This is before");
    const RedisStore = require("connect-redis").default;
    const redisClient = redis.createClient();
    try {
        await redisClient.connect();
    }
    catch (e) {
        console.error(e);
    }
    app.use((0, express_session_1.default)({
        name: "qid",
        store: new RedisStore({
            client: redisClient,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
            httpOnly: true,
            sameSite: "lax",
            secure: constant_1.__prod__,
        },
        saveUninitialized: false,
        secret: "qwerty-env",
        resave: false,
    }));
    app.set("trust proxy", true);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)({})],
        context: ({ req, res }) => ({ em: orm.em.fork(), req, res }),
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
//# sourceMappingURL=index.js.map