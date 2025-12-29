
import React from 'react';
import { Workout, WeightRecord } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { IconActivity, IconScale, IconCalendar, IconDumbbell } from './Icons';

interface DashboardProps {
  workouts: Workout[];
  weightHistory: WeightRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, weightHistory }) => {
  const totalWorkouts = workouts.length;
  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
  // FIX: weightDiff should remain a number for logical comparisons. Formatting is done at display.
  const weightDiff = weightHistory.length > 1 ? (weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight) : 0;

  const chartData = weightHistory.map(w => ({
    date: new Date(w.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    weight: w.weight
  }));

  const workoutFreqData = workouts.slice(-7).map(w => ({
    date: new Date(w.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    exercises: w.exercises.length
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<IconActivity className="text-emerald-400" />} 
          label="Total de Treinos" 
          value={totalWorkouts.toString()} 
          subtext="Desde o início"
        />
        <StatCard 
          icon={<IconScale className="text-blue-400" />} 
          label="Peso Atual" 
          value={`${currentWeight} kg`} 
          // FIX: Use numeric weightDiff for comparison and format it for the string template to avoid TS error.
          subtext={`${weightDiff > 0 ? '+' : ''}${weightDiff.toFixed(1)} kg desde o início`}
        />
        <StatCard 
          icon={<IconCalendar className="text-purple-400" />} 
          label="Treinos/Mês" 
          value={(totalWorkouts / Math.max(1, (new Date().getMonth() + 1))).toFixed(1)} 
          subtext="Média mensal"
        />
        <StatCard 
          icon={<IconDumbbell className="text-orange-400" />} 
          label="Último Treino" 
          value={workouts.length > 0 ? new Date(workouts[workouts.length - 1].date).toLocaleDateString() : 'N/A'} 
          subtext={workouts.length > 0 ? workouts[workouts.length - 1].type : '-'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IconScale className="text-blue-400 w-5 h-5" /> Evolução de Peso
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IconActivity className="text-emerald-400 w-5 h-5" /> Volume de Exercícios (Últimos 7)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workoutFreqData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Line type="stepAfter" dataKey="exercises" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subtext: string }> = ({ icon, label, value, subtext }) => (
  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md hover:border-slate-500 transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-slate-900 rounded-lg">{icon}</div>
      <span className="text-slate-400 text-sm font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-slate-500 mt-1">{subtext}</div>
  </div>
);

export default Dashboard;
