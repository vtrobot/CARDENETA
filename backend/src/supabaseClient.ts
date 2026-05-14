import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
