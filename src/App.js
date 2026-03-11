import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  // use environment variable or default to relative path so proxy works
  const API_URL = process.env.REACT_APP_API_URL || "/api";

  // Wrap getTodos in useCallback so it's stable across renders
  const getTodos = useCallback(async () => {
    const res = await axios.get(`${API_URL}/todos`);
    setTodos(res.data);
  }, [API_URL]);

  useEffect(() => {
    getTodos();
  }, [getTodos]); // safe now

  const handleAddOrUpdate = async () => {
    if (!task.trim()) return;
    if (editId) {
      await axios.put(`${API_URL}/todos/${editId}`, { task });
      setEditId(null);
    } else {
      await axios.post(`${API_URL}/todos`, { task });
    }
    setTask("");
    getTodos();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    getTodos();
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setEditId(todo._id);
  };

  return (
    <div className="app-container">
      <h1>Todo List</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>{editId ? "Update" : "Add"}</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id}>
            <span>{todo.task}</span>
            <div className="btn-group">
              <button className="edit" onClick={() => handleEdit(todo)}>
                Edit
              </button>
              <button className="delete" onClick={() => handleDelete(todo._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
