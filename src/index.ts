import { MikroORM, RequiredEntityData} from "@mikro-orm/core";
import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async() => {
    const orm = await MikroORM.init(microConfig);
    orm.getMigrator().up();

    const emFork = orm.em.fork();
    const post = emFork.create(Post, {
        title: "my first post",
    }) as RequiredEntityData<Post>;
    await emFork.persistAndFlush(post);
    const posts = await emFork.find(Post, {});
    console.log(posts);

};


main().catch(err => {
    console.error(err);
})