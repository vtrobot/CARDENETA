import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectColumns() {
  const { data, error } = await supabase.from('mensagens_diretas').select('*').limit(1);
  if (error) {
    console.error('Error fetching:', error.message);
  } else {
    console.log('Sample message:', data);
  }
}

inspectColumns();
