import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const clearForm = () => {
    setTitle("");
    setSubject("");
    setDueDate("");
    setPriority("");
    setStatus("");
    setDescription("");
    setEditId(null);
  };

  const openAddForm = () => {
    clearForm();
    setShowForm(true);
  };

  const closeForm = () => {
    clearForm();
    setShowForm(false);
  };

  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    if (!subject.trim()) {
      alert("Please enter subject");
      return;
    }

    if (!dueDate) {
      alert("Please select due date");
      return;
    }

    if (!priority) {
      alert("Please select priority");
      return;
    }

    if (!status) {
      alert("Please select status");
      return;
    }

    const newTask = {
      title: title.trim(),
      subject: subject.trim(),
      dueDate,
      priority,
      status,
      description: description.trim(),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        throw new Error("Failed to add task");
      }

      const savedTask = await res.json();

      setTasks((prev) => [...prev, savedTask]);
      closeForm();
    } catch (error) {
      console.error(error);
      alert("Failed to add task");
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setSubject(task.subject);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
    setDescription(task.description || "");

    setEditId(task._id);
    setShowForm(true);
  };

  const updateTask = async () => {
    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    if (!subject.trim()) {
      alert("Please enter subject");
      return;
    }

    if (!dueDate) {
      alert("Please select due date");
      return;
    }

    if (!priority) {
      alert("Please select priority");
      return;
    }

    if (!status) {
      alert("Please select status");
      return;
    }

    const updatedTask = {
      title: title.trim(),
      subject: subject.trim(),
      dueDate,
      priority,
      status,
      description: description.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      const savedTask = await res.json();

      setTasks((prev) =>
        prev.map((task) =>
          task._id === editId ? savedTask : task
        )
      );

      closeForm();
    } catch (error) {
      console.error(error);
      alert("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const text = search.toLowerCase().trim();

      const taskTitle = task.title?.toLowerCase() || "";
      const taskSubject = task.subject?.toLowerCase() || "";

      const matchesSearch =
        taskTitle.includes(text) ||
        taskSubject.includes(text);

      const matchesStatus =
        filterStatus === "All" ||
        task.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, filterStatus]);

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityClass = (value) => {
    if (value === "High") return "priority-high";
    if (value === "Medium") return "priority-medium";
    return "priority-low";
  };

  const getStatusClass = (value) => {
    return value?.toLowerCase().replace(" ", "-");
  };

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <div className="brand">
            <div className="brand-icon">◈</div>

            <div>
              <h1>Campus Planner</h1>
              <p>
                Organize your academic life with clarity.
              </p>
            </div>
          </div>

          <button
            className="add-task-button"
            onClick={openAddForm}
          >
            <span>＋</span>
            Add Study Task
          </button>
        </header>

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple">◫</div>

            <div>
              <p>Total Tasks</p>
              <h2>{totalTasks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>

            <div>
              <p>Pending</p>
              <h2>{pendingTasks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>

            <div>
              <p>Completed</p>
              <h2>{completedTasks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">↗</div>

            <div>
              <p>Progress</p>
              <h2>{progress}%</h2>
            </div>
          </div>

        </section>

        <section className="progress-card">
          <div className="progress-header">
            <div>
              <span>OVERALL PROGRESS</span>
              <h3>Keep moving forward</h3>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* MODAL */}

        {showForm && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeForm();
              }
            }}
          >
            <div className="modal">

              <div className="modal-header">

                <div>
                  <span className="section-label">
                    {editId ? "UPDATE TASK" : "NEW TASK"}
                  </span>

                  <h2>
                    {editId
                      ? "Edit your study task"
                      : "Create a study task"}
                  </h2>

                  <p>
                    Add the details of your academic task.
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={closeForm}
                >
                  ×
                </button>

              </div>

              <div className="form-grid">

                <div className="field">
                  <label>Task Title</label>

                  <input
                    type="text"
                    placeholder="e.g. Complete React Assignment"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Subject</label>

                  <input
                    type="text"
                    placeholder="e.g. Web Development"
                    value={subject}
                    onChange={(e) =>
                      setSubject(e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Due Date</label>

                  <input
                    className="date-input"
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Priority</label>

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value)
                    }
                  >
                    <option value="">
                      Select priority
                    </option>

                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="field">
                  <label>Status</label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value)
                    }
                  >
                    <option value="">
                      Select status
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div className="field full">
                  <label>Description</label>

                  <textarea
                    rows="4"
                    placeholder="Add a short description..."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                  />
                </div>

              </div>

              <div className="form-buttons">

                <button
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  className="save-button"
                  onClick={
                    editId ? updateTask : addTask
                  }
                >
                  {editId
                    ? "Update Task"
                    : "Create Task"}
                </button>

              </div>

            </div>
          </div>
        )}

        <section className="tasks-section">

          <div className="section-header">
            <div>
              <span className="section-label">
                YOUR WORKSPACE
              </span>

              <h2>My Study Tasks</h2>

              <p>
                Stay on top of your assignments and
                deadlines.
              </p>
            </div>

            <div className="task-count">
              {filteredTasks.length} tasks
            </div>
          </div>

          <div className="toolbar">

            <div className="search-wrapper">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search tasks or subjects..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <select
              className="filter"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">
                Completed
              </option>
            </select>

          </div>

          {filteredTasks.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">◫</div>

              <h3>No study tasks found</h3>

              <p>
                Add your first study task to get
                started.
              </p>

              <button
                className="empty-button"
                onClick={openAddForm}
              >
                Create your first task
              </button>

            </div>

          ) : (

            <div className="tasks-grid">

              {filteredTasks.map((task) => (

                <article
                  className="task-card"
                  key={task._id}
                >

                  <div className="task-card-top">

                    <div>
                      <span
                        className={`priority-badge ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                      <h3>{task.title}</h3>

                      <p className="subject">
                        {task.subject}
                      </p>
                    </div>

                  </div>

                  <div className="task-details">

                    <div>
                      <span>Due Date</span>

                      <strong>
                        {formatDate(task.dueDate)}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>

                      <strong
                        className={`status ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </strong>
                    </div>

                  </div>

                  {task.description && (
                    <p className="description">
                      {task.description}
                    </p>
                  )}

                  <div className="task-footer">

                    <button
                      className="edit-button"
                      onClick={() =>
                        editTask(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTask(task._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

        <footer>
          <span>Campus Planner</span>
          <span>Built for smarter studying</span>
        </footer>

      </div>
    </div>
  );
}

export default App;