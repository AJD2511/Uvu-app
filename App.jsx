import React, { useState, useEffect, useCallback } from 'react';

const DEFAULT_TASKS = [
  { id: 1, name: 'Out of bed @ alarm', points: 5, type: 'tickoff' },
  { id: 2, name: 'Applications', points: 2.5, type: 'internship', stackable: true },
  { id: 3, name: 'Application + cover letter', points: 10, type: 'internship', stackable: true },
  { id: 4, name: '150g protein', points: 10, type: 'nutrition' },
  { id: 5, name: 'Development/learning app', points: 0, type: 'timed', minuteRate: 1/6 },
  { id: 6, name: 'Finance/IB learning', points: 0, type: 'timed', minuteRate: 1/6 },
  { id: 7, name: 'SPF', points: 5, type: 'tickoff' },
  { id: 8, name: 'Minoxidil', points: 5, type: 'tickoff' },
  { id: 9, name: 'Asleep by 12', points: 10, type: 'tickoff' },
  { id: 10, name: 'Gym', points: 15, type: 'fitness' },
  { id: 11, name: 'Clean room', points: 5, type: 'tickoff' },
  { id: 12, name: 'Laundry', points: 5, type: 'tickoff' },
  { id: 13, name: 'Get to office @ 8:45', points: 5, type: 'tickoff' },
];

const POINT_VALUES = [5, 10, 15, 20];
const TASK_TYPES = ['tickoff', 'internship', 'fitness', 'timed', 'nutrition'];
const PROGRESS_OPTIONS = ['Application sent', 'Tests', 'Hirevue', 'Interview', 'Offer', 'Rejected'];
const DEFAULT_EXERCISES = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row', 'Pull-ups', 'Dips', 'Bicep Curls', 'Tricep Extensions', 'Leg Press', 'Lat Pulldown', 'Cable Rows', 'Leg Curls', 'Leg Extensions', 'Calf Raises', 'Lateral Raises', 'Face Pulls', 'Romanian Deadlift', 'Hip Thrust', 'Lunges'];

// Point tier limits
const POINT_LIMITS = { 20: 1, 15: 2, 10: 3 }; // max tasks allowed at each tier

const loadFromStorage = (key, defaultValue) => { try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : defaultValue; } catch { return defaultValue; } };
const saveToStorage = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error('Failed to save:', e); } };

function Explosion({ x, y, points, onComplete }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const particleCount = Math.floor(points * 1.5);
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 2 + Math.random() * 3 + (points / 10);
      newParticles.push({ id: i, x: 0, y: 0, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, size: 2 + Math.random() * 3, opacity: 0.6 + Math.random() * 0.4, life: 1 });
    }
    setParticles(newParticles);
    const startTime = Date.now();
    const duration = 600 + points * 10;
    const animate = () => {
      const progress = (Date.now() - startTime) / duration;
      if (progress >= 1) { onComplete(); return; }
      setParticles(prev => prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.15, life: 1 - progress, opacity: p.opacity * (1 - progress) })));
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [points, onComplete]);
  return (<div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 1000 }}>{particles.map(p => (<div key={p.id} style={{ position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: '50%', background: `rgba(229, 229, 229, ${p.opacity})`, transform: `scale(${p.life})` }} />))}</div>);
}

function YearCalendar({ history }) {
  const pointsMap = {}; history.forEach(day => { pointsMap[day.date] = day.points; });
  const now = new Date(); const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1); const endOfYear = new Date(year, 11, 31);
  const days = []; const current = new Date(startOfYear);
  while (current <= endOfYear) { const dateStr = current.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); days.push({ date: new Date(current), dateStr, points: pointsMap[dateStr] || 0, isFuture: current > now }); current.setDate(current.getDate() + 1); }
  const weeks = []; let currentWeek = []; const firstDayOfWeek = startOfYear.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null);
  days.forEach((day) => { currentWeek.push(day); if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; } });
  if (currentWeek.length > 0) { while (currentWeek.length < 7) currentWeek.push(null); weeks.push(currentWeek); }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '4px', marginLeft: '20px' }}>{months.map((month) => (<span key={month} style={{ fontSize: '9px', color: '#444', width: `${100/12}%`, textAlign: 'left' }}>{month}</span>))}</div>
      <div style={{ display: 'flex', gap: '2px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px', flexShrink: 0 }}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (<div key={i} style={{ fontSize: '8px', color: '#444', height: '10px', display: 'flex', alignItems: 'center' }}>{i % 2 === 1 ? d : ''}</div>))}</div>
        {weeks.map((week, weekIndex) => (<div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>{week.map((day, dayIndex) => (<div key={dayIndex} title={day ? `${day.dateStr}: ${day.points} pts` : ''} style={{ width: '10px', height: '10px', background: day ? day.isFuture ? '#1a1a1a' : day.points > 0 ? `rgba(59, 130, 246, ${Math.max(0.2, day.points / 100)})` : '#1a1a1a' : 'transparent', borderRadius: '2px', border: day && !day.isFuture && day.points === 0 ? '1px solid #222' : 'none' }} />))}</div>))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}><span style={{ fontSize: '9px', color: '#444' }}>Less</span>{[0, 25, 50, 75, 100].map(val => (<div key={val} style={{ width: '10px', height: '10px', background: val === 0 ? '#1a1a1a' : `rgba(59, 130, 246, ${Math.max(0.2, val / 100)})`, borderRadius: '2px', border: val === 0 ? '1px solid #222' : 'none' }} />))}<span style={{ fontSize: '9px', color: '#444' }}>More</span></div>
    </div>
  );
}

function RestTimer({ onClose }) {
  const [seconds, setSeconds] = useState(90);
  const [isRunning, setIsRunning] = useState(true);
  useEffect(() => { if (!isRunning || seconds <= 0) return; const interval = setInterval(() => setSeconds(s => s - 1), 1000); return () => clearInterval(interval); }, [isRunning, seconds]);
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  return (<div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#1a1a1a', border: '1px solid #333', padding: '16px 24px', zIndex: 1000 }}><div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{formatTime(seconds)}</div><div style={{ display: 'flex', gap: '8px' }}><button className="btn" onClick={() => setIsRunning(!isRunning)} style={{ padding: '6px 12px', fontSize: '10px' }}>{isRunning ? 'Pause' : 'Resume'}</button><button className="btn" onClick={() => setSeconds(90)} style={{ padding: '6px 12px', fontSize: '10px' }}>Reset</button><button className="btn" onClick={onClose} style={{ padding: '6px 12px', fontSize: '10px' }}>Close</button></div></div>);
}

export default function App() {
  const [screen, setScreen] = useState('today');
  const [tasks, setTasks] = useState(() => loadFromStorage('uvu-tasks', DEFAULT_TASKS));
  const [completedToday, setCompletedToday] = useState(() => new Set(loadFromStorage('uvu-completed', [])));
  const [timedMinutes, setTimedMinutes] = useState(() => loadFromStorage('uvu-timed', {}));
  const [history, setHistory] = useState(() => loadFromStorage('uvu-history', []));
  const [explosions, setExplosions] = useState([]);
  const [minuteInput, setMinuteInput] = useState({});
  const [proteinEntries, setProteinEntries] = useState(() => loadFromStorage('uvu-protein', []));
  const [proteinInput, setProteinInput] = useState('');
  const [proteinLabel, setProteinLabel] = useState('');
  const [applications, setApplications] = useState(() => loadFromStorage('uvu-applications', []));
  const [newApp, setNewApp] = useState({ company: '', role: '', date: new Date().toISOString().split('T')[0], progress: 'Application sent' });
  const [workoutLog, setWorkoutLog] = useState(() => loadFromStorage('uvu-workout', []));
  const [exerciseHistory, setExerciseHistory] = useState(() => loadFromStorage('uvu-exercise-history', {}));
  const [selectedExercise, setSelectedExercise] = useState('');
  const [customExercise, setCustomExercise] = useState('');
  const [setInput, setSetInput] = useState({ weight: '', reps: '' });
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [exercises, setExercises] = useState(() => loadFromStorage('uvu-exercises', DEFAULT_EXERCISES));
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(5);
  const [newTaskType, setNewTaskType] = useState('tickoff');
  const [lastSavedDate, setLastSavedDate] = useState(() => loadFromStorage('uvu-lastSaved', new Date().toDateString()));

  useEffect(() => { saveToStorage('uvu-tasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('uvu-completed', Array.from(completedToday)); }, [completedToday]);
  useEffect(() => { saveToStorage('uvu-timed', timedMinutes); }, [timedMinutes]);
  useEffect(() => { saveToStorage('uvu-history', history); }, [history]);
  useEffect(() => { saveToStorage('uvu-protein', proteinEntries); }, [proteinEntries]);
  useEffect(() => { saveToStorage('uvu-applications', applications); }, [applications]);
  useEffect(() => { saveToStorage('uvu-workout', workoutLog); }, [workoutLog]);
  useEffect(() => { saveToStorage('uvu-exercise-history', exerciseHistory); }, [exerciseHistory]);
  useEffect(() => { saveToStorage('uvu-exercises', exercises); }, [exercises]);
  useEffect(() => { saveToStorage('uvu-lastSaved', lastSavedDate); }, [lastSavedDate]);

  const totalAssignedPoints = tasks.filter(t => t.type !== 'timed').reduce((sum, t) => sum + t.points, 0);
  const timedPoints = tasks.filter(t => t.type === 'timed').reduce((sum, t) => sum + Math.floor((timedMinutes[t.id] || 0) * t.minuteRate), 0);
  const totalProtein = proteinEntries.reduce((sum, e) => sum + e.grams, 0);
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayApplications = applications.filter(a => a.date === todayDateStr).length;
  const todayCoverLetters = applications.filter(a => a.date === todayDateStr && a.hasCoverLetter).length;
  const remainingPoints = 100 - totalAssignedPoints;
  
  // Calculate points for stackable internship tasks
  const applicationPoints = (() => {
    const appTask = tasks.find(t => t.id === 2);
    const coverTask = tasks.find(t => t.id === 3);
    let points = 0;
    if (appTask) points += todayApplications * appTask.points;
    if (coverTask) points += todayCoverLetters * coverTask.points;
    return points;
  })();
  
  const checkboxPoints = tasks.filter(t => t.type !== 'timed' && t.type !== 'internship' && completedToday.has(t.id)).reduce((sum, t) => sum + t.points, 0);
  const todayPoints = checkboxPoints + timedPoints + applicationPoints;
  
  // Count tasks at each point tier
  const getTaskCountAtTier = (tier) => tasks.filter(t => t.points === tier && t.type !== 'timed').length;
  const canAddAtTier = (tier, currentTaskId = null) => {
    const limit = POINT_LIMITS[tier];
    if (!limit) return true;
    const currentCount = tasks.filter(t => t.points === tier && t.type !== 'timed' && t.id !== currentTaskId).length;
    return currentCount < limit;
  };

  useEffect(() => { if (totalProtein >= 150 && !completedToday.has(4)) { setCompletedToday(prev => new Set([...prev, 4])); } }, [totalProtein]);
  useEffect(() => { if (workoutLog.length > 0 && !completedToday.has(10)) { setCompletedToday(prev => new Set([...prev, 10])); } }, [workoutLog]);

  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date(); const today = now.toDateString();
      if (today !== lastSavedDate) {
        const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        workoutLog.forEach(entry => { setExerciseHistory(prev => ({ ...prev, [entry.exercise]: entry.sets })); });
        const dayData = { date: yesterdayStr, points: todayPoints, completed: Array.from(completedToday), timedMinutes: { ...timedMinutes }, protein: totalProtein, workout: [...workoutLog] };
        setHistory(prev => [dayData, ...prev.slice(0, 364)]);
        setCompletedToday(new Set()); setTimedMinutes({}); setProteinEntries([]); setWorkoutLog([]); setLastSavedDate(today);
      }
    };
    checkMidnight(); const interval = setInterval(checkMidnight, 60000); return () => clearInterval(interval);
  }, [lastSavedDate, todayPoints, completedToday, timedMinutes, totalProtein, workoutLog]);

  const triggerExplosion = useCallback((e, points) => { const rect = e.currentTarget.getBoundingClientRect(); setExplosions(prev => [...prev, { id: Date.now(), x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, points }]); }, []);
  const removeExplosion = useCallback((id) => { setExplosions(prev => prev.filter(e => e.id !== id)); }, []);

  const toggleTask = (taskId, e) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.type !== 'tickoff') return;
    const wasCompleted = completedToday.has(taskId);
    setCompletedToday(prev => { const next = new Set(prev); if (next.has(taskId)) next.delete(taskId); else next.add(taskId); return next; });
    if (!wasCompleted) triggerExplosion(e, task.points);
  };

  const addTask = () => {
    if (!newTaskName.trim()) return;
    if (newTaskType !== 'timed' && totalAssignedPoints + newTaskPoints > 100) return;
    setTasks([...tasks, { id: Date.now(), name: newTaskName.trim(), points: newTaskType === 'timed' ? 0 : newTaskPoints, type: newTaskType, ...(newTaskType === 'timed' ? { minuteRate: 1/6 } : {}) }]);
    setNewTaskName(''); setNewTaskPoints(10);
  };

  const removeTask = (taskId) => { setTasks(tasks.filter(t => t.id !== taskId)); setCompletedToday(prev => { const next = new Set(prev); next.delete(taskId); return next; }); };

  const saveDay = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    workoutLog.forEach(entry => { setExerciseHistory(prev => ({ ...prev, [entry.exercise]: entry.sets })); });
    const dayData = { date: today, points: todayPoints, completed: Array.from(completedToday), timedMinutes: { ...timedMinutes }, protein: totalProtein, workout: [...workoutLog] };
    setHistory([dayData, ...history.slice(0, 364)]);
    setCompletedToday(new Set()); setTimedMinutes({}); setProteinEntries([]); setWorkoutLog([]);
  };

  const addSet = () => {
    if (!selectedExercise || !setInput.weight || !setInput.reps) return;
    const exerciseIndex = workoutLog.findIndex(e => e.exercise === selectedExercise);
    const newSet = { weight: parseFloat(setInput.weight), reps: parseInt(setInput.reps) };
    if (exerciseIndex >= 0) { const updated = [...workoutLog]; updated[exerciseIndex].sets.push(newSet); setWorkoutLog(updated); }
    else { setWorkoutLog([...workoutLog, { exercise: selectedExercise, sets: [newSet] }]); }
    setSetInput({ weight: '', reps: '' }); setShowRestTimer(true);
  };

  const addCustomExercise = () => { if (!customExercise.trim() || exercises.includes(customExercise.trim())) return; setExercises([...exercises, customExercise.trim()]); setSelectedExercise(customExercise.trim()); setCustomExercise(''); };
  const getLastWeight = (exercise) => { if (exerciseHistory[exercise] && exerciseHistory[exercise].length > 0) { return exerciseHistory[exercise][exerciseHistory[exercise].length - 1].weight; } return ''; };
  useEffect(() => { if (selectedExercise) { const lastWeight = getLastWeight(selectedExercise); if (lastWeight) setSetInput(prev => ({ ...prev, weight: lastWeight.toString() })); } }, [selectedExercise]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace", color: '#e5e5e5' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        .nav-btn { background: transparent; border: none; padding: 10px 12px; font-family: inherit; font-size: 10px; color: #666; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
        .nav-btn:hover { color: #999; } .nav-btn.active { color: #e5e5e5; }
        .input-field { background: transparent; border: none; border-bottom: 1px solid #333; padding: 12px 0; font-family: inherit; font-size: 14px; color: #e5e5e5; width: 100%; outline: none; }
        .input-field:focus { border-color: #666; } .input-field::placeholder { color: #444; }
        .task-row { display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #1a1a1a; }
        .task-row:hover { background: #111; }
        .check-box { width: 20px; height: 20px; border: 1px solid #333; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; font-size: 12px; }
        .check-box.checked { background: #e5e5e5; border-color: #e5e5e5; color: #0a0a0a; }
        .btn { background: transparent; border: 1px solid #333; padding: 10px 20px; font-family: inherit; font-size: 11px; color: #999; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
        .btn:hover { border-color: #666; color: #e5e5e5; }
        .btn-primary { background: #e5e5e5; border-color: #e5e5e5; color: #0a0a0a; }
        .btn-primary:hover { background: #fff; }
        .points-btn { width: 40px; height: 32px; background: transparent; border: 1px solid #222; font-family: inherit; font-size: 12px; color: #666; cursor: pointer; }
        .points-btn.selected { border-color: #666; color: #e5e5e5; background: #1a1a1a; }
        .points-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .history-bar { height: 4px; background: #1a1a1a; flex: 1; margin: 0 12px; }
        .history-bar-fill { height: 100%; background: #e5e5e5; }
        select { background: #1a1a1a; border: 1px solid #333; padding: 10px; font-family: inherit; font-size: 12px; color: #e5e5e5; cursor: pointer; }
        .table-header { display: grid; grid-template-columns: 2fr 2fr 1fr 2fr 40px; gap: 8px; padding: 12px 0; border-bottom: 1px solid #333; font-size: 10px; color: #666; text-transform: uppercase; }
        .table-row { display: grid; grid-template-columns: 2fr 2fr 1fr 2fr 40px; gap: 8px; padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; align-items: center; }
        .type-badge { font-size: 9px; padding: 2px 6px; border-radius: 2px; text-transform: uppercase; }
      `}</style>

      {explosions.map(exp => (<Explosion key={exp.id} x={exp.x} y={exp.y} points={exp.points} onComplete={() => removeExplosion(exp.id)} />))}
      {showRestTimer && <RestTimer onClose={() => setShowRestTimer(false)} />}

      <nav style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #1a1a1a' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0, marginRight: 'auto' }}>UvU</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['setup', 'today', 'protein', 'internships', 'fitness', 'history'].map(s => (
            <button key={s} className={`nav-btn ${screen === s ? 'active' : ''}`} onClick={() => setScreen(s)}>{s}</button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 16px' }}>

        {screen === 'setup' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Tasks</span>
                <span style={{ fontSize: '12px', color: '#444' }}>{totalAssignedPoints}/100 pts</span>
              </div>
              <div style={{ fontSize: '10px', color: '#555', marginBottom: '20px' }}>
                Limits: {getTaskCountAtTier(20)}/1 at 20pts • {getTaskCountAtTier(15)}/2 at 15pts • {getTaskCountAtTier(10)}/3 at 10pts
              </div>
              {tasks.map(task => (
                <div key={task.id} className="task-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px', padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      {editingTask === task.id ? (
                        <input type="text" value={task.name} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, name: e.target.value } : t))} onBlur={() => setEditingTask(null)} onKeyDown={(e) => e.key === 'Enter' && setEditingTask(null)} autoFocus className="input-field" />
                      ) : (
                        <span onClick={() => setEditingTask(task.id)} style={{ cursor: 'text', fontSize: '14px' }}>{task.name}</span>
                      )}
                    </div>
                    <button onClick={() => removeTask(task.id)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}>×</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <select value={task.type} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, type: e.target.value, ...(e.target.value === 'timed' ? { points: 0, minuteRate: 1/6 } : {}), stackable: e.target.value === 'internship' ? true : false } : t))} style={{ fontSize: '11px', padding: '6px' }}>
                      {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {task.type !== 'timed' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="20" 
                          step="0.5" 
                          value={task.points} 
                          onChange={(e) => {
                            const newPoints = parseFloat(e.target.value);
                            if (newPoints >= 10 && !canAddAtTier(newPoints, task.id)) return;
                            setTasks(tasks.map(t => t.id === task.id ? { ...t, points: newPoints } : t));
                          }}
                          style={{ flex: 1, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '12px', color: '#e5e5e5', minWidth: '45px', textAlign: 'right' }}>{task.points}pts</span>
                      </div>
                    )}
                    {task.type === 'timed' && <span style={{ fontSize: '11px', color: '#666' }}>⅙ pt/min</span>}
                    {task.stackable && <span style={{ fontSize: '10px', color: '#6b9fff', background: '#1e3a5f', padding: '2px 6px' }}>stackable</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '24px', padding: '16px', background: '#111', border: '1px solid #222' }}>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px', textTransform: 'uppercase' }}>Add New Task</p>
              <input type="text" placeholder="Task name..." value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} className="input-field" style={{ marginBottom: '12px' }} />
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                <select value={newTaskType} onChange={(e) => setNewTaskType(e.target.value)}>{TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
              </div>
              {newTaskType !== 'timed' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="20" 
                    step="0.5" 
                    value={newTaskPoints} 
                    onChange={(e) => {
                      const newPoints = parseFloat(e.target.value);
                      if (newPoints >= 10 && !canAddAtTier(newPoints)) return;
                      setNewTaskPoints(newPoints);
                    }}
                    style={{ flex: 1, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12px', color: '#e5e5e5', minWidth: '45px', textAlign: 'right' }}>{newTaskPoints}pts</span>
                </div>
              )}
              <button className="btn" onClick={addTask}>Add Task</button>
            </div>
          </div>
        )}

        {screen === 'today' && (
          <div>
            <div style={{ marginBottom: '40px' }}>
              <p style={{ fontSize: '12px', color: '#444', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Points today</p>
              <div style={{ fontSize: '56px', fontWeight: '700', lineHeight: 1 }}>{todayPoints}</div>
              <div style={{ width: '100%', height: '2px', background: '#1a1a1a', marginTop: '16px' }}><div style={{ width: `${Math.min(todayPoints, 100)}%`, height: '100%', background: '#e5e5e5' }} /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#444' }}><span>0</span><span>100</span></div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              {tasks.map(task => {
                const isCompleted = completedToday.has(task.id);
                if (task.type === 'timed') {
                  const minutes = timedMinutes[task.id] || 0;
                  const earnedPoints = Math.floor(minutes * task.minuteRate);
                  return (<div key={task.id} className="task-row"><span style={{ flex: 1, fontSize: '14px', opacity: minutes > 0 ? 0.6 : 1 }}>{task.name}</span><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="number" placeholder="min" value={minuteInput[task.id] || ''} onChange={(e) => setMinuteInput(prev => ({ ...prev, [task.id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') { const mins = parseInt(minuteInput[task.id]) || 0; if (mins > 0) { setTimedMinutes(prev => ({ ...prev, [task.id]: (prev[task.id] || 0) + mins })); setMinuteInput(prev => ({ ...prev, [task.id]: '' })); triggerExplosion(e, Math.floor(mins * task.minuteRate)); } } }} className="input-field" style={{ width: '50px', textAlign: 'center', padding: '6px' }} /><button onClick={(e) => { const mins = parseInt(minuteInput[task.id]) || 0; if (mins > 0) { setTimedMinutes(prev => ({ ...prev, [task.id]: (prev[task.id] || 0) + mins })); setMinuteInput(prev => ({ ...prev, [task.id]: '' })); triggerExplosion(e, Math.floor(mins * task.minuteRate)); } }} className="btn" style={{ padding: '6px 10px', fontSize: '10px' }}>Add</button><span style={{ fontSize: '11px', color: minutes > 0 ? '#e5e5e5' : '#444', minWidth: '60px', textAlign: 'right' }}>{minutes > 0 ? `${minutes}m → +${earnedPoints}` : '⅙ pt/m'}</span></div></div>);
                }
                if (task.type === 'nutrition') return (<div key={task.id} className="task-row" onClick={() => setScreen('protein')} style={{ cursor: 'pointer' }}><div className={`check-box ${isCompleted ? 'checked' : ''}`}>{isCompleted && '✓'}</div><span style={{ flex: 1, marginLeft: '16px', fontSize: '14px', opacity: isCompleted ? 0.4 : 1 }}>{task.name}</span><span style={{ fontSize: '12px', color: '#666' }}>{totalProtein}g → </span><span style={{ fontSize: '12px', color: isCompleted ? '#22c55e' : '#444' }}>+{task.points}</span></div>);
                if (task.type === 'internship') {
                  const earnedPts = task.id === 2 ? todayApplications * task.points : task.id === 3 ? todayCoverLetters * task.points : 0;
                  const count = task.id === 2 ? todayApplications : todayCoverLetters;
                  return (<div key={task.id} className="task-row" onClick={() => setScreen('internships')} style={{ cursor: 'pointer' }}><div className={`check-box ${count > 0 ? 'checked' : ''}`}>{count > 0 && '✓'}</div><span style={{ flex: 1, marginLeft: '16px', fontSize: '14px', opacity: count > 0 ? 0.7 : 1 }}>{task.name}</span><span style={{ fontSize: '12px', color: '#666' }}>{count > 0 ? `×${count} = ` : ''}</span><span style={{ fontSize: '12px', color: count > 0 ? '#22c55e' : '#444' }}>+{earnedPts || task.points}</span></div>);
                }
                if (task.type === 'fitness') return (<div key={task.id} className="task-row" onClick={() => setScreen('fitness')} style={{ cursor: 'pointer' }}><div className={`check-box ${isCompleted ? 'checked' : ''}`}>{isCompleted && '✓'}</div><span style={{ flex: 1, marginLeft: '16px', fontSize: '14px', opacity: isCompleted ? 0.4 : 1 }}>{task.name}</span><span style={{ fontSize: '12px', color: '#666' }}>{workoutLog.length} exercises → </span><span style={{ fontSize: '12px', color: isCompleted ? '#666' : '#444' }}>+{task.points}</span></div>);
                return (<div key={task.id} className="task-row" onClick={(e) => toggleTask(task.id, e)} style={{ cursor: 'pointer' }}><div className={`check-box ${isCompleted ? 'checked' : ''}`}>{isCompleted && '✓'}</div><span style={{ flex: 1, marginLeft: '16px', fontSize: '14px', opacity: isCompleted ? 0.4 : 1, textDecoration: isCompleted ? 'line-through' : 'none' }}>{task.name}</span><span style={{ fontSize: '12px', color: isCompleted ? '#666' : '#444' }}>+{task.points}</span></div>);
              })}
            </div>
            <button className="btn-primary btn" onClick={saveDay}>Complete day</button>
          </div>
        )}

        {screen === 'protein' && (
          <div>
            <div style={{ marginBottom: '40px' }}>
              <p style={{ fontSize: '12px', color: '#444', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Protein today</p>
              <div style={{ fontSize: '56px', fontWeight: '700', lineHeight: 1 }}>{totalProtein}<span style={{ fontSize: '24px', color: '#444' }}>g</span></div>
              <div style={{ width: '100%', height: '2px', background: '#1a1a1a', marginTop: '16px' }}><div style={{ width: `${Math.min((totalProtein / 150) * 100, 100)}%`, height: '100%', background: totalProtein >= 150 ? '#22c55e' : '#e5e5e5' }} /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#444' }}><span>0g</span><span>150g goal</span></div>
              {totalProtein >= 150 && <p style={{ fontSize: '12px', color: '#22c55e', marginTop: '12px' }}>✓ Goal reached! (+10 pts)</p>}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input type="text" placeholder="What did you eat?" value={proteinLabel} onChange={(e) => setProteinLabel(e.target.value)} className="input-field" style={{ flex: 1 }} />
              <input type="number" placeholder="g" value={proteinInput} onChange={(e) => setProteinInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { const grams = parseInt(proteinInput) || 0; if (grams > 0) { setProteinEntries(prev => [...prev, { id: Date.now(), label: proteinLabel || 'Food', grams }]); setProteinInput(''); setProteinLabel(''); } } }} className="input-field" style={{ width: '60px', textAlign: 'center' }} />
              <button onClick={() => { const grams = parseInt(proteinInput) || 0; if (grams > 0) { setProteinEntries(prev => [...prev, { id: Date.now(), label: proteinLabel || 'Food', grams }]); setProteinInput(''); setProteinLabel(''); } }} className="btn" style={{ padding: '10px 14px' }}>Add</button>
            </div>
            {proteinEntries.length === 0 ? <p style={{ color: '#444', fontSize: '14px' }}>No entries yet today.</p> : proteinEntries.map(entry => (<div key={entry.id} className="task-row"><span style={{ flex: 1, fontSize: '14px' }}>{entry.label}</span><span style={{ fontSize: '14px', marginRight: '12px' }}>{entry.grams}g</span><button onClick={() => setProteinEntries(prev => prev.filter(e => e.id !== entry.id))} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', fontSize: '16px' }}>×</button></div>))}
          </div>
        )}

        {screen === 'internships' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: '#444', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Applications Tracker</p>
              <p style={{ fontSize: '11px', color: '#666' }}>Today: {todayApplications} application{todayApplications !== 1 ? 's' : ''}{todayCoverLetters > 0 && ` (${todayCoverLetters} with cover letter)`}</p>
            </div>
            <div style={{ marginBottom: '24px', padding: '16px', background: '#111', border: '1px solid #222' }}>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px', textTransform: 'uppercase' }}>Add Application</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Company name" value={newApp.company} onChange={(e) => setNewApp({ ...newApp, company: e.target.value })} className="input-field" />
                <input type="text" placeholder="Role" value={newApp.role} onChange={(e) => setNewApp({ ...newApp, role: e.target.value })} className="input-field" />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="date" value={newApp.date} onChange={(e) => setNewApp({ ...newApp, date: e.target.value })} style={{ background: '#1a1a1a', border: '1px solid #333', padding: '8px', color: '#e5e5e5', fontFamily: 'inherit' }} />
                  <select value={newApp.progress} onChange={(e) => setNewApp({ ...newApp, progress: e.target.value })}>{PROGRESS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#999' }}><input type="checkbox" checked={newApp.hasCoverLetter || false} onChange={(e) => setNewApp({ ...newApp, hasCoverLetter: e.target.checked })} />Cover letter</label>
                </div>
                <button className="btn" onClick={() => { if (newApp.company && newApp.role) { setApplications([...applications, { ...newApp, id: Date.now() }]); setNewApp({ company: '', role: '', date: new Date().toISOString().split('T')[0], progress: 'Application sent', hasCoverLetter: false }); } }}>Add Application</button>
              </div>
            </div>
            {applications.length === 0 ? <p style={{ color: '#444', fontSize: '14px' }}>No applications yet.</p> : (<><div className="table-header"><span>Company</span><span>Role</span><span>Date</span><span>Progress</span><span></span></div>{applications.map(app => (<div key={app.id} className="table-row"><span style={{ fontWeight: '500' }}>{app.company}</span><span style={{ color: '#999' }}>{app.role}</span><span style={{ color: '#666', fontSize: '11px' }}>{app.date}</span><select value={app.progress} onChange={(e) => { setApplications(applications.map(a => a.id === app.id ? { ...a, progress: e.target.value } : a)); }} style={{ fontSize: '11px', padding: '4px' }}>{PROGRESS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select><button onClick={() => setApplications(applications.filter(a => a.id !== app.id))} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', fontSize: '14px' }}>×</button></div>))}</>)}
          </div>
        )}

        {screen === 'fitness' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: '#444', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Workout Log</p>
              <p style={{ fontSize: '11px', color: '#666' }}>{workoutLog.length} exercise{workoutLog.length !== 1 ? 's' : ''} logged today{workoutLog.length > 0 && ' (+10 pts)'}</p>
            </div>
            <div style={{ marginBottom: '24px', padding: '16px', background: '#111', border: '1px solid #222' }}>
              <div style={{ marginBottom: '12px' }}>
                <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} style={{ width: '100%', marginBottom: '8px' }}><option value="">Select exercise...</option>{exercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}</select>
                <div style={{ display: 'flex', gap: '8px' }}><input type="text" placeholder="Custom exercise..." value={customExercise} onChange={(e) => setCustomExercise(e.target.value)} className="input-field" style={{ flex: 1 }} /><button className="btn" onClick={addCustomExercise} style={{ padding: '8px 12px', fontSize: '10px' }}>Add</button></div>
              </div>
              {selectedExercise && (<div><p style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>{exerciseHistory[selectedExercise] ? `Last: ${exerciseHistory[selectedExercise].map(s => `${s.weight}kg × ${s.reps}`).join(', ')}` : 'No previous data'}</p><div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><input type="number" placeholder="kg" value={setInput.weight} onChange={(e) => setSetInput({ ...setInput, weight: e.target.value })} className="input-field" style={{ width: '70px', textAlign: 'center' }} /><span style={{ color: '#666' }}>×</span><input type="number" placeholder="reps" value={setInput.reps} onChange={(e) => setSetInput({ ...setInput, reps: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addSet()} className="input-field" style={{ width: '70px', textAlign: 'center' }} /><button className="btn" onClick={addSet} style={{ padding: '10px 14px' }}>Log Set</button></div></div>)}
            </div>
            {workoutLog.length === 0 ? <p style={{ color: '#444', fontSize: '14px' }}>No exercises logged today.</p> : workoutLog.map((entry, i) => (<div key={i} style={{ marginBottom: '16px', padding: '12px', background: '#111', border: '1px solid #1a1a1a' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><span style={{ fontWeight: '500' }}>{entry.exercise}</span><button onClick={() => setWorkoutLog(workoutLog.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', fontSize: '14px' }}>×</button></div><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{entry.sets.map((set, j) => (<span key={j} style={{ background: '#1a1a1a', padding: '4px 8px', fontSize: '12px', color: '#999' }}>{set.weight}kg × {set.reps}</span>))}</div></div>))}
            <button className="btn" onClick={() => setShowRestTimer(true)} style={{ marginTop: '16px' }}>Start Rest Timer (90s)</button>
          </div>
        )}

        {screen === 'history' && (
          <div>
            <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '16px' }}>Most Recent Week</p>
            <div style={{ marginBottom: '40px' }}>{history.slice(0, 7).map((day, i) => (<div key={i} className="task-row" style={{ padding: '12px 0' }}><span style={{ fontSize: '12px', color: '#666', width: '100px', flexShrink: 0 }}>{day.date}</span><div className="history-bar"><div className="history-bar-fill" style={{ width: `${day.points}%` }} /></div><span style={{ fontSize: '14px', width: '36px', textAlign: 'right' }}>{day.points}</span></div>))}{history.length === 0 && <p style={{ color: '#444', fontSize: '14px' }}>No completed days yet.</p>}</div>
            <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '16px' }}>Year Overview</p>
            <div style={{ marginBottom: '40px' }}><YearCalendar history={history} /></div>
            {history.length > 0 && (<div style={{ display: 'flex', gap: '24px', paddingTop: '24px', borderTop: '1px solid #1a1a1a', fontSize: '12px', flexWrap: 'wrap' }}><div><div style={{ color: '#444', marginBottom: '4px' }}>Days</div><div>{history.length}</div></div><div><div style={{ color: '#444', marginBottom: '4px' }}>Total</div><div>{history.reduce((s, d) => s + d.points, 0)}</div></div><div><div style={{ color: '#444', marginBottom: '4px' }}>Avg</div><div>{Math.round(history.reduce((s, d) => s + d.points, 0) / history.length)}</div></div><div><div style={{ color: '#444', marginBottom: '4px' }}>Best</div><div>{Math.max(...history.map(d => d.points))}</div></div></div>)}
          </div>
        )}

      </div>
    </div>
  );
}
