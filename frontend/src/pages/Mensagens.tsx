import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversas, fetchThread, enviarMensagem, marcarMensagemLida } from '../services/api';
import { Search, Send, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Mensagens.css';

interface Conversa {
  contato_id: string;
  contato_nome: string;
  ultima_mensagem: string;
  data_envio: string;
  nao_lidas: number;
}

interface Mensagem {
  id: string;
  corpo_texto: string;
  data_envio: string;
  remetente_id: string;
  destinatario_id: string;
  lida: boolean;
  id_comunicado_origem?: string;
}

export function Mensagens() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const stateData = location.state as { presetDestinatario?: string, presetNome?: string, comunicadoOrigem?: string } | null;

  const currentUserId = localStorage.getItem('mockUserId') || '1d210d1d-6c17-4cff-aa1a-65379dca5b3d'; // Pai da Maria
  const [activeContact, setActiveContact] = useState<{id: string, nome: string} | null>(
    stateData?.presetDestinatario ? { id: stateData.presetDestinatario, nome: stateData.presetNome || 'Contato' } : null
  );
  const [inputText, setInputText] = useState('');
  const maxChars = 500;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversas, isLoading: loadingConversas } = useQuery({
    queryKey: ['conversas'],
    queryFn: fetchConversas,
  });

  const { data: thread, isLoading: loadingThread } = useQuery({
    queryKey: ['thread', activeContact?.id],
    queryFn: () => fetchThread(activeContact!.id),
    enabled: !!activeContact,
    refetchInterval: 5000, // Pooling simples p/ MVP
  });

  const enviarMutation = useMutation({
    mutationFn: enviarMensagem,
    onSuccess: () => {
      setInputText('');
      queryClient.invalidateQueries({ queryKey: ['thread', activeContact?.id] });
      queryClient.invalidateQueries({ queryKey: ['conversas'] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Marcar lidas
    if (thread) {
      const unreadIds = thread.filter((m: Mensagem) => m.destinatario_id === currentUserId && !m.lida).map((m: Mensagem) => m.id);
      unreadIds.forEach((id: string) => {
        marcarMensagemLida(id);
      });
      if (unreadIds.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['conversas'] });
      }
    }
  }, [thread, currentUserId, queryClient]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;
    
    enviarMutation.mutate({
      corpo_texto: inputText,
      id_destinatario: activeContact.id,
      id_comunicado_origem: stateData?.comunicadoOrigem
    });
  };

  return (
    <div className="mensagens-container">
      <div className="inbox-layout">
        <div className="inbox-sidebar">
          <div className="sidebar-header">
            <h3>Mensagens</h3>
          </div>
          <div className="conversas-list">
            {loadingConversas && <p className="loading-text">Carregando...</p>}
            
            {/* Se viemos de um atalho e ainda não há conversa no histórico, forçar exibição do contato */}
            {stateData?.presetDestinatario && !conversas?.find((c: Conversa) => c.contato_id === stateData.presetDestinatario) && (
               <div 
                  className={`conversa-item active`}
                  onClick={() => setActiveContact({id: stateData.presetDestinatario!, nome: stateData.presetNome || 'Contato'})}
                >
                  <div className="conversa-avatar"><User size={20} /></div>
                  <div className="conversa-info">
                    <h4>{stateData.presetNome}</h4>
                    <span className="excerpt">Nova conversa...</span>
                  </div>
                </div>
            )}

            {conversas?.map((c: Conversa) => (
              <div 
                key={c.contato_id} 
                className={`conversa-item ${activeContact?.id === c.contato_id ? 'active' : ''}`}
                onClick={() => setActiveContact({id: c.contato_id, nome: c.contato_nome})}
              >
                <div className="conversa-avatar"><User size={20} /></div>
                <div className="conversa-info">
                  <div className="conversa-header-row">
                    <h4>{c.contato_nome}</h4>
                    {c.nao_lidas > 0 && <span className="badge-unread">{c.nao_lidas}</span>}
                  </div>
                  <span className="excerpt">{c.ultima_mensagem}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="inbox-chat">
          {activeContact ? (
            <>
              <div className="chat-header">
                <div className="conversa-avatar"><User size={24} /></div>
                <h3>{activeContact.nome}</h3>
              </div>
              <div className="chat-history">
                {loadingThread ? <div className="loading-text">Carregando histórico...</div> : (
                  <>
                    {thread?.map((m: Mensagem) => {
                      const isMe = m.remetente_id === currentUserId;
                      return (
                        <div key={m.id} className={`message-bubble-wrapper ${isMe ? 'me' : 'them'}`}>
                          <div className="message-bubble">
                            <p>{m.corpo_texto}</p>
                            <span className="message-time">
                              {new Date(m.data_envio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              {isMe && <span className={`read-receipt ${m.lida ? 'read' : ''}`}>✓✓</span>}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              <form className="chat-input-area" onSubmit={handleSend}>
                <div className="input-wrapper">
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value.substring(0, maxChars))}
                    placeholder="Escreva sua mensagem..."
                    rows={2}
                  />
                  <div className={`char-counter ${inputText.length >= maxChars ? 'limit' : ''}`}>
                    {inputText.length} / {maxChars}
                  </div>
                </div>
                <button type="submit" disabled={!inputText.trim() || enviarMutation.isPending} className="btn-send">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty-state">
              <User size={48} className="empty-icon" />
              <h3>Suas Mensagens</h3>
              <p>Selecione um contato para visualizar a conversa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
