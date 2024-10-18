import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./Todo.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Todo = () => {
  const [todoData, setTodoData] = useState({
    id: null,
    title: "",
    body: "",
  });
  const [array, setArray] = useState(() => []);
  const [isEditing, setIsEditing] = useState(null);
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:1000/api/v2/getTasks/${userId}`
        );

        if (response.data.tasks) {
          const sortedTasks = response.data.tasks.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setArray(sortedTasks);
        } else {
          toast.info(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("An error occurred while fetching tasks.");
      }
    };

    fetchTasks();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData({ ...todoData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !email) {
      toast.error("Please log in to add a task!");
      return;
    }

    try {
      if (isEditing !== null) {
        const todoToUpdate = array.find((item) => item.id === todoData.id);

        if (todoToUpdate.userId !== userId) {
          toast.error("You're not allowed to update this task!");
          return;
        }

        await axios.put(
          `http://localhost:1000/api/v2/updateTask/${todoData.id}`,
          {
            title: todoData.title,
            body: todoData.body,
            email: email,
            userId: userId,
          }
        );

        const updatedArray = array.map((item) =>
          item.id === todoData.id ? { ...todoData, id: todoData.id } : item
        );
        setArray(updatedArray);
        setIsEditing(null);
        toast.success("Task updated successfully!");
      } else {
        // Add a new task
        const response = await axios.post(
          `http://localhost:1000/api/v2/addTask`,
          {
            title: todoData.title,
            body: todoData.body,
            email: email,
            userId: userId,
            createdAt: new Date().toISOString(), // Add timestamp here
          }
        );

        if (response.data.list) {
          const newTodo = {
            ...todoData,
            id: response.data.list._id,
            userId: userId,
            createdAt: new Date().toISOString(), // Add timestamp here as well
          };
          setArray((prevArray) => [...prevArray, newTodo]);
          toast.success("Task added successfully!");
        }
      }
    } catch (error) {
      console.error("Error during task operation:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while processing your request."
      );
    }

    // Clear form after submission
    setTodoData({ id: null, title: "", body: "" });
  };

  const handleEdit = (id) => {
    const todoToEdit = array.find((item) => item.id === id);
    setTodoData(todoToEdit);
    setIsEditing(id);
  };

  const handleDelete = async (id) => {
    console.log("userId", userId);

    if (!userId) {
      toast.error("Please log in to delete a task!");
      return;
    }

    try {
      const todoToDelete = array.find((item) => item.id === id);

      // Ensure todoToDelete has a userId
      if (!todoToDelete || todoToDelete.userId !== userId) {
        toast.error("You're not allowed to delete this task!");
        return;
      }

      // Proceed to delete the task
      await axios.delete(`http://localhost:1000/api/v2/deleteTask/${id}`, {
        data: { email: email },
      });

      const updatedArray = array.filter((item) => item.id !== id);
      setArray(updatedArray);
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error during task deletion:", error);
      toast.error("An error occurred while deleting the task.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Add Todo</h2>
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="title"
            value={todoData.title}
            onChange={handleChange}
            placeholder="Click to enter title"
            required
          />
        </div>

        <div className="mb-3 fade-in">
          <textarea
            className="form-control"
            name="body"
            value={todoData.body}
            onChange={handleChange}
            rows="4"
            placeholder="Enter your todo details"
            required
          />
        </div>

        <div className="text-end">
          <button
            type="submit"
            style={{ backgroundColor: "brown", color: "white" }}
            className="btn"
          >
            {isEditing !== null ? "Update Todo" : "Add Todo"}
          </button>
        </div>
      </form>

      <div className="mt-4">
        {array.length === 0 ? (
          <p className="text-center">No tasks available.</p>
        ) : (
          <div className="todo-cards">
            {array.map((todo) => (
              <div key={todo.id} className="todo-card">
                <h4>{todo.title}</h4>
                <p>{todo.body}</p>
                <div>
                  <button
                    className="btn me-2"
                    onClick={() => handleEdit(todo.id)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    style={{ color: "brown" }}
                    className="btn ms-5"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Todo;
