import React from 'react';
import { MOCK_KNOWLEDGE_BASE } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { BookOpen, Upload, Database, RefreshCw } from 'lucide-react';

export const SuperadminKnowledge = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <BookOpen className="w-6 h-6 mr-2.5 text-purple-600" />
            Base de Conocimiento & RAG Fitopatológico
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de manuales de agronomía, vademécum biológico y embeddings vectoriales para LLMs.
          </p>
        </div>
        <Button variant="primary" icon={Upload} className="bg-purple-600 hover:bg-purple-700">
          Indexar Nuevo Documento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_KNOWLEDGE_BASE.map((doc) => (
          <Card key={doc.id} className="space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">{doc.categoria}</span>
              <Badge variant="purple">{doc.formato}</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.titulo}</h3>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{doc.chunksCount} Chunks RAG</span>
              <span>{doc.tamaño}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
