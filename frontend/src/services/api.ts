const API_BASE_URL = 'http://localhost:3001/api';

// MOCK: Usuário logado temporário. No futuro, vira do contexto de autenticação real
export const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-user-id': localStorage.getItem('mockUserId') || 'mock-id-123',
    'x-user-role': localStorage.getItem('mockUserRole') || 'responsavel',
  };
};

export const fetchComunicados = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/comunicados?page=${page}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao buscar comunicados');
  return response.json();
};

export const fetchComunicadoById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/comunicados/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao buscar comunicado');
  return response.json();
};

export const confirmarCienciaComunicado = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/comunicados/${id}/ciencia`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao confirmar ciência');
  return response.json();
};

export const criarComunicado = async (data: { titulo: string, corpo_texto: string, nivel_urgencia: string, id_turma_destino: string }) => {
  const response = await fetch(`${API_BASE_URL}/comunicados`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar comunicado');
  return response.json();
};

// Mensagens
export const fetchConversas = async () => {
  const response = await fetch(`${API_BASE_URL}/mensagens`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao buscar conversas');
  return response.json();
};

export const fetchThread = async (contactId: string) => {
  const response = await fetch(`${API_BASE_URL}/mensagens/${contactId}/thread`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao buscar thread');
  return response.json();
};

export const enviarMensagem = async (data: { corpo_texto: string, id_destinatario: string, id_comunicado_origem?: string, id_mensagem_resposta?: string }) => {
  const response = await fetch(`${API_BASE_URL}/mensagens`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao enviar mensagem');
  return response.json();
};

export const marcarMensagemLida = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/mensagens/${id}/lida`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao marcar como lida');
  return response.json();
};

