
import React, { useState } from 'react';
import { analyzeProgress } from '../services/geminiService';
import { Workout, WeightRecord } from '../types';
import { IconActivity } from './Icons';

interface AICoachProps {
  workouts: Workout[];
  weightHistory: WeightRecord[];
  userName: string;
}

const AICoach: React.FC<AICoachProps> = ({ workouts, weightHistory, userName }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (workouts.length === 0) {
      alert("Registre alguns treinos primeiro para eu analisar seu progresso!");
      return;
    }
    setLoading(true);
    const result = await analyzeProgress(workouts, weightHistory, userName);
    setAnalysis(result || "Ocorreu um erro na análise.");
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <IconActivity className="w-24 h-24 text-emerald-500" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          FitCoach AI
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Receba dicas personalizadas baseadas no seu histórico de treino e peso.
        </p>

        {!analysis ? (
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Analisando seu esforço...
              </>
            ) : (
              "Gerar Insights com IA"
            )}
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 prose prose-invert max-w-none text-slate-300 whitespace-pre-line text-sm leading-relaxed">
              {analysis}
            </div>
            <button 
              onClick={() => setAnalysis(null)}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Nova consulta amanhã?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;
