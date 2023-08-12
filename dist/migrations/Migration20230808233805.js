"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230808233805 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230808233805 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_name" text not null, "password" text not null);');
        this.addSql('alter table "user" add constraint "user_user_name_unique" unique ("user_name");');
    }
    async down() {
        this.addSql('drop table if exists "user" cascade;');
    }
}
exports.Migration20230808233805 = Migration20230808233805;
//# sourceMappingURL=Migration20230808233805.js.map