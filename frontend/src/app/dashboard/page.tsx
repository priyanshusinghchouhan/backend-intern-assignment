'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  user: { username: string };
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editing, setEditing] = useState<number | null>(null);
  const [editTask, setEditTask] = useState({ title: '', description: '', status: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState<{ username: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token) {
      router.push('/login');
      return;
    }
    if (user) {
      setUserInfo(JSON.parse(user));
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err: any) {
      setError('Failed to fetch tasks');
    }
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', description: '' });
      setSuccess('Task created');
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await api.put(`/tasks/${id}`, editTask);
      setEditing(null);
      setSuccess('Task updated');
      fetchTasks();
    } catch (err: any) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setSuccess('Task deleted');
      fetchTasks();
    } catch (err: any) {
      setError('Failed to delete task');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {userInfo && (
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{userInfo.username}</p>
                  <p className={`text-xs font-bold uppercase ${
                    userInfo.role === 'admin' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {userInfo.role}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  userInfo.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {userInfo.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors">Logout</button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-xl mb-2">Create Task</h2>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 border mb-2"
            required
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-2 border mb-2"
          />
          <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Create</button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks yet. Create one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-indigo-200 shadow-md hover:shadow-lg transition-shadow p-4">
                  {editing === task.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTask.title}
                        onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                        className="w-full p-2 border-2 border-indigo-300 rounded focus:outline-none focus:border-indigo-500"
                      />
                      <textarea
                        value={editTask.description}
                        onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                        className="w-full p-2 border-2 border-indigo-300 rounded focus:outline-none focus:border-indigo-500"
                      />
                      <select
                        value={editTask.status}
                        onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                        className="w-full p-2 border-2 border-indigo-300 rounded focus:outline-none focus:border-indigo-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(task.id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-semibold transition-colors">Save</button>
                        <button onClick={() => setEditing(null)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded font-semibold transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{task.title}</h3>
                        <p className="text-gray-600 text-sm">{task.description || 'No description'}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-500">{task.user.username}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => { 
                            setEditing(task.id); 
                            setEditTask({ title: task.title, description: task.description, status: task.status }); 
                          }} 
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)} 
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}