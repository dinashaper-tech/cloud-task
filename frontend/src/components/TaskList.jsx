import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await taskAPI.getAll(params);
      setTasks(data.data.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        
        <div className="flex gap-2">
          {['all', 'todo', 'in_progress', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg ${
                filter === status ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tasks found</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}