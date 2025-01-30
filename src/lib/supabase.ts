import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project values
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);