
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";

const API_URL = "http://10.146.163.42:5000/api";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check logged-in user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Get tasks after login
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // GET TASKS
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to get tasks");
        return;
      }

      setTasks(data.tasks || []);
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // ADD TASK
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a task title");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create task");
        return;
      }

      setTasks((prevTasks) => [data.task, ...prevTasks]);

      setTitle("");
      setDescription("");
      setShowForm(false);
      setMessage("Task created successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to backend");
    }
  };

  // COMPLETE / PENDING
  const handleCompleteTask = async (task) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status:
            task.status === "completed"
              ? "pending"
              : "completed",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update task");
        return;
      }

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item._id === task._id ? data.task : item
        )
      );
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to backend");
    }
  };

  // DELETE TASK
  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete task");
        return;
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );

      setMessage("Task deleted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to backend");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setTasks([]);
    setMessage("");
  };

  // LOGIN PAGE
  if (!user) {
    return (
      <Login
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
        }}
      />
    );
  }

  // DASHBOARD
  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>MyTask</h1>
          <p>
            Organize your work. Achieve your goals.
          </p>
        </div>

        <div className="user-section">
          <span>
            Welcome back, {user.name}! 👋
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="dashboard-content">

        <div className="tasks-header">
          <div>
            <h2>My Tasks</h2>
            <p>
              Manage your tasks and track your progress.
            </p>
          </div>

          <button
            className="add-task-button"
            onClick={() => {
              setShowForm(!showForm);
              setMessage("");
            }}
          >
            + Add Task
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {/* ADD TASK FORM */}
        {showForm && (
          <div className="task-form-card">
            <h3>Create New Task</h3>

            <form onSubmit={handleAddTask}>

              <label>Task title</label>

              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <label>Description</label>

              <textarea
                placeholder="Enter task description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <div className="form-buttons">

                <button type="submit">
                  Create Task
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setTitle("");
                    setDescription("");
                  }}
                >
                  Cancel
                </button>

              </div>
            </form>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="empty-state">
            <h3>Loading tasks...</h3>
          </div>
        )}

        {/* NO TASKS */}
        {!loading && tasks.length === 0 && (
          <div className="empty-state">

            <div className="empty-icon">
              ✓
            </div>

            <h2>No tasks yet</h2>

            <p>
              Create your first task and start
              getting things done.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="add-task-button"
            >
              + Create your first task
            </button>

          </div>
        )}

        {/* TASK LIST */}
        {!loading && tasks.length > 0 && (
          <div className="task-list">

            {tasks.map((task) => (
              <div
                className={`task-card ${
                  task.status === "completed"
                    ? "completed"
                    : ""
                }`}
                key={task._id}
              >

                <div className="task-info">

                  <h3>{task.title}</h3>

                  <p>
                    {task.description ||
                      "No description"}
                  </p>

                  <span
                    className={`status ${task.status}`}
                  >
                    {task.status}
                  </span>

                </div>

                <div className="task-actions">

                  <button
                    onClick={() =>
                      handleCompleteTask(task)
                    }
                  >
                    {task.status === "completed"
                      ? "Mark Pending"
                      : "Complete"}
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteTask(task._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default App;
