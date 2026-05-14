const test = async () => {
  try {
    console.log('1. Autenticando (gerando token)...');
    const authRes = await fetch('http://localhost:3001/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@escola.com',
        password: 'admin123'
      })
    });

    if (!authRes.ok) throw new Error(await authRes.text());
    const authData = await authRes.json();
    const token = authData.access_token;
    console.log('Token obtido com sucesso!');

    console.log('\n2. Testando criação de usuário (via POST /api/admin/usuarios)...');
    const newUser = {
      nome: 'Professor Teste',
      email: `professor.teste.${Date.now()}@escola.com`,
      senha: 'senhaSegura123',
      papel: 'professor'
    };

    const createRes = await fetch('http://localhost:3001/api/admin/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newUser)
    });

    if (!createRes.ok) throw new Error(await createRes.text());
    const createData = await createRes.json();
    console.log('Usuário criado com sucesso:', createData);
  } catch (error: any) {
    console.error('ERRO:', error.message);
  }
};

test();
