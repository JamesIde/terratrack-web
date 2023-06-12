import { createClient } from "@supabase/supabase-js";
import { Database } from "../@types/supabase";
import { CONFIG } from "../config/config";
console.log(CONFIG.SUPABASE.KEY);
console.log(CONFIG.SUPABASE.URL);
export const supabase = createClient<Database>(
  CONFIG.SUPABASE.URL as string,
  CONFIG.SUPABASE.KEY as string
);
