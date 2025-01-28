import React, { useState, useEffect } from "react";
import { format } from "date-fns"; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const API_BASE_URL = "http://localhost:7000/api";

const Todo = () => {
  const token = localStorage.getItem("token");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "normal",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Todos
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(""); // Reset error state
      try {
        const res = await fetch(`${API_BASE_URL}/todos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch todos.");
        const data = await res.json();
        setTodos(data);  // Set the todos from the response
      } catch (err) {
        setError("Error fetching todos: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token]);

  // Handle Input Change
  const handleChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  // Add New Todo
  const addTodo = async () => {
    if (!newTodo.title) {
      alert("Title is required!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });
      if (!res.ok) throw new Error("Error adding todo.");
      const data = await res.json();
      
      // Add the new todo to the todos list
      setTodos([...todos, { ...newTodo, _id: data._id, status: false }]);
      setNewTodo({ title: "", description: "", deadline: "", priority: "normal" });

      // Success message after adding the task
      setSuccessMessage("Task added successfully!");
      setTimeout(() => setSuccessMessage(""), 3500); // Clear success message after 3.5 seconds
    } catch (err) {
      setError("Error adding todo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Todo Status
  const toggleStatus = async (id, status) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/todos/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: !status }),
      });
      setTodos(todos.map(todo => todo._id === id ? { ...todo, status: !status } : todo));
    } catch (err) {
      setError("Error updating status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit Todo
  const editTodo = async (id, updatedFields) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      setTodos(todos.map(todo => todo._id === id ? { ...todo, ...updatedFields } : todo));
    } catch (err) {
      setError("Error updating todo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError("Error deleting todo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Styling Object
  const styles = {
    container: { padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f9", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", maxWidth: "600px", margin: "0 auto" },
    header: { textAlign: "center", marginBottom: "20px", color: "black" },
    form: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
    input: { padding: "10px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" },
    button: { padding: "10px 20px", backgroundColor: "#007BFF", color: "Black", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    buttonDisabled: { backgroundColor: "#cccccc", cursor: "not-allowed" },
    todoList: { listStyleType: "none", padding: "0" },
    todoItem: { 
      backgroundColor: "blue",  
      padding: "15px", 
      marginBottom: "10px", 
      borderRadius: "8px", 
      boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)" 
    },
    
    todoActions: { display: "flex", gap: "10px", marginTop: "10px" },
    error: { color: "red", textAlign: "center", marginBottom: "20px" },
    success: { color: "green", textAlign: "center", marginBottom: "20px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Todo List</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {/* Add Todo Form */}
      <div style={styles.form}>
        <input type="text" name="title" value={newTodo.title} onChange={handleChange} placeholder="Title" required style={styles.input} />
        <input type="text" name="description" value={newTodo.description} onChange={handleChange} placeholder="Description" style={styles.input} />
        <input type="date" name="deadline" value={newTodo.deadline} onChange={handleChange} style={styles.input} />
        <select name="priority" value={newTodo.priority} onChange={handleChange} style={styles.input}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <button onClick={addTodo} disabled={loading} style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}>Add Todo</button>
      </div>

      {/* Todo List */}
      <ul style={styles.todoList}>
        {todos.length === 0 ? (
          <li>No todos available. Please add some!</li>
        ) : (
          todos.map(todo => (
            <li key={todo._id} style={styles.todoItem}>
              <strong>{todo.title}</strong> - {todo.description} - {todo.priority} - {todo.deadline ? format(new Date(todo.deadline), "MMM dd, yyyy") : "No deadline"}
              <div style={styles.todoActions}>
                <button onClick={() => toggleStatus(todo._id, todo.status)}>{todo.status ? "Mark Incomplete" : "Mark Complete"}</button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                <button onClick={() => editTodo(todo._id, { title: "Updated Title" })}>Edit</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Todo;
