// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file
import { SignOutButton, SignInButton, SignedOut, SignedIn } from "@clerk/clerk-react"



function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:3001/api/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    await axios.post('http://localhost:3001/api/todos', {
      task,
      completed: false,
    });
    fetchTodos();
    setTask('');
  };

 // src/App.js
 const toggleTodo = async (id) => {
  try {
    await axios.put(`http://localhost:3001/api/todos/${id}`, { completed: true });
    fetchTodos(); // Refresh the todos after updating
  } catch (error) {
    console.error('Error marking todo as done:', error);
  }
};


  // src/App.js
const deleteTodo = async (id) => {
  try {
    await axios.delete(`http://localhost:3001/api/todos/${id}`);
    fetchTodos(); // Refresh the todos after deletion
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

return (
  <div>
  <SignedIn>

  <div className="app-container">
    <h1>To-Do List</h1>
    {todos.length === 0 ? (
      <p>No task due</p>
    ) : (
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <span>{todo.task}</span>
            {!todo.completed && (
              <button onClick={() => toggleTodo(todo._id)}>
                Mark as Done
              </button>
            )}
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    )}
    <div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTodo}>Add To-do List</button>
    </div>
    <SignOutButton />
  </div>
  </SignedIn>
  <SignedOut>
    <SignInButton />
  </SignedOut>
  </div>
);
}

export default App;
