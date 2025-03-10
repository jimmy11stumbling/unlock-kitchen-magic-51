
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://quchvwzsyfmzqyyywbco.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1Y2h2d3pzeWZtenF5eXl3YmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNjUyMTQsImV4cCI6MjA1NDY0MTIxNH0.vS05Lyx_xs_ZcPKWzPCyGbJ6R8yqAADcFZeFPYg2CSI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
