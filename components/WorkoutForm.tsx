
import React, { useState } from 'react';
import { Workout, Exercise, SetRecord } from '../types';
import { IconPlus, IconDumbbell } from './Icons';

interface WorkoutFormProps {
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave, onCancel }) => {
  const [type, setType] = useState('Musculação');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExName, setNewExName] = useState('');

  const addExercise = () => {
    if (!newExName.trim()) return;
    const newEx: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: newExName,
      sets: [{ id: Math.random().toString(36).substr(2, 9), reps: 10, weight: 0 }]
    };
    setExercises([...exercises, newEx]);
    setNewExName('');
  };

  const addSet = (exId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { id: Math.random().toString(36).substr(2, 9), reps: lastSet.reps, weight: lastSet.weight }]
        };
      }
      return ex;
    }));
  };

  const updateSet = (exId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercises.length === 0) return alert('Adicione pelo menos um exercício!');
    
    const workout: Workout = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      type,
      exercises,
    };
    onSave(workout);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <IconPlus className="text-emerald-400" /> Registrar Treino
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">&times;</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Tipo de Atividade</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option>Musculação</option>
            <option>Corrida / Cardio</option>
            <option>Crossfit</option>
            <option>Yoga / Alongamento</option>
            <option>Esporte (Futebol, Basquete, etc)</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nome do exercício..." 
              value={newExName}
              onChange={(e) => setNewExName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExercise())}
            />
            <button 
              type="button" 
              onClick={addExercise}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-xl transition-colors"
            >
              Adicionar
            </button>
          </div>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {exercises.map((ex) => (
              <div key={ex.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-emerald-400 flex items-center gap-2">
                    <IconDumbbell className="w-4 h-4" /> {ex.name}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => addSet(ex.id)}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-md"
                  >
                    + Série
                  </button>
                </div>
                
                <div className="space-y-2">
                  {ex.sets.map((set, idx) => (
                    <div key={set.id} className="grid grid-cols-3 gap-3 items-center">
                      <span className="text-xs text-slate-500 uppercase font-bold">Set {idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={set.reps} 
                          onChange={(e) => updateSet(ex.id, set.id, 'reps', parseInt(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center text-sm"
                        />
                        <span className="text-xs text-slate-400">reps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={set.weight} 
                          onChange={(e) => updateSet(ex.id, set.id, 'weight', parseFloat(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center text-sm"
                        />
                        <span className="text-xs text-slate-400">kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-700">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
          >
            Salvar Treino
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
