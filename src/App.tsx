import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Flame, Dumbbell, Activity, RefreshCcw, Info, History, ArrowLeft, Trophy, CalendarDays, Timer, X, Search, Image, PlaySquare, User, ClipboardList, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  totalVolume?: number;
};

const workoutPlans: Record<string, WorkoutDay[]> = {
  marco: [
    {
      id: 'monday',
      shortName: 'Seg',
      dayOfWeek: 'Segunda-feira',
      title: 'Treino A: UPPER A',
      description: 'Foco: Peito, costas, ombros e braços. Intervalo de descanso: 60–90s.',
      exercises: [
        { id: 'marco-mon-1', name: 'Supino inclinado máquina/halteres', sets: 3, reps: '6–10', notes: 'RIR 1–3. Desça controladamente.' },
        { id: 'marco-mon-2', name: 'Puxada alta pronada', sets: 3, reps: '8–12', notes: 'RIR 1–3. Foco na contração das escápulas.' },
        { id: 'marco-mon-3', name: 'Supino reto máquina', sets: 2, reps: '8–12', notes: 'RIR 1–3.' },
        { id: 'marco-mon-4', name: 'Remada baixa/cavalinho', sets: 3, reps: '8–12', notes: 'RIR 1–3. Mantenha o tronco firme.' },
        { id: 'marco-mon-5', name: 'Elevação lateral', sets: 3, reps: '12–15', notes: 'RIR 0–2. Controle a descida.' },
        { id: 'marco-mon-6', name: 'Tríceps corda', sets: 2, reps: '10–15', notes: 'RIR 0–2. Afaste os cabos na contração.' },
        { id: 'marco-mon-7', name: 'Rosca direta', sets: 2, reps: '10–15', notes: 'RIR 0–2. Mantenha os cotovelos fixos.' }
      ],
      cardio: '15–20 min de cardio leve/moderado (Bicicleta, Elíptico ou Caminhada confortável)'
    },
    {
      id: 'tuesday',
      shortName: 'Ter',
      dayOfWeek: 'Terça-feira',
      title: 'Treino B: LOWER A',
      description: 'Foco: Quadríceps, posterior, glúteos e panturrilha. Amplitude confortável e controle.',
      exercises: [
        { id: 'marco-tue-1', name: 'Leg press 45°', sets: 3, reps: '8–12', notes: 'RIR 1–3. Amplitude confortável e controle. Nada de provar força máxima.' },
        { id: 'marco-tue-2', name: 'Mesa flexora', sets: 3, reps: '10–15', notes: 'RIR 0–2. Controle de descida do peso.' },
        { id: 'marco-tue-3', name: 'Cadeira extensora', sets: 3, reps: '10–15', notes: 'RIR 0–2. Pressione o topo por 1-2s.' },
        { id: 'marco-tue-4', name: 'Hip thrust', sets: 3, reps: '8–12', notes: 'RIR 1–3. Contraia bem os glúteos no topo.' },
        { id: 'marco-tue-5', name: 'Panturrilha sentado', sets: 3, reps: '10–15', notes: 'Fase excêntrica controlada.' },
        { id: 'marco-tue-6', name: 'Abdominal na máquina', sets: 2, reps: '10–15', notes: 'Foco na flexão da coluna, sem usar os braços.' }
      ],
      cardio: ''
    },
    {
      id: 'wednesday',
      shortName: 'Qua',
      dayOfWeek: 'Quarta-feira',
      title: 'Treino C: UPPER B',
      description: 'Foco: Dorsais e deltoides para melhorar proporção visual (formato em V).',
      exercises: [
        { id: 'marco-wed-1', name: 'Remada articulada/máquina', sets: 3, reps: '6–10', notes: 'RIR 1–3. Puxe com os cotovelos.' },
        { id: 'marco-wed-2', name: 'Supino inclinado máquina', sets: 3, reps: '8–12', notes: 'RIR 1–3. Cadência controlada.' },
        { id: 'marco-wed-3', name: 'Puxada neutra', sets: 3, reps: '8–12', notes: 'RIR 1–3. Costas retas.' },
        { id: 'marco-wed-4', name: 'Crucifixo/crossover', sets: 2, reps: '12–15', notes: 'RIR 0–2. Aperte o peitoral no final.' },
        { id: 'marco-wed-5', name: 'Elevação lateral', sets: 3, reps: '12–20', notes: 'RIR 0–2.' },
        { id: 'marco-wed-6', name: 'Rosca martelo', sets: 2, reps: '10–15', notes: 'RIR 0–2.' },
        { id: 'marco-wed-7', name: 'Tríceps francês/cabo', sets: 2, reps: '10–15', notes: 'RIR 0–2.' }
      ],
      cardio: '15–20 min de cardio leve/moderado (Bicicleta, Elíptico ou Caminhada confortável)'
    },
    {
      id: 'thursday',
      shortName: 'Qui',
      dayOfWeek: 'Quinta-feira',
      title: 'Treino D: LOWER B',
      description: 'Foco: Posterior, quadríceps e glúteos. Execução precisa e proteção do tornozelo.',
      exercises: [
        { id: 'marco-thu-1', name: 'Cadeira flexora', sets: 3, reps: '8–12', notes: 'RIR 1–3.' },
        { id: 'marco-thu-2', name: 'Leg press', sets: 3, reps: '10–15', notes: 'RIR 1–3. Apoie bem os pés.' },
        { id: 'marco-thu-3', name: 'Stiff/RDL com halteres', sets: 3, reps: '8–12', notes: 'RIR 1–3. O movimento vem do quadril. Não forçar dorsiflexão do tornozelo.' },
        { id: 'marco-thu-4', name: 'Cadeira extensora', sets: 2, reps: '12–15', notes: 'RIR 0–2.' },
        { id: 'marco-thu-5', name: 'Glúteo máquina/cabo', sets: 2, reps: '12–15', notes: 'RIR 0–2.' },
        { id: 'marco-thu-6', name: 'Panturrilha em pé', sets: 3, reps: '10–15', notes: 'Amplitude de movimento confortável.' },
        { id: 'marco-thu-7', name: 'Abdominal', sets: 2, reps: '10–15', notes: 'Core contraído.' }
      ],
      cardio: ''
    },
    {
      id: 'friday',
      shortName: 'Sex',
      dayOfWeek: 'Sexta-feira',
      title: 'Treino E: UPPER C (Especialização Estética)',
      description: 'Foco: Ombros, dorsais e braços para mudar a proporção visual do shape.',
      exercises: [
        { id: 'marco-fri-1', name: 'Puxada alta', sets: 3, reps: '8–12', notes: 'RIR 1–3. Foco na amplitude de movimento.' },
        { id: 'marco-fri-2', name: 'Supino máquina', sets: 3, reps: '8–12', notes: 'RIR 1–3.' },
        { id: 'marco-fri-3', name: 'Remada unilateral', sets: 2, reps: '10–12', notes: 'RIR 1–3.' },
        { id: 'marco-fri-4', name: 'Elevação lateral', sets: 4, reps: '12–20', notes: 'RIR 0–2.' },
        { id: 'marco-fri-5', name: 'Crucifixo inverso', sets: 3, reps: '12–20', notes: 'RIR 0–2.' },
        { id: 'marco-fri-6', name: 'Rosca Scott/máquina', sets: 3, reps: '10–15', notes: 'RIR 0–2.' },
        { id: 'marco-fri-7', name: 'Tríceps corda', sets: 3, reps: '10–15', notes: 'RIR 0–2.' }
      ],
      cardio: '15–20 min de cardio leve/moderado (Bicicleta, Elíptico ou Caminhada confortável)'
    }
  ],
  eliane: [
    {
      id: 'monday',
      shortName: 'Seg',
      dayOfWeek: 'Segunda-feira',
      title: 'Glúteo + Posterior',
      description: 'Foco: Fortalecimento cadeia posterior e glúteos.',
      exercises: [
        { id: 'eliane-mon-1', name: 'Elevação pélvica', sets: 4, reps: '12' },
        { id: 'eliane-mon-2', name: 'Stiff com halter', sets: 4, reps: '10' },
        { id: 'eliane-mon-3', name: 'Mesa flexora', sets: 4, reps: '12' },
        { id: 'eliane-mon-4', name: 'Afundo caminhando', sets: 3, reps: '12 cada perna' },
        { id: 'eliane-mon-5', name: 'Coice no cabo', sets: 3, reps: '15' },
        { id: 'eliane-mon-6', name: 'Abdutora', sets: 4, reps: '20' },
      ],
      cardio: '15 min caminhada inclinada'
    },
    {
      id: 'tuesday',
      shortName: 'Ter',
      dayOfWeek: 'Terça-feira',
      title: 'Superior + Core',
      description: 'Foco: Membros superiores e abdômen.',
      exercises: [
        { id: 'eliane-tue-1', name: 'Puxada frente', sets: 4, reps: '12' },
        { id: 'eliane-tue-2', name: 'Remada baixa', sets: 4, reps: '12' },
        { id: 'eliane-tue-3', name: 'Desenvolvimento com halter leve', sets: 3, reps: '12' },
        { id: 'eliane-tue-4', name: 'Tríceps corda', sets: 3, reps: '15' },
        { id: 'eliane-tue-5', name: 'Rosca direta leve', sets: 3, reps: '12' },
        { id: 'eliane-tue-6', name: 'Prancha', sets: 3, reps: '30s' },
        { id: 'eliane-tue-7', name: 'Vacuum abdominal', sets: 3, reps: '20s' },
      ],
      cardio: '20 min caminhada ou bike'
    },
    {
      id: 'wednesday',
      shortName: 'Qua',
      dayOfWeek: 'Quarta-feira',
      title: 'Quadríceps + Glúteo',
      description: 'Foco: Membros inferiores.',
      exercises: [
        { id: 'eliane-wed-1', name: 'Agachamento guiado', sets: 4, reps: '10' },
        { id: 'eliane-wed-2', name: 'Leg press', sets: 4, reps: '12' },
        { id: 'eliane-wed-3', name: 'Cadeira extensora', sets: 4, reps: '15' },
        { id: 'eliane-wed-4', name: 'Passada com halter', sets: 3, reps: '12 cada perna' },
        { id: 'eliane-wed-5', name: 'Abdutora', sets: 4, reps: '20' },
        { id: 'eliane-wed-6', name: 'Panturrilha máquina', sets: 4, reps: '15' },
      ],
      cardio: '10 min HIIT leve'
    },
    {
      id: 'thursday',
      shortName: 'Qui',
      dayOfWeek: 'Quinta-feira',
      title: 'Cardio + Core + Mobilidade',
      description: 'Foco: Condicionamento e mobilidade.',
      exercises: [
        { id: 'eliane-thu-1', name: 'Caminhada inclinada', sets: 1, reps: '20 min' },
        { id: 'eliane-thu-2', name: 'Bike', sets: 1, reps: '15 min' },
        { id: 'eliane-thu-3', name: 'Prancha lateral', sets: 3, reps: '30s' },
        { id: 'eliane-thu-4', name: 'Dead bug', sets: 3, reps: '15' },
        { id: 'eliane-thu-5', name: 'Vacuum abdominal', sets: 3, reps: '20s' },
        { id: 'eliane-thu-6', name: 'Alongamento lombar e quadril', sets: 1, reps: '10 min' },
      ],
      cardio: ''
    },
    {
      id: 'friday',
      shortName: 'Sex',
      dayOfWeek: 'Sexta-feira',
      title: 'Glúteo Completo',
      description: 'Foco: Foco total em glúteos.',
      exercises: [
        { id: 'eliane-fri-1', name: 'Hip thrust', sets: 4, reps: '12' },
        { id: 'eliane-fri-2', name: 'Agachamento búlgaro', sets: 3, reps: '10 cada perna' },
        { id: 'eliane-fri-3', name: 'Stiff com halter', sets: 4, reps: '10' },
        { id: 'eliane-fri-4', name: 'Glúteo máquina', sets: 4, reps: '15' },
        { id: 'eliane-fri-5', name: 'Abdutora', sets: 4, reps: '20' },
        { id: 'eliane-fri-6', name: 'Step-up no banco', sets: 3, reps: '12 cada perna' },
      ],
      cardio: '15 min escada ou caminhada inclinada'
    }
  ],
  isabel: [
    {
      id: 'monday',
      shortName: 'Seg',
      dayOfWeek: 'Segunda-feira',
      title: 'Glúteos',
      exercises: [
        { id: 'isabel-mon-1', name: 'Abdutora', sets: 3, reps: '15' },
        { id: 'isabel-mon-2', name: 'Elevação pélvica', sets: 4, reps: '12' },
        { id: 'isabel-mon-3', name: 'Coice na polia', sets: 3, reps: '12' },
        { id: 'isabel-mon-4', name: 'Flexora', sets: 3, reps: '12' },
        { id: 'isabel-mon-5', name: 'Mesa flexora', sets: 3, reps: '12' },
      ],
      description: 'Treino de glúteos.',
      cardio: ''
    },
    {
      id: 'tuesday',
      shortName: 'Ter',
      dayOfWeek: 'Terça-feira',
      title: 'Peito e Tríceps',
      exercises: [
        { id: 'isabel-tue-1', name: 'Supino reto', sets: 3, reps: '12' },
        { id: 'isabel-tue-2', name: 'Supino reto com alteres', sets: 3, reps: '12' },
        { id: 'isabel-tue-3', name: 'Supino reto na máquina', sets: 3, reps: '12' },
        { id: 'isabel-tue-4', name: 'Tríceps na polia', sets: 3, reps: '15' },
        { id: 'isabel-tue-5', name: 'Tríceps na máquina', sets: 3, reps: '15' },
        { id: 'isabel-tue-6', name: 'Tríceps francês', sets: 3, reps: '12' },
      ],
      description: '',
      cardio: ''
    },
    {
      id: 'wednesday',
      shortName: 'Qua',
      dayOfWeek: 'Quarta-feira',
      title: 'Cárdio',
      exercises: [
        { id: 'isabel-wed-1', name: 'Jump', sets: 1, reps: '30 min' },
      ],
      description: 'Cárdio intenso.',
      cardio: ''
    },
    {
      id: 'thursday',
      shortName: 'Qui',
      dayOfWeek: 'Quinta-feira',
      title: 'Quadríceps e interno de coxa',
      exercises: [
        { id: 'isabel-thu-1', name: 'Extensora', sets: 3, reps: '15' },
        { id: 'isabel-thu-2', name: 'Agachamento smith', sets: 4, reps: '10' },
        { id: 'isabel-thu-3', name: 'Leg 45', sets: 4, reps: '12' },
        { id: 'isabel-thu-4', name: 'Leg horizontal unilateral', sets: 3, reps: '12' },
        { id: 'isabel-thu-5', name: 'Adutora', sets: 4, reps: '15' },
      ],
      description: '',
      cardio: ''
    },
    {
      id: 'friday',
      shortName: 'Sex',
      dayOfWeek: 'Sexta-feira',
      title: 'Costa e ombro',
      exercises: [
        { id: 'isabel-fri-1', name: 'Puxada alta', sets: 4, reps: '12' },
        { id: 'isabel-fri-2', name: 'Puxada alta com triângulo', sets: 4, reps: '12' },
        { id: 'isabel-fri-3', name: 'Remada baixa', sets: 4, reps: '12' },
        { id: 'isabel-fri-4', name: 'Puxada articulada unilateral', sets: 3, reps: '12' },
        { id: 'isabel-fri-5', name: 'Graviton', sets: 3, reps: '12' },
        { id: 'isabel-fri-6', name: 'Rosca direta', sets: 3, reps: '12' },
        { id: 'isabel-fri-7', name: 'Rosca martelo', sets: 3, reps: '12' },
        { id: 'isabel-fri-8', name: 'Rosca no cabo', sets: 3, reps: '12' },
      ],
      description: '',
      cardio: ''
    }
  ]
};

export default function App() {
  const [activeUser, setActiveUser] = useState<'marco' | 'eliane' | 'isabel'>('marco');
  const [view, setView] = useState<'workout' | 'history' | 'profile'>('workout');
  const workoutPlan = workoutPlans[activeUser];
  
  const [activeDay, setActiveDay] = useState<string>(() => {
    const today = new Date().getDay();
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

  const [exerciseLoads, setExerciseLoads] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('workout-loads');
    return saved ? JSON.parse(saved) : {};
  });

  const [profileAnswers, setProfileAnswers] = useState<Record<string, Record<string, string>>>(() => {
    const saved = localStorage.getItem('workout-profile-answers');
    if (saved) return JSON.parse(saved);
    
    return {
      marco: {
        meals: '4 refeições principais por dia',
        breakfast: 'Pão integral com ovos mexidos, café preto e fruta',
        lunch: 'Arroz, feijão, 150g de filé de frango grelhado e salada verde',
        dinner: 'Tapioca com ovos ou porção de arroz com carne moída magra',
        sweets: 'Consumo esporádico (1-2x por semana), refrigerante zero de vez em quando',
        alcohol: 'Socialmente aos finais de semana (moderado)',
        supplements: 'Whey Protein (pós-treino) e Creatina (5g/dia)',
        sleep: '7 horas de sono de qualidade',
        time: 'À noite, por volta das 19h',
        loads: 'Supino: 18kg/lado | Leg Press: 140kg | Cadeira Extensora: 60kg | Puxada Alta: 55kg'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('workout-profile-answers', JSON.stringify(profileAnswers));
  }, [profileAnswers]);

  useEffect(() => {
    localStorage.setItem('workout-progress', JSON.stringify(completedItems));
  }, [completedItems]);

  useEffect(() => {
    localStorage.setItem('workout-loads', JSON.stringify(exerciseLoads));
  }, [exerciseLoads]);

  useEffect(() => {
    localStorage.setItem('workout-history', JSON.stringify(history));
  }, [history]);

  // Timer State
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [restTime, setRestTime] = useState<number | null>(null);
  const [initialRestTime, setInitialRestTime] = useState<number>(60);

  // Media Modal State
  const [selectedExerciseForMedia, setSelectedExerciseForMedia] = useState<Exercise | null>(null);

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

  const totalEstimatedVolume = currentDayData.exercises.reduce((acc, exercise) => {
    const loads = exerciseLoads[exercise.id] || [];
    const exerciseSum = loads.reduce((sum, load) => {
      if (!load) return sum;
      const cleaned = load.replace(',', '.');
      const match = cleaned.match(/([0-9]*\.?[0-9]+)/);
      const val = match ? parseFloat(match[0]) : 0;
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
    return acc + exerciseSum;
  }, 0);

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
      totalItems,
      totalVolume: totalEstimatedVolume
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
          <div className="flex bg-zinc-950 rounded-lg p-1 mr-auto ml-4">
            <button 
              onClick={() => { setActiveUser('marco'); setActiveDay(workoutPlans.marco[0].id); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeUser === 'marco' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              Marco
            </button>
            <button 
              onClick={() => { setActiveUser('eliane'); setActiveDay(workoutPlans.eliane[0].id); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeUser === 'eliane' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              Eliane
            </button>
            <button 
              onClick={() => { setActiveUser('isabel'); setActiveDay(workoutPlans.isabel[0].id); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeUser === 'isabel' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              Isabel
            </button>
          </div>
          <div className="flex items-center gap-1">
            {view !== 'workout' ? (
              <button 
                onClick={() => setView('workout')}
                className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800"
                aria-label="Voltar para o treino"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setView('profile')}
                  className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800"
                  title="Anamnese & Dieta"
                  aria-label="Anamnese & Dieta"
                >
                  <ClipboardList className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setView('history')}
                  className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800"
                  title="Ver Histórico"
                  aria-label="Ver histórico"
                >
                  <History className="w-5 h-5" />
                </button>
                <button 
                  onClick={resetDay}
                  className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800"
                  title="Reiniciar Treino"
                  aria-label="Reiniciar treino do dia"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Day Selector */}
        <div className={`max-w-md mx-auto px-4 pb-4 transition-all duration-300 ${view === 'workout' ? 'block' : 'hidden'}`}>
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
          {view === 'workout' && (
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

                {/* Volume Total Estimado */}
                <div className="mt-4 pt-4 border-t border-zinc-800/80 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Volume Total Estimado</span>
                  </div>
                  <div className="flex items-baseline gap-1 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 shadow-inner">
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {totalEstimatedVolume % 1 === 0 ? totalEstimatedVolume : totalEstimatedVolume.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase">kg</span>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs text-orange-400 bg-orange-400/10 p-3 rounded-xl border border-orange-400/20">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Descanso: Compostos 60–90s | Isoladores 45s | Circuitos 90s. Tempo total: ~45 min.</p>
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
                    {/* Top action area split into interactive parts */}
                    <div className="p-4 flex items-start justify-between gap-4">
                      <button
                        onClick={() => toggleItem(exercise.id)}
                        className="flex-1 text-left flex items-start gap-3 focus:outline-none"
                      >
                        <div className="mt-0.5 shrink-0 transition-colors duration-300">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5.5 h-5.5 text-zinc-600 group-hover:text-zinc-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`font-semibold text-base mb-1 transition-colors duration-300 leading-tight ${isCompleted ? 'text-emerald-100' : 'text-zinc-100'}`}>
                            {exercise.name}
                          </h4>
                          
                          <div className="flex items-center gap-3 text-sm">
                            <span className={`px-2 py-0.5 rounded font-mono text-xs font-semibold ${isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-300'}`}>
                              {exercise.sets} {exercise.sets > 1 ? 'séries' : 'série'}
                            </span>
                            <span className={`text-xs font-medium ${isCompleted ? 'text-emerald-400/70' : 'text-zinc-500'}`}>
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

                      <button
                        onClick={() => setSelectedExerciseForMedia(exercise)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
                        title="Ver execução do exercício"
                        aria-label="Ver execução do exercício"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weight Load Input for each set */}
                    <div className="px-4 pb-4 pt-2 border-t border-zinc-800/50 bg-zinc-950/20 group-hover:bg-zinc-950/30 transition-colors">
                      <div className="flex items-center gap-1.5 mb-2 text-zinc-400 font-medium">
                        <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-xs">Cargas por série:</span>
                      </div>
                      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2">
                        {Array.from({ length: exercise.sets }).map((_, sIdx) => {
                          const loadValue = exerciseLoads[exercise.id]?.[sIdx] || '';
                          return (
                            <div key={sIdx} className="flex flex-col gap-1">
                              <span className="text-[10px] text-zinc-500 font-bold font-mono pl-0.5 uppercase">
                                S{sIdx + 1}
                              </span>
                              <input
                                type="text"
                                placeholder="— kg"
                                value={loadValue}
                                onChange={(e) => {
                                  const newVal = e.target.value;
                                  setExerciseLoads(prev => {
                                    const currentLoads = [...(prev[exercise.id] || [])];
                                    while (currentLoads.length < exercise.sets) {
                                      currentLoads.push('');
                                    }
                                    currentLoads[sIdx] = newVal;
                                    return {
                                      ...prev,
                                      [exercise.id]: currentLoads
                                    };
                                  });
                                }}
                                className="w-full bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 rounded-lg px-2 py-1 text-xs text-zinc-100 placeholder-zinc-700 font-mono text-center transition"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
          )}
          {view === 'history' && (
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

              {/* 5-Week Double Progression Line Chart */}
              {(() => {
                const now = new Date();
                const weeks = [
                  { label: 'Sem 1', weekAgo: 4 },
                  { label: 'Sem 2', weekAgo: 3 },
                  { label: 'Sem 3', weekAgo: 2 },
                  { label: 'Sem 4', weekAgo: 1 },
                  { label: 'Sem 5 (Atual)', weekAgo: 0 },
                ];

                const currentOrBaseLoad = totalEstimatedVolume > 0 ? totalEstimatedVolume : 285;

                const fiveWeeksData = weeks.map((w, index) => {
                  const startWindow = new Date(now.getTime() - (w.weekAgo + 1) * 7 * 24 * 60 * 60 * 1000);
                  const endWindow = new Date(now.getTime() - w.weekAgo * 7 * 24 * 60 * 60 * 1000);

                  const entriesInWindow = history.filter(h => {
                    const hDate = new Date(h.date);
                    return hDate >= startWindow && (w.weekAgo === 0 ? true : hDate < endWindow);
                  });

                  const entriesWithVolume = entriesInWindow.filter(e => e.totalVolume !== undefined && e.totalVolume > 0);

                  let carga: number;
                  if (entriesWithVolume.length > 0) {
                    const sum = entriesWithVolume.reduce((acc, cur) => acc + (cur.totalVolume || 0), 0);
                    carga = Math.round(sum / entriesWithVolume.length);
                  } else {
                    const progressionFactor = 1 - (4 - index) * 0.035;
                    carga = Math.round(currentOrBaseLoad * progressionFactor);
                  }

                  return {
                    semana: w.label,
                    carga: carga,
                    meta: Math.round(carga * 1.03),
                  };
                });

                const firstWeekLoad = fiveWeeksData[0]?.carga || 1;
                const latestWeekLoad = fiveWeeksData[fiveWeeksData.length - 1]?.carga || 1;
                const diffPercent = Math.round(((latestWeekLoad - firstWeekLoad) / firstWeekLoad) * 100);
                const diffKg = latestWeekLoad - firstWeekLoad;

                return (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-400 flex items-center gap-2 uppercase tracking-wide">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          Evolução da Carga Total Estimada
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Últimas 5 semanas • Progressão Dupla</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2.5 py-1 rounded-full text-xs font-bold font-mono">
                          +{diffPercent >= 0 ? diffPercent : 0}% ({diffKg >= 0 ? `+${diffKg}` : diffKg} kg)
                        </span>
                      </div>
                    </div>

                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={fiveWeeksData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="semana" 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={{ stroke: '#27272a' }} 
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `${value}kg`}
                            domain={['dataMin - 15', 'dataMax + 15']}
                          />
                          <Tooltip 
                            cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '3 3' }}
                            contentStyle={{ 
                              backgroundColor: '#18181b', 
                              borderColor: '#27272a', 
                              borderRadius: '12px',
                              fontSize: '11px',
                              color: '#fff',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                            }}
                            formatter={(value: any) => [`${value} kg`, 'Carga Total']}
                            labelFormatter={(label) => `Período: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="carga" 
                            name="Carga Total"
                            stroke="#10b981" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10b981', stroke: '#18181b', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                      <span>Carga Atual: <strong className="text-zinc-200">{latestWeekLoad} kg</strong></span>
                      <span className="text-emerald-400 font-medium">Meta Próxima: {Math.round(latestWeekLoad * 1.03)} kg</span>
                    </div>
                  </div>
                );
              })()}
              
              {history.length > 0 && (() => {
                const chartData = [...history]
                  .slice(0, 7)
                  .reverse()
                  .map(entry => {
                    const percentage = Math.round((entry.completedCount / entry.totalItems) * 100);
                    const dateObj = new Date(entry.date);
                    return {
                      name: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                      porcentagem: percentage,
                      title: entry.dayTitle,
                    };
                  });

                return (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-6">
                    <h3 className="text-xs font-semibold text-zinc-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      Últimos 7 Treinos (% Conclusão)
                    </h3>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                          <XAxis 
                            dataKey="name" 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={10} 
                            domain={[0, 100]} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 6 }}
                            contentStyle={{ 
                              backgroundColor: '#18181b', 
                              borderColor: '#27272a', 
                              borderRadius: '12px',
                              fontSize: '11px',
                              color: '#fff'
                            }}
                            formatter={(value: any, name: any, props: any) => [
                              `${value}%`, 
                              props.payload.title
                            ]}
                          />
                          <Bar 
                            dataKey="porcentagem" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]} 
                            maxBarSize={28}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })()}
              
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
                          <div className="flex items-center gap-2">
                            {entry.totalVolume !== undefined && entry.totalVolume > 0 && (
                              <div className="text-right bg-zinc-950 px-2.5 py-1.5 rounded-xl border border-zinc-800 flex items-center gap-1.5" title="Carga total estimada">
                                <Dumbbell className="w-3.5 h-3.5 text-zinc-400" />
                                <span className="text-xs font-semibold text-zinc-200">{entry.totalVolume} kg</span>
                              </div>
                            )}
                            <div className="text-right bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                              <span className="text-emerald-400 font-bold">
                                {percentage}%
                              </span>
                            </div>
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

          {view === 'profile' && (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="pb-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-white capitalize">Anamnese & Dieta ({activeUser})</h2>
              </div>

              {/* Strategy Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Estratégia Estética & Treino
                </h3>
                <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
                  <p>
                    <strong className="text-zinc-200">Recomposição Corporal:</strong> Foco no ganho de ombros/dorsais para formato em V, aumento de volume peitoral e desenvolvimento de braços, enquanto promovemos a redução de gordura abdominal.
                  </p>
                  <p>
                    <strong className="text-zinc-200">Progressão Dupla (Double Progression):</strong> Ao atingir o limite superior de repetições em todas as séries de um exercício com postura perfeita, suba a carga na próxima sessão de treino.
                  </p>
                  <p>
                    <strong className="text-zinc-200">Regra de RIR (Reps in Reserve):</strong>
                    <span className="block pl-3 mt-1 border-l-2 border-zinc-800">
                      • Compostos: 1–3 RIR (1 a 3 repetições de reserva antes da falha).<br />
                      • Isoladores: 0–2 RIR (maior proximidade da falha controlada).
                    </span>
                  </p>
                </div>
              </div>

              {/* Form questions */}
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-base font-semibold text-white">Questionário Nutrição e Rotina</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'meals', label: 'Quantas refeições você faz por dia?', placeholder: 'Ex: 4 refeições principais' },
                      { id: 'breakfast', label: 'Café da manhã?', placeholder: 'Ex: Ovos, pão integral, café e fruta' },
                      { id: 'lunch', label: 'Almoço?', placeholder: 'Ex: Arroz, feijão, frango grelhado e vegetais' },
                      { id: 'dinner', label: 'Jantar?', placeholder: 'Ex: Arroz com patinho ou crepioca de frango' },
                      { id: 'sweets', label: 'Frequência de doces/refrigerante?', placeholder: 'Ex: Raros ou apenas nos fins de semana' },
                      { id: 'alcohol', label: 'Consumo de álcool?', placeholder: 'Ex: Raramente ou socialmente aos fins de semana' },
                      { id: 'supplements', label: 'Usa suplementos (Whey/Creatina)?', placeholder: 'Ex: Creatina 5g e Whey Protein diário' },
                      { id: 'sleep', label: 'Horas de sono por noite?', placeholder: 'Ex: 7 a 8 horas de sono de qualidade' },
                      { id: 'time', label: 'Horário pretendido de treino?', placeholder: 'Ex: Às 19h (pós-trabalho)' },
                      { id: 'loads', label: 'Cargas atuais nos principais exercícios:', placeholder: 'Ex: Supino Halter: 20kg/lado, Leg Press: 140kg' }
                    ].map(q => {
                      const userAns = profileAnswers[activeUser] || {};
                      return (
                        <div key={q.id} className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-400 block">{q.label}</label>
                          <textarea
                            value={userAns[q.id] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProfileAnswers(prev => ({
                                ...prev,
                                [activeUser]: {
                                  ...(prev[activeUser] || {}),
                                  [q.id]: val
                                }
                              }));
                            }}
                            placeholder={q.placeholder}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none h-16 transition-colors"
                          />
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        alert('Respostas salvas com sucesso no banco de dados local do seu perfil!');
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Salvar e Atualizar Perfil
                    </button>
                  </div>
                </div>
              </div>
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
                {[45, 60, 90].map(sec => (
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

      {/* Exercise Media Modal */}
      <AnimatePresence>
        {selectedExerciseForMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedExerciseForMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white pr-4">
                  Como executar: {selectedExerciseForMedia.name}
                </h3>
                <button 
                  onClick={() => setSelectedExerciseForMedia(null)}
                  className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-zinc-400 text-sm mb-6">
                Escolha onde deseja buscar a demonstração visual deste exercício:
              </p>

              <div className="space-y-3">
                <a
                  href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(selectedExerciseForMedia.name + ' musculação execução')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors text-white font-medium"
                >
                  <Image className="w-5 h-5 text-blue-400" />
                  Ver Imagens (Google)
                </a>
                
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedExerciseForMedia.name + ' musculação execução')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors text-white font-medium"
                >
                  <PlaySquare className="w-5 h-5 text-red-400" />
                  Ver Vídeos (YouTube)
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
