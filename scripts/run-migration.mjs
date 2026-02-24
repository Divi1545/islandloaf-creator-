import { readFileSync } from "fs";

const SUPABASE_URL = "https://opuiqjxapdrtemczruon.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWlxanhhcGRydGVtY3pydW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDM2NDIsImV4cCI6MjA4NjcxOTY0Mn0.miid2mPKjKXI3CQWjTc_6JIPhTgMk71y58CdZdflJ8Y";
// The publishable key might be the service role key
const SERVICE_KEY = "sb_publishable_Qenoxbdasip5mpqzitnxxA_h6skBknZ";

// Try using the Supabase RPC endpoint to run raw SQL
// This requires the service role key (not anon)
async function runViaPgRest() {
  // Check if we can query existing tables
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
  });
  const text = await res.text();
  const data = JSON.parse(text);

  // Check if our tables already exist
  if (data.definitions && data.definitions.campaigns) {
    console.log("Tables already exist! Schema looks good.");
    console.log("Available tables:", Object.keys(data.definitions).join(", "));
    return true;
  }

  console.log("Tables not found. Available definitions:", 
    data.definitions ? Object.keys(data.definitions).slice(0, 10).join(", ") : "none");
  return false;
}

async function main() {
  console.log("Checking if migration has been applied...");
  const exists = await runViaPgRest();

  if (exists) {
    console.log("\nMigration already applied! Your database is ready.");
    return;
  }

  console.log("\n=== MIGRATION REQUIRED ===");
  console.log("Direct database connection is not available from your network.");
  console.log("Please run the migration SQL manually:\n");
  console.log("1. Open Supabase Dashboard: https://supabase.com/dashboard/project/opuiqjxapdrtemczruon/sql/new");
  console.log("2. Copy the contents of: supabase/migrations/001_init.sql");
  console.log("3. Paste into the SQL Editor and click 'Run'\n");
  console.log("The migration file is at: supabase/migrations/001_init.sql");
}

main().catch(console.error);
