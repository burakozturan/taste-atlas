import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nytnalwhuifcqfmuxqjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dG5hbHdodWlmY3FmbXV4cWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNjg0NjAsImV4cCI6MjA1Mzg0NDQ2MH0.d5Hts--BgdyvNPCmHcd2thguoHJZoOcjmQe4eBwMfv4';

export const supabase = createClient(supabaseUrl, supabaseKey);