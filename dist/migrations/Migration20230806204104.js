"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230806204104 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230806204104 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null);');
    }
    async down() {
        this.addSql('drop table if exists "post" cascade;');
    }
}
exports.Migration20230806204104 = Migration20230806204104;
//# sourceMappingURL=Migration20230806204104.js.map