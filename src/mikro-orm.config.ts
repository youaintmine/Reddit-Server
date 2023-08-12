import path from "path";
import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";

export default {
        migrations: {
            path: path.join(__dirname,'./migrations'),
            glob: '!(*.d).{js,ts}'  //All js/ts but not d.js.ts
        },
        entities: [Post, User],
        dbName: 'lireddit2',
        type: 'postgresql',
        debug: !__prod__ ,   //Only true in development
        user: "postgres",
        password: "insidous"
} as Parameters<typeof MikroORM.init>[0];

