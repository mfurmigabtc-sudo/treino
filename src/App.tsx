import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Flame, Dumbbell, Activity, RefreshCcw, Info, History, ArrowLeft, Trophy, CalendarDays, Timer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data
type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes?: string;
};

type WorkoutDay = {
  id: string;
  shortName: string;
  dayOfWeek: string;
  title: string;
  description: string;
  exercises: Exercise[];
  cardio: string;
};

type WorkoutHistoryEntry = {
  id: string;
  date: string;
  dayId: string;
  dayTitle: string;
  completedCount: number;
  totalItems: number;
};

const workoutPlan: WorkoutDay[] = [
  {
    id: 'monday',
    shortName: 'Seg',
    dayOfWeek: 'Segunda-feira',
    title: 'Superior A (Peito + Tríceps)',
    description: 'Foco: Cargas mais altas + compostos. Peito já recruta tríceps.',
    exercises: [
      { id: 'mon-1', name: 'Supino reto', sets: 4, reps: '6 a 8' },
      { id: 'mon-2', name: 'Supino inclinado', sets: 3, reps: '8 a 10' },
      { id: 'mon-3', name: 'Crucifixo', sets: 3, reps: '10 a 12' },
      { id: 'mon-4', name: 'Mergulho (ou paralelas)', sets: 3, reps: '8 a 10' },
      { id: 'mon-5', name: 'Tríceps testa', sets: 3, reps: '10 a 12' },
      { id: 'mon-6', name: 'Tríceps corda', sets: 3, reps: '12 a 15' },
    ],
    cardio: 'Cardio leve opcional (15-20 min).'
  },
  {
    id: 'tuesday',
    shortName: 'Ter',
    dayOfWeek: 'Terça-feira',
    title: 'Inferior A (Quadríceps)',
    description: 'Foco: Quadríceps dominante (parte da frente).',
    exercises: [
      { id: 'tue-1', name: 'Agachamento', sets: 4, reps: '6 a 8' },
      { id: 'tue-2', name: 'Leg press', sets: 3, reps: '8 a 10' },
      { id: 'tue-3', name: 'Cadeira extensora', sets: 3, reps: '12 a 15' },
      { id: 'tue-4', name: 'Afundo', sets: 3, reps: '10 cada perna' },
      { id: 'tue-5', name: 'Panturrilha em pé', sets: 4, reps: '12 a 15' },
      { id: 'tue-6', name: 'Abdômen', sets: 3, reps: '15 a 20' },
    ],
    cardio: 'Cardio leve opcional (15-20 min).'
  },
  {
    id: 'wednesday',
    shortName: 'Qua',
    dayOfWeek: 'Quarta-feira',
    title: 'Superior B (Costas + Bíceps)',
    description: 'Foco: Volume. Costas já recruta bíceps, combinação eficiente.',
    exercises: [
      { id: 'wed-1', name: 'Barra fixa ou puxada', sets: 4, reps: '6 a 8' },
      { id: 'wed-2', name: 'Remada curvada', sets: 3, reps: '8 a 10' },
      { id: 'wed-3', name: 'Remada baixa', sets: 3, reps: '10 a 12' },
      { id: 'wed-4', name: 'Pulldown', sets: 3, reps: '10 a 12' },
      { id: 'wed-5', name: 'Rosca direta', sets: 3, reps: '10 a 12' },
      { id: 'wed-6', name: 'Rosca alternada', sets: 3, reps: '10 a 12' },
    ],
    cardio: 'Cardio leve opcional (15-20 min).'
  },
  {
    id: 'thursday',
    shortName: 'Qui',
    dayOfWeek: 'Quinta-feira',
    title: 'Inferior B (Posterior + Glúteo)',
    description: 'Foco: Cadeia posterior e glúteos.',
    exercises: [
      { id: 'thu-1', name: 'Levantamento terra', sets: 4, reps: '5 a 6' },
      { id: 'thu-2', name: 'Stiff', sets: 3, reps: '8 a 10' },
      { id: 'thu-3', name: 'Mesa flexora', sets: 3, reps: '10 a 12' },
      { id: 'thu-4', name: 'Hip thrust', sets: 3, reps: '10 a 12' },
      { id: 'thu-5', name: 'Panturrilha sentado', sets: 4, reps: '12 a 15' },
      { id: 'thu-6', name: 'Abdômen infra', sets: 3, reps: '12 a 15' },
    ],
    cardio: 'Cardio leve opcional (15-20 min).'
  },
  {
    id: 'friday',
    shortName: 'Sex',
    dayOfWeek: 'Sexta-feira',
    title: 'Superior C (Ombro + Acabamento)',
    description: 'Foco: O "segredo" pra crescer visualmente.',
    exercises: [
      { id: 'fri-1', name: 'Desenvolvimento', sets: 4, reps: '6 a 8' },
      { id: 'fri-2', name: 'Elevação lateral', sets: 4, reps: '12 a 15' },
      { id: 'fri-3', name: 'Elevação frontal', sets: 3, reps: '10 a 12' },
      { id: 'fri-4', name: 'Face pull', sets: 3, reps: '12 a 15' },
      { id: 'fri-5', name: 'Trapézio encolhimento', sets: 3, reps: '10 a 12' },
      { id: 'fri-6', name: 'Exercício leve de braço (opcional)', sets: 3, reps: '12 a 15' },
    ],
    cardio: 'Cardio leve opcional (15-20 min).'
  }
];

export default function App() {
  const [view, setView] = useState<'workout' | 'history'>('workout');
  const [activeDay, setActiveDay] = useState<string>(() => {
    const today = new Date().getDay();
    // Map Sunday (0) to Friday (5), Monday (1) to Monday (0), etc.
    const dayIndex = today === 0 || today === 6 ? 0 : today - 1;
    return workoutPlan[dayIndex].id;
  });

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('workout-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [history, setHistory] = useState<WorkoutHistoryEntry[]>(() => {
    const saved = localStorage.getItem('workout-history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('workout-progress', JSON.stringify(completedItems));
  }, [completedItems]);

  useEffect(() => {
    localStorage.setItem('workout-history', JSON.stringify(history));
  }, [history]);

  // Timer State
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [restTime, setRestTime] = useState<number | null>(null);
  const [initialRestTime, setInitialRestTime] = useState<number>(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTime !== null && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(prev => prev !== null && prev > 0 ? prev - 1 : 0);
      }, 1000);
    } else if (restTime === 0) {
      if (navigator.vibrate) navigator.vibrate([300, 200, 300]);
    }
    return () => clearInterval(interval);
  }, [restTime]);

  const startTimer = (seconds: number) => {
    setInitialRestTime(seconds);
    setRestTime(seconds);
    setIsTimerOpen(false);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleItem = (id: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetDay = () => {
    if (window.confirm('Tem certeza que deseja reiniciar o treino de hoje?')) {
      const currentDayData = workoutPlan.find(d => d.id === activeDay);
      if (!currentDayData) return;
      
      const newCompleted = { ...completedItems };
      currentDayData.exercises.forEach(ex => {
        delete newCompleted[ex.id];
      });
      delete newCompleted[`${activeDay}-cardio`];
      
      setCompletedItems(newCompleted);
    }
  };

  const currentDayData = workoutPlan.find(d => d.id === activeDay)!;
  
  const totalItems = currentDayData.exercises.length + 1; // +1 for cardio
  const completedCount = currentDayData.exercises.filter(ex => completedItems[ex.id]).length + (completedItems[`${activeDay}-cardio`] ? 1 : 0);
  const progressPercentage = Math.round((completedCount / totalItems) * 100);

  const finishWorkout = () => {
    if (completedCount === 0) {
      alert('Você precisa completar pelo menos um exercício para finalizar o treino.');
      return;
    }
    
    const newEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      dayId: activeDay,
      dayTitle: currentDayData.title,
      completedCount,
      totalItems
    };
    
    setHistory(prev => [newEntry, ...prev]);
    
    // Clear current day
    const newCompleted = { ...completedItems };
    currentDayData.exercises.forEach(ex => delete newCompleted[ex.id]);
    delete newCompleted[`${activeDay}-cardio`];
    setCompletedItems(newCompleted);
    
    setView('history');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-32">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500 w-6 h-6" />
            <h1 className="font-bold text-xl tracking-tight">Foco & Queima</h1>
          </div>
          <div className="flex items-center gap-1">
            {view === 'workout' ? (
              <>
                <button 
                  onClick={() => setView('history')}
                  className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800"
                  aria-label="Ver histórico"
                >
                  <History className="w-5 h-5" />
                </button>
                <button 
                  onClick={resetDay}
                  className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800"
                  aria-label="Reiniciar treino do dia"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setView('workout')}
                className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800"
                aria-label="Voltar para o treino"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Day Selector */}
        <div className={`max-w-md mx-auto px-4 pb-4 transition-all duration-300 ${view === 'history' ? 'hidden' : 'block'}`}>
          <div className="flex justify-between bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
            {workoutPlan.map((day) => {
              const isActive = activeDay === day.id;
              const isCompleted = day.exercises.every(ex => completedItems[ex.id]) && completedItems[`${day.id}-cardio`];
              
              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  className={`relative flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'text-zinc-950 shadow-sm' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-zinc-100 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex flex-col items-center gap-1">
                    {day.shortName}
                    {isCompleted && !isActive && (
                      <span className="w-1 h-1 bg-emerald-500 rounded-full absolute -bottom-2"></span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          {view === 'workout' ? (
            <motion.div
              key={`workout-${activeDay}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
            {/* Day Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{currentDayData.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{currentDayData.description}</p>
              
              {/* Progress Bar */}
              <div className="mt-6 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-zinc-300">Progresso do dia</span>
                  <span className="text-2xl font-bold text-emerald-400">{progressPercentage}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                
                <div className="mt-4 flex items-start gap-2 text-xs text-orange-400 bg-orange-400/10 p-3 rounded-xl border border-orange-400/20">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Descanso: Compostos 2 min (120s) | Isoladores 1 min (60s). Tempo total: ~1h20.</p>
                </div>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-5 h-5 text-zinc-400" />
                <h3 className="text-lg font-semibold">Exercícios</h3>
              </div>
              
              {currentDayData.exercises.map((exercise, index) => {
                const isCompleted = completedItems[exercise.id];
                
                return (
                  <motion.div 
                    key={exercise.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/20' 
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(exercise.id)}
                      className="w-full text-left p-4 flex items-start gap-4"
                    >
                      <div className="mt-1 shrink-0 transition-colors duration-300">
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`font-medium text-base mb-1 transition-colors duration-300 ${isCompleted ? 'text-emerald-100' : 'text-zinc-100'}`}>
                          {exercise.name}
                        </h4>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`px-2 py-1 rounded-md font-mono text-xs ${isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-300'}`}>
                            {exercise.sets} séries
                          </span>
                          <span className={`text-xs ${isCompleted ? 'text-emerald-400/70' : 'text-zinc-500'}`}>
                            {exercise.reps} reps
                          </span>
                        </div>
                        
                        {exercise.notes && (
                          <p className={`mt-2 text-xs italic ${isCompleted ? 'text-emerald-400/60' : 'text-zinc-500'}`}>
                            * {exercise.notes}
                          </p>
                        )}
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Cardio Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-zinc-400" />
                <h3 className="text-lg font-semibold">Cardio Final</h3>
              </div>
              
              <motion.div 
                layout
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  completedItems[`${activeDay}-cardio`] 
                    ? 'bg-orange-500/10 border-orange-500/20' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => toggleItem(`${activeDay}-cardio`)}
                  className="w-full text-left p-4 flex items-start gap-4"
                >
                  <div className="mt-1 shrink-0 transition-colors duration-300">
                    {completedItems[`${activeDay}-cardio`] ? (
                      <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-base mb-1 transition-colors duration-300 ${completedItems[`${activeDay}-cardio`] ? 'text-orange-100' : 'text-zinc-100'}`}>
                      Sessão de Cardio
                    </h4>
                    <p className={`text-sm leading-relaxed ${completedItems[`${activeDay}-cardio`] ? 'text-orange-400/80' : 'text-zinc-400'}`}>
                      {currentDayData.cardio}
                    </p>
                  </div>
                </button>
              </motion.div>
            </div>

            {/* Finish Workout Button */}
            <div className="mt-8 mb-4">
              <button
                onClick={finishWorkout}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Trophy className="w-5 h-5" />
                Finalizar Treino
              </button>
            </div>
          </motion.div>
          ) : (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="pb-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-white">Histórico de Treinos</h2>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center text-zinc-500 py-12 bg-zinc-900/50 rounded-3xl border border-zinc-800/50">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium text-zinc-400 mb-1">Nenhum treino registrado</p>
                  <p className="text-sm">Finalize um treino para ver seu histórico aqui.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map(entry => {
                    const percentage = Math.round((entry.completedCount / entry.totalItems) * 100);
                    const dateObj = new Date(entry.date);
                    
                    return (
                      <motion.div 
                        key={entry.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-zinc-100 text-lg">{entry.dayTitle}</h3>
                            <p className="text-sm text-zinc-400 capitalize mt-0.5">
                              {dateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} às {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="text-right bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                            <span className="text-emerald-400 font-bold">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-4">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 font-medium">
                          {entry.completedCount} de {entry.totalItems} atividades concluídas
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Timer Widget */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <AnimatePresence>
            {isTimerOpen && restTime === null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-20 right-0 bg-zinc-800 border border-zinc-700 rounded-2xl p-2 shadow-xl flex gap-2"
              >
                {[60, 90, 120].map(sec => (
                  <button
                    key={sec}
                    onClick={() => startTimer(sec)}
                    className="px-4 py-3 bg-zinc-900 hover:bg-zinc-700 rounded-xl font-medium transition-colors flex flex-col items-center min-w-[4.5rem]"
                  >
                    <span className="text-lg">{sec}</span>
                    <span className="text-xs text-zinc-400">seg</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {restTime !== null ? (
              <motion.div
                key="active-timer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`w-full rounded-2xl shadow-2xl overflow-hidden border ${restTime === 0 ? 'bg-emerald-500 border-emerald-400 text-zinc-950' : 'bg-zinc-800 border-zinc-700 text-white'}`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Timer className={`w-6 h-6 ${restTime === 0 ? 'animate-pulse' : 'text-zinc-400'}`} />
                    <span className="text-3xl font-mono font-bold tracking-tighter">
                      {formatTime(restTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {restTime > 0 && (
                      <button onClick={() => setRestTime(prev => prev! + 30)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                        +30s
                      </button>
                    )}
                    <button onClick={() => setRestTime(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {restTime > 0 && (
                  <div className="h-1.5 bg-black/20 w-full">
                    <motion.div 
                      className="h-full bg-white/50"
                      initial={{ width: '100%' }}
                      animate={{ width: `${(restTime / initialRestTime) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="timer-btn" className="flex justify-end">
                <button 
                  onClick={() => setIsTimerOpen(!isTimerOpen)}
                  className={`${isTimerOpen ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-white'} hover:brightness-110 p-4 rounded-full shadow-xl border border-zinc-700 transition-all`}
                >
                  {isTimerOpen ? <X className="w-6 h-6" /> : <Timer className="w-6 h-6" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
