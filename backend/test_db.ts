import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testando conexão com Supabase...');
  console.log('URL configurada:', supabaseUrl);
  
  try {
    // Testar tabela usuarios
    console.log('\n--- Testando tabela usuarios ---');
    const { data: users, error: errorUsers } = await supabase.from('usuarios').select('*').limit(3);
    if (errorUsers) console.error('Erro (usuarios):', errorUsers.message);
    else console.log(`Sucesso! Encontrados ${users?.length || 0} usuários.`);

    // Testar tabela comunicados
    console.log('\n--- Testando tabela comunicados ---');
    const { data: coms, error: errorComs } = await supabase.from('comunicados').select('*, leituras_comunicados(assinatura_digital)').limit(3);
    if (errorComs) console.error('Erro (comunicados):', errorComs.message);
    else console.log(`Sucesso! Encontrados ${coms?.length || 0} comunicados.`);

    // Testar tabela mensagens_diretas
    console.log('\n--- Testando tabela mensagens_diretas ---');
    const { data: msgs, error: errorMsgs } = await supabase.from('mensagens_diretas').select('*').limit(3);
    if (errorMsgs) console.error('Erro (mensagens_diretas):', errorMsgs.message);
    else console.log(`Sucesso! Encontradas ${msgs?.length || 0} mensagens.`);

  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

testConnection();
