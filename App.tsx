
import React, { useState, useEffect } from 'react';
import { Workout, WeightRecord, AppState } from './types';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import AICoach from './components/AICoach';
import { IconPlus, IconScale, IconActivity, IconDumbbell } from './components/Icons';

const LOCAL_STORAGE_KEY = 'fittrack_ai_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      workouts: [],
      weightHistory: [{ id: '1', date: new Date().toISOString(), weight: 70 }],
      userProfile: { name: 'Atleta', goal: 'Saúde', height: 175 }
    };
  });

  const [view, setView] = useState<'dashboard' | 'workouts' | 'weight'>('dashboard');
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addWorkout = (workout: Workout) => {
    setState(prev => ({
      ...prev,
      workouts: [...prev.workouts, workout]
    }));
    setShowWorkoutModal(false);
  };

  const addWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(weightInput);
    if (isNaN(weight)) return;
    
    setState(prev => ({
      ...prev,
      weightHistory: [...prev.weightHistory, { 
        id: Math.random().toString(36).substr(2, 9), 
        date: new Date().toISOString(), 
        weight 
      }]
    }));
    setWeightInput('');
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <IconDumbbell className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FitTrack <span className="text-emerald-500">AI</span></h1>
          </div>
          <button 
            onClick={() => setShowWorkoutModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <IconPlus className="w-5 h-5" /> 
            <span className="hidden sm:inline">Treinar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-6 space-y-8">
        {view === 'dashboard' && (
          <div className="space-y-8">
            <AICoach 
              workouts={state.workouts} 
              weightHistory={state.weightHistory} 
              userName={state.userProfile.name} 
            />
            
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                   Visão Geral
                </h2>
                <div className="text-sm text-slate-400">
                  Bem-vindo de volta, {state.userProfile.name}!
                </div>
              </div>
              <Dashboard workouts={state.workouts} weightHistory={state.weightHistory} />
            </section>
          </div>
        )}

        {view === 'workouts' && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <IconActivity className="text-emerald-400" /> Histórico de Treinos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.workouts.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  Nenhum treino registrado. Comece hoje!
                </div>
              )}
              {[...state.workouts].reverse().map(workout => (
                <div key={workout.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-xs font-bold text-emerald-400 uppercase">{workout.type}</div>
                    <div className="text-xs text-slate-500">{new Date(workout.date).toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-2">
                    {workout.exercises.map(ex => (
                      <div key={ex.id} className="flex justify-between items-center text-sm">
                        <span className="text-slate-300">{ex.name}</span>
                        <span className="text-slate-500">{ex.sets.length} séries</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'weight' && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <IconScale className="text-blue-400" /> Controle de Peso
            </h2>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <form onSubmit={addWeight} className="flex gap-4 items-end max-w-md">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase">Novo Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="75.5"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Registrar
                </button>
              </form>

              <div className="mt-8 space-y-2">
                <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Últimas medições</h4>
                {[...state.weightHistory].reverse().slice(0, 10).map(w => (
                  <div key={w.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <span className="text-slate-300 font-medium">{w.weight} kg</span>
                    <span className="text-slate-500 text-xs">{new Date(w.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Navigation (Mobile Sticky) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800 md:relative md:bg-transparent md:border-none md:mt-auto">
        <div className="max-w-md mx-auto flex justify-around p-2 md:p-4">
          <NavItem 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
            icon={<IconActivity />} 
            label="Início" 
          />
          <NavItem 
            active={view === 'workouts'} 
            onClick={() => setView('workouts')} 
            icon={<IconDumbbell />} 
            label="Treinos" 
          />
          <NavItem 
            active={view === 'weight'} 
            onClick={() => setView('weight')} 
            icon={<IconScale />} 
            label="Peso" 
          />
        </div>
      </nav>

      {/* Workout Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl my-8">
            <WorkoutForm onSave={addWorkout} onCancel={() => setShowWorkoutModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${active ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
