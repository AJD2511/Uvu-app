import React, { useState, useEffect, useCallback } from 'react';

const POINT_VALUES = [5, 10, 15, 20];

const DEFAULT_TASKS = [
  { id: 1, name: 'Out of bed @ alarm', points: 5, type: 'checkbox' },
  { id: 2, name: 'Applications', points: 5, type: 'checkbox' },
  { id: 3, name: 'Application + cover letter', points: 20, type: 'checkbox' },
  { id: 4, name: '150g protein', points: 10, type: 'checkbox' },
  { id: 5, name: 'Development/learning app', points: 0, type: 'timed', minuteRate: 1/6 },
  { id: 6, name: 'Finance/IB learning', points: 0, type: 'timed', minuteRate: 1/6 },
  { id: 7, name: 'SPF', points: 5, type: 'checkbox' },
  { id: 8, name: 'Minoxidil', points: 5, type: 'checkbox' },
  { id: 9, name: 'Asleep by 12', points: 10, type: 'checkbox' },
  { id: 10, name: 'Gym', points: 10, type: 'checkbox' },
  { id: 11, name: 'Clean room', points: 10, type: 'checkbox' },
  { id: 12, name: 'Laundry', points: 5, type: 'checkbox' },
  { id: 13, name: 'Get to office @ 8:45', points: 5, type: 'checkbox' },
];

// LocalStorage helpers
const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// Particle explosion component
function Explosion({ x, y, points, onComplete }) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const particleCount = Math.floor(points * 1.5);
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 2 + Math.random() * 3 + (points / 10);
      const size = 2 + Math.random() * 3;
      const opacity = 0.6 + Math.random() * 0.4;
      
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size,
        opacity,
        life: 1,
      });
    }
    
    setParticles(newParticles);
    
    const startTime = Date.now();
    const duration = 600 + points * 10;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        onComplete();
        return;
      }
      
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.15,
        life: 1 - progress,
        opacity: p.opacity * (1 - progress),
      })));
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [points, onComplete]);
  
  return (
    <div style={{
      position: 'fixed',
      left: x,
      top: y,
      pointerEvents: 'none',
      zIndex: 1000,
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `rgba(229, 229, 229, ${p.opacity})`,
            transform: `scale(${p.life})`,
          }}
        />
      ))}
    </div>
  );
}

// Year calendar component
function YearCalendar({ history }) {
  const pointsMap = {};
  history.forEach(day => {
    pointsMap[day.date] = day.points;
  });

  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  
  const days = [];
  const current = new Date(startOfYear);
  
  while (current <= endOfYear) {
    const dateStr = current.toLocaleDateString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric' 
    });
    days.push({
      date: new Date(current),
      dateStr,
      points: pointsMap[dateStr] || 0,
      isFuture: current > now,
    });
    current.setDate(current.getDate() + 1);
  }

  const weeks = [];
  let currentWeek = [];
  
  const firstDayOfWeek = startOfYear.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }
  
  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        marginBottom: '4px',
        marginLeft: '20px',
      }}>
        {months.map((month) => (
          <span key={month} style={{ 
            fontSize: '9px', 
            color: '#444',
            width: `${100/12}%`,
            textAlign: 'left',
          }}>
            {month}
          </span>
        ))}
      </div>
      
      <div style={{ 
        display: 'flex',
        gap: '2px',
        overflowX: 'auto',
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2px',
          marginRight: '4px',
          flexShrink: 0,
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} style={{ 
              fontSize: '8px', 
              color: '#444',
              height: '10px',
              display: 'flex',
              alignItems: 'center',
            }}>
              {i % 2 === 1 ? d : ''}
            </div>
          ))}
        </div>
        
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '2px',
          }}>
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                title={day ? `${day.dateStr}: ${day.points} pts` : ''}
                style={{
                  width: '10px',
                  height: '10px',
                  background: day 
                    ? day.isFuture 
                      ? '#1a1a1a'
                      : day.points > 0 
                        ? `rgba(59, 130, 246, ${Math.max(0.2, day.points / 100)})`
                        : '#1a1a1a'
                    : 'transparent',
                  borderRadius: '2px',
                  border: day && !day.isFuture && day.points === 0 ? '1px solid #222' : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginTop: '12px',
        justifyContent: 'flex-end',
      }}>
        <span style={{ fontSize: '9px', color: '#444' }}>Less</span>
        {[0, 25, 50, 75, 100].map(val => (
          <div
            key={val}
            style={{
              width: '10px',
              height: '10px',
              background: val === 0 ? '#1a1a1a' : `rgba(59, 130, 246, ${Math.max(0.2, val / 100)})`,
              borderRadius: '2px',
              border: val === 0 ? '1px solid #222' : 'none',
            }}
          />
        ))}
        <span style={{ fontSize: '9px', color: '#444' }}>More</span>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('today');
  const [tasks, setTasks] = useState(() => loadFromStorage('uvu-tasks', DEFAULT_TASKS));
  const [completedToday, setCompletedToday] = useState(() => {
    const saved = loadFromStorage('uvu-completed', []);
    return new Set(saved);
  });
  const [timedMinutes, setTimedMinutes] = useState(() => loadFromStorage('uvu-timed', {}));
  const [history, setHistory] = useState(() => loadFromStorage('uvu-history', []));
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(10);
  const [explosions, setExplosions] = useState([]);
  const [minuteInput, setMinuteInput] = useState({});
  const [lastSavedDate, setLastSavedDate] = useState(() => {
    return loadFromStorage('uvu-lastSaved', new Date().toDateString());
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage('uvu-tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('uvu-completed', Array.from(completedToday));
  }, [completedToday]);

  useEffect(() => {
    saveToStorage('uvu-timed', timedMinutes);
  }, [timedMinutes]);

  useEffect(() => {
    saveToStorage('uvu-history', history);
  }, [history]);

  useEffect(() => {
    saveToStorage('uvu-lastSaved', lastSavedDate);
  }, [lastSavedDate]);

  const totalAssignedPoints = tasks
    .filter(t => t.type !== 'timed')
    .reduce((sum, t) => sum + t.points, 0);
  
  const timedPoints = tasks
    .filter(t => t.type === 'timed')
    .reduce((sum, t) => sum + Math.floor((timedMinutes[t.id] || 0) * t.minuteRate), 0);
  
  const checkboxPoints = tasks
    .filter(t => t.type !== 'timed' && completedToday.has(t.id))
    .reduce((sum, t) => sum + t.points, 0);
  
  const todayPoints = checkboxPoints + timedPoints;

  const streak = history.reduce((s, day, i) => {
    if (i === 0 || s < i) {
      return day.points >= 70 ? s + 1 : s;
    }
    return s;
  }, 0);

  // Auto-save at midnight local time
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const today = now.toDateString();
      
      if (today !== lastSavedDate) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        });
        
        const dayData = {
          date: yesterdayStr,
          points: todayPoints,
          completed: Array.from(completedToday),
          timedMinutes: { ...timedMinutes },
        };
        
        setHistory(prev => [dayData, ...prev.slice(0, 364)]);
        setCompletedToday(new Set());
        setTimedMinutes({});
        setMinuteInput({});
        setLastSavedDate(today);
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, [lastSavedDate, todayPoints, completedToday, timedMinutes]);

  const triggerExplosion = useCallback((e, points) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const id = Date.now();
    setExplosions(prev => [...prev, { id, x, y, points }]);
  }, []);

  const removeExplosion = useCallback((id) => {
    setExplosions(prev => prev.filter(e => e.id !== id));
  }, []);

  const toggleTask = (taskId, e) => {
    const task = tasks.find(t => t.id === taskId);
    const wasCompleted = completedToday.has(taskId);
    
    setCompletedToday(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
    
    if (!wasCompleted && task) {
      triggerExplosion(e, task.points);
    }
  };

  const addTask = () => {
    if (!newTaskName.trim()) return;
    if (totalAssignedPoints + newTaskPoints > 100) return;
    setTasks([...tasks, {
      id: Date.now(),
      name: newTaskName.trim(),
      points: newTaskPoints,
      type: 'checkbox',
    }]);
    setNewTaskName('');
    setNewTaskPoints(10);
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setCompletedToday(prev => {
      const next = new Set(prev);
      next.delete(taskId);
      return next;
    });
  };

  const updateTaskPoints = (taskId, newPoints) => {
    const task = tasks.find(t => t.id === taskId);
    const otherPoints = totalAssignedPoints - task.points;
    if (otherPoints + newPoints > 100) return;
    setTasks(tasks.map(t => t.id === taskId ? { ...t, points: newPoints } : t));
  };

  const updateTaskName = (taskId, name) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, name } : t));
  };

  const saveDay = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const dayData = {
      date: today,
      points: todayPoints,
      completed: Array.from(completedToday),
      timedMinutes: { ...timedMinutes },
    };
    setHistory([dayData, ...history.slice(0, 364)]);
    setCompletedToday(new Set());
    setTimedMinutes({});
    setMinuteInput({});
  };

  const remainingPoints = 100 - totalAssignedPoints;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
      color: '#e5e5e5',
      padding: '0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        
        * { box-sizing: border-box; }
        
        ::selection {
          background: #333;
          color: #fff;
        }
        
        .nav-btn {
          background: transparent;
          border: none;
          padding: 12px 16px;
          font-family: inherit;
          font-size: 11px;
          color: #666;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: color 0.2s;
        }
        
        .nav-btn:hover { color: #999; }
        .nav-btn.active { color: #e5e5e5; }
        
        .input-field {
          background: transparent;
          border: none;
          border-bottom: 1px solid #333;
          padding: 12px 0;
          font-family: inherit;
          font-size: 14px;
          color: #e5e5e5;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .input-field:focus { border-color: #666; }
        .input-field::placeholder { color: #444; }
        
        .task-row {
          display: flex;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #1a1a1a;
          transition: background 0.2s;
        }
        
        .task-row:hover { background: #111; }
        
        .check-box {
          width: 20px;
          height: 20px;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          font-size: 12px;
        }
        
        .check-box.checked {
          background: #e5e5e5;
          border-color: #e5e5e5;
          color: #0a0a0a;
        }
        
        .btn {
          background: transparent;
          border: 1px solid #333;
          padding: 10px 20px;
          font-family: inherit;
          font-size: 11px;
          color: #999;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s;
        }
        
        .btn:hover {
          border-color: #666;
          color: #e5e5e5;
        }
        
        .btn-primary {
          background: #e5e5e5;
          border-color: #e5e5e5;
          color: #0a0a0a;
        }
        
        .btn-primary:hover {
          background: #fff;
          border-color: #fff;
        }
        
        .points-btn {
          width: 40px;
          height: 32px;
          background: transparent;
          border: 1px solid #222;
          font-family: inherit;
          font-size: 12px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .points-btn:hover { border-color: #444; color: #999; }
        .points-btn.selected { border-color: #666; color: #e5e5e5; background: #1a1a1a; }
        .points-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .history-bar {
          height: 4px;
          background: #1a1a1a;
          flex: 1;
          margin: 0 12px;
        }
        
        .history-bar-fill {
          height: 100%;
          background: #e5e5e5;
          transition: width 0.3s ease;
        }
      `}</style>

      {explosions.map(exp => (
        <Explosion
          key={exp.id}
          x={exp.x}
          y={exp.y}
          points={exp.points}
          onComplete={() => removeExplosion(exp.id)}
        />
      ))}

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{ marginRight: 'auto' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '0',
            letterSpacing: '-1px',
          }}>
            UvU
          </h1>
        </div>
        <div style={{ display: 'flex' }}>
          {['setup', 'today', 'history'].map(s => (
            <button
              key={s}
              className={`nav-btn ${screen === s ? 'active' : ''}`}
              onClick={() => setScreen(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 20px' }}>

        {screen === 'setup' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '24px',
              }}>
                <span style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Tasks
                </span>
                <span style={{ fontSize: '12px', color: remainingPoints < 0 ? '#ff6b6b' : '#444' }}>
                  {totalAssignedPoints}/100 pts assigned
                </span>
              </div>

              {tasks.map(task => (
                <div key={task.id} className="task-row">
                  {editingTask === task.id ? (
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => updateTaskName(task.id, e.target.value)}
                      onBlur={() => setEditingTask(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingTask(null)}
                      autoFocus
                      className="input-field"
                      style={{ flex: 1, marginRight: '16px' }}
                    />
                  ) : (
                    <span
                      onClick={() => setEditingTask(task.id)}
                      style={{ flex: 1, cursor: 'text', fontSize: '14px' }}
                    >
                      {task.name}
                      {task.type === 'timed' && <span style={{ color: '#444', marginLeft: '8px' }}>(timed)</span>}
                    </span>
                  )}
                  {task.type !== 'timed' && (
                    <div style={{ display: 'flex', gap: '4px', marginRight: '12px' }}>
                      {POINT_VALUES.map(val => {
                        const wouldExceed = totalAssignedPoints - task.points + val > 100;
                        return (
                          <button
                            key={val}
                            className={`points-btn ${task.points === val ? 'selected' : ''}`}
                            onClick={() => updateTaskPoints(task.id, val)}
                            disabled={wouldExceed && task.points !== val}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <button
                    onClick={() => removeTask(task.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#333',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      fontSize: '16px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Add task..."
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    className="input-field"
                  />
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {POINT_VALUES.map(val => (
                    <button
                      key={val}
                      className={`points-btn ${newTaskPoints === val ? 'selected' : ''}`}
                      onClick={() => setNewTaskPoints(val)}
                      disabled={remainingPoints < val}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
              {remainingPoints < newTaskPoints && newTaskName && (
                <p style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                  Only {remainingPoints} points remaining
                </p>
              )}
            </div>

            {tasks.length > 0 && totalAssignedPoints <= 100 && (
              <button className="btn" onClick={() => setScreen('today')}>
                Start tracking →
              </button>
            )}
          </div>
        )}

        {screen === 'today' && (
          <div>
            <div style={{ marginBottom: '48px' }}>
              <p style={{ fontSize: '12px', color: '#444', margin: '0 0 8px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Points today
              </p>
              <div style={{ fontSize: '64px', fontWeight: '700', lineHeight: 1 }}>
                {todayPoints}
              </div>
              <div style={{
                width: '100%',
                height: '2px',
                background: '#1a1a1a',
                marginTop: '16px',
              }}>
                <div style={{
                  width: `${Math.min(todayPoints, 100)}%`,
                  height: '100%',
                  background: '#e5e5e5',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '11px',
                color: '#444',
              }}>
                <span>0</span>
                <span>100</span>
              </div>
              {streak > 0 && (
                <p style={{ fontSize: '12px', color: '#666', marginTop: '16px' }}>
                  {streak} day streak
                </p>
              )}
            </div>

            <div style={{ marginBottom: '32px' }}>
              {tasks.map(task => {
                const isCompleted = completedToday.has(task.id);
                const isTimed = task.type === 'timed';
                const minutes = timedMinutes[task.id] || 0;
                const earnedPoints = isTimed ? Math.floor(minutes * task.minuteRate) : task.points;
                
                if (isTimed) {
                  return (
                    <div
                      key={task.id}
                      className="task-row"
                      style={{ cursor: 'default' }}
                    >
                      <span style={{
                        flex: 1,
                        fontSize: '14px',
                        opacity: minutes > 0 ? 0.6 : 1,
                      }}>
                        {task.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          placeholder="min"
                          value={minuteInput[task.id] || ''}
                          onChange={(e) => setMinuteInput(prev => ({ ...prev, [task.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const mins = parseInt(minuteInput[task.id]) || 0;
                              if (mins > 0) {
                                setTimedMinutes(prev => ({ ...prev, [task.id]: (prev[task.id] || 0) + mins }));
                                setMinuteInput(prev => ({ ...prev, [task.id]: '' }));
                                triggerExplosion(e, Math.floor(mins * task.minuteRate));
                              }
                            }
                          }}
                          className="input-field"
                          style={{ 
                            width: '60px', 
                            textAlign: 'center',
                            padding: '8px 4px',
                            fontSize: '12px',
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const mins = parseInt(minuteInput[task.id]) || 0;
                            if (mins > 0) {
                              setTimedMinutes(prev => ({ ...prev, [task.id]: (prev[task.id] || 0) + mins }));
                              setMinuteInput(prev => ({ ...prev, [task.id]: '' }));
                              triggerExplosion(e, Math.floor(mins * task.minuteRate));
                            }
                          }}
                          className="btn"
                          style={{ padding: '8px 12px', fontSize: '10px' }}
                        >
                          Add
                        </button>
                        <span style={{
                          fontSize: '12px',
                          color: minutes > 0 ? '#e5e5e5' : '#444',
                          minWidth: '70px',
                          textAlign: 'right',
                        }}>
                          {minutes > 0 ? `${minutes}m → +${earnedPoints}` : '1/6 pt/min'}
                        </span>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={task.id}
                    className="task-row"
                    onClick={(e) => toggleTask(task.id, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`check-box ${isCompleted ? 'checked' : ''}`}>
                      {isCompleted && '✓'}
                    </div>
                    <span style={{
                      flex: 1,
                      marginLeft: '16px',
                      fontSize: '14px',
                      opacity: isCompleted ? 0.4 : 1,
                      textDecoration: isCompleted ? 'line-through' : 'none',
                    }}>
                      {task.name}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: isCompleted ? '#666' : '#444',
                    }}>
                      +{task.points}
                    </span>
                  </div>
                );
              })}
            </div>

            <button className="btn-primary btn" onClick={saveDay}>
              Complete day
            </button>
          </div>
        )}

        {screen === 'history' && (
          <div>
            <p style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Most Recent Week
            </p>
            <div style={{ marginBottom: '40px' }}>
              {history.slice(0, 7).map((day, i) => (
                <div key={i} className="task-row" style={{ padding: '12px 0' }}>
                  <span style={{ fontSize: '12px', color: '#666', width: '100px', flexShrink: 0 }}>
                    {day.date}
                  </span>
                  <div className="history-bar">
                    <div 
                      className="history-bar-fill" 
                      style={{ width: `${day.points}%` }} 
                    />
                  </div>
                  <span style={{ fontSize: '14px', width: '36px', textAlign: 'right' }}>
                    {day.points}
                  </span>
                </div>
              ))}
              {history.length === 0 && (
                <p style={{ color: '#444', fontSize: '14px' }}>No completed days yet.</p>
              )}
            </div>
            
            <p style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Year Overview
            </p>
            <div style={{ marginBottom: '40px' }}>
              <YearCalendar history={history} />
            </div>
            
            {history.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #1a1a1a',
                fontSize: '12px',
              }}>
                <div>
                  <div style={{ color: '#444', marginBottom: '4px' }}>Days</div>
                  <div>{history.length}</div>
                </div>
                <div>
                  <div style={{ color: '#444', marginBottom: '4px' }}>Total</div>
                  <div>{history.reduce((s, d) => s + d.points, 0)}</div>
                </div>
                <div>
                  <div style={{ color: '#444', marginBottom: '4px' }}>Avg</div>
                  <div>{Math.round(history.reduce((s, d) => s + d.points, 0) / history.length)}</div>
                </div>
                <div>
                  <div style={{ color: '#444', marginBottom: '4px' }}>Best</div>
                  <div>{Math.max(...history.map(d => d.points))}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
