import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import './ComunicadoCard.css';

export interface Comunicado {
  id: string;
  titulo: string;
  corpo_texto: string;
  nivel_urgencia: 'baixa' | 'media' | 'alta';
  data_criacao: string;
  autor_id: string;
  leituras_comunicados?: { status_lido: boolean, ciencia_confirmada: boolean }[];
}

interface Props {
  comunicado: Comunicado;
  onClick: (comunicado: Comunicado) => void;
}

export function ComunicadoCard({ comunicado, onClick }: Props) {
  const isLido = comunicado.leituras_comunicados && comunicado.leituras_comunicados.length > 0 && comunicado.leituras_comunicados[0].status_lido;
  const requiresCiencia = comunicado.nivel_urgencia === 'alta';
  const isConfirmado = comunicado.leituras_comunicados && comunicado.leituras_comunicados.length > 0 && comunicado.leituras_comunicados[0].ciencia_confirmada;

  return (
    <div 
      className={`comunicado-card urgencia-${comunicado.nivel_urgencia} ${!isLido ? 'unread' : ''}`} 
      data-testid="comunicado-card"
      onClick={() => onClick(comunicado)}
    >
      <div className="card-header">
        <h3 className="card-title">{comunicado.titulo}</h3>
        <span className="card-tag">
          {comunicado.nivel_urgencia === 'alta' && <AlertCircle size={14} />}
          {comunicado.nivel_urgencia.toUpperCase()}
        </span>
      </div>
      
      <p className="card-excerpt">{comunicado.corpo_texto.substring(0, 100)}...</p>
      
      <div className="card-footer">
        <span className="card-date">
          <Clock size={14} />
          {new Date(comunicado.data_criacao).toLocaleDateString()}
        </span>
        
        <div className="card-status">
          {requiresCiencia && !isConfirmado ? (
            <span className="status-badge pending">Pendente de Ciência</span>
          ) : isLido ? (
            <span className="status-badge read"><CheckCircle size={14}/> Lido</span>
          ) : (
            <span className="status-badge new">Novo</span>
          )}
        </div>
      </div>
    </div>
  );
}
