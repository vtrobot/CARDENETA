import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Header com o JWT real do Supabase
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
  };
};

export const fetchComunicados = async (page = 1) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/comunicados?page=${page}`, { headers });
  if (!response.ok) throw new Error('Erro ao buscar comunicados');
  return response.json();
};

export const fetchComunicadoById = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/comunicados/${id}`, { headers });
  if (!response.ok) throw new Error('Erro ao buscar comunicado');
  return response.json();
};

export const confirmarCienciaComunicado = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/comunicados/${id}/ciencia`, {
    method: 'POST',
    headers,
  });
  if (!response.ok) throw new Error('Erro ao confirmar ciência');
  return response.json();
};

export const criarComunicado = async (data: { titulo: string, corpo_texto: string, nivel_urgencia: string, id_turma_destino: string }) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/comunicados`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar comunicado');
  return response.json();
};

// Mensagens
export const fetchConversas = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/mensagens`, { headers });
  if (!response.ok) throw new Error('Erro ao buscar conversas');
  return response.json();
};

export const fetchThread = async (contactId: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/mensagens/${contactId}/thread`, { headers });
  if (!response.ok) throw new Error('Erro ao buscar thread');
  return response.json();
};

export const enviarMensagem = async (data: { corpo_texto: string, id_destinatario: string, id_comunicado_origem?: string, id_mensagem_resposta?: string }) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/mensagens`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao enviar mensagem');
  return response.json();
};

export const marcarMensagemLida = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/mensagens/${id}/lida`, {
    method: 'PUT',
    headers,
  });
  if (!response.ok) throw new Error('Erro ao marcar como lida');
  return response.json();
};

// Administração
export const fetchTurmasAdmin = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/admin/turmas`, { headers });
  if (!response.ok) throw new Error('Erro ao buscar turmas');
  return response.json();
};

export const createTurmaAdmin = async (data: { nome: string, turno: string }) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/admin/turmas`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar turma');
  return response.json();
};

export const fetchUsuariosByPapel = async (papel: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/admin/usuarios?papel=${papel}`, { headers });
  if (!response.ok) throw new Error('Erro ao buscar usuários');
  return response.json();
};

export const createVinculoProfTurma = async (professor_id: string, turma_id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/admin/vinculos/professor-turma`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ professor_id, turma_id }),
  });
  if (!response.ok) throw new Error('Erro ao criar vínculo');
  return response.json();
};

