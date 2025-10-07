import Database from "better-sqlite3";

const db = new Database("./data/datavbase.sqlite");

export default db;