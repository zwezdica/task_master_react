import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import TaskForm from "./TaskForm";
import "../styles/TaskList.css";

const TaskList = ({ showWelcome = true }) => {
  const { user, tasks = [], setTasks, isLoading } = useContext(AuthContext);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const addTask = (task) => {
    if (editingTask !== null) {
      const updatedTasks = tasks.map((t) =>
        t.id === editingTask.id ? task : t
      );
      setTasks(updatedTasks);
      setEditingTask(null);
    } else {
      setTasks([
        ...tasks,
        {
          ...task,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
    setShowForm(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="task-list">
      {showWelcome && <h1>Welcome, {user.name}!</h1>}

      <div className="task-list-header">
        <h2>Task List</h2>
        <button
          className="add-task-button"
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
        >
          + Add New Task
        </button>
      </div>

      {(showForm || editingTask) && (
        <TaskForm
          onSubmit={addTask}
          taskToEdit={editingTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {tasks.length === 0 ? (
        <p>No tasks. Add a new task.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <small>Created: {formatDate(task.createdAt)}</small>
                  {task.updatedAt !== task.createdAt && (
                    <>
                      <br />
                      <small>Updated: {formatDate(task.updatedAt)}</small>
                    </>
                  )}
                </div>
                <div className="task-status">
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskStatus(task.id)}
                    />
                    <span
                      className={`status-label ${
                        task.completed ? "completed" : "in-progress"
                      }`}
                    >
                      {task.completed ? "✓ Completed" : "⌛ In Progress"}
                    </span>
                  </label>
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
