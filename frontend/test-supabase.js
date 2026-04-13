import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = Object.fromEntries(
  envFile.split('\n').filter(Boolean).map(line => {
    const [key, ...rest] = line.split('=');
    return [key, rest.join('=')];
  })
);

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Success! Columns available in first row:");
    if (data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log("Table is totally empty, but query succeeded.");
    }
  }
}
test();
