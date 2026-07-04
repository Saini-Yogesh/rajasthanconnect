import "../configEnv.js";
import { supabase } from "./db.js";

async function testFetch() {
  console.log("🔄 Attempting to fetch data from Supabase...");

  try {
    const { data, error } = await supabase
      .from("districts")
      .select("id, name")
      .limit(5);

    if (error) {
      console.error("❌ Database query returned an error:", error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log(
        "⚠️ Connection succeeded, but no district records were returned (database might be empty).",
      );
      process.exit(0);
    }

    console.log(
      `\n✅ Success! Successfully fetched ${data.length} districts from the database:`,
    );
    console.table(data);
    process.exit(0);
  } catch (err) {
    console.error("❌ Unexpected connection error:", err);
    process.exit(1);
  }
}

testFetch();
