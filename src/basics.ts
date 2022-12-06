import { Database } from "duckdb-async";

async function simpleTest() {
  const db = await Database.create(":memory:");
  const rows = await db.all("select * from range(1,10)");
  console.log(rows);
}

async function rillExample() {
  console.log("rill data S3 example: ");

  const db = await Database.create(":memory:");
  const con = await db.connect();
  await con.exec(`
    install httpfs;
    load httpfs;
    SET s3_endpoint = 'storage.googleapis.com';
    `);
  console.log("https extension loaded, fetching data:");
  const res = await con.all(
    `SELECT * from 's3://pkg.rilldata.com/example-data/sf311.parquet' LIMIT 5`
  );
  console.log(`fetched ${res.length} rows successfully`);

  const s = con.stream(
    `SELECT * from 's3://pkg.rilldata.com/example-data/sf311.parquet' LIMIT 5`
  );

  for await (let row of s) {
    console.log(row);
  }
}

async function main() {
  await simpleTest();
  await rillExample();
}

main();
