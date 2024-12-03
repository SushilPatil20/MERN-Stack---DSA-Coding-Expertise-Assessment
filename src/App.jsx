import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editing, setEditing] = useState([]);
  const [editedTodo, setEdittedTodo] = useState("");

  const getAllTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/todo/get");
      const todos = await response.data.todos;
      if (todos) {
        setTodos(todos);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addTodo = async () => {
    if (!todo) return;
    try {
      await axios.post("http://localhost:5000/api/todo/create", { todo });
      setTodo("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteTodo = async (todoId) => {
    if (!todoId) return;
    try {
      const todo = await axios.delete(
        `http://localhost:5000/api/todo/delete/${todoId}`
      );
      if (todo.status === 200) getAllTodos();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSave = async (todoId) => {
    try {
      await axios.put(`http://localhost:5000/api/todo/update/${todoId}`, {
        todo: editedTodo,
      });
      setEdittedTodo("");
      setEditing(false);
      getAllTodos();
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleEditClick = (index) => {
    setEditing((prevState) =>
      prevState.map((visible, idx) => (idx === index ? !visible : visible))
    );
  };

  useEffect(() => {
    if (todos.length > 0) {
      const initialVisibility = todos.map(() => false);
      setEditing(initialVisibility);
    }
  }, [todos]);

  useEffect(() => {
    getAllTodos();
  }, [todo]);

  return (
    <div className="todoContainer">
      <section className="formElement">
        <label htmlFor="todo" className="label">
          Enter Todo
        </label>
        <div className="inputSection">
          <input
            onChange={(e) => setTodo(e.target.value)}
            type="text"
            id="todo"
            value={todo}
            className="input"
          />
          <button className="button" onClick={() => addTodo()}>
            Add Todo
          </button>
        </div>
      </section>

      <section className="displayAllTodos">
        {todos.length > 0 &&
          todos.map((todo, index) =>
            editing[index] ? (
              <div key={todo.todo} className="todo">
                <input
                  type="text"
                  onChange={(e) => setEdittedTodo(e.target.value)}
                  value={editedTodo || todo.todo}
                  className="input"
                />
                <button onClick={() => handleSave(todo._id)} className="save">
                  save
                </button>
                <button
                  className="cancel"
                  onClick={() => toggleEditClick(index)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div key={todo._id} className="todo">
                <span>{todo.todo}</span>
                <div className="todoRightSide">
                  <button
                    className="edit"
                    onClick={() => toggleEditClick(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
      </section>
    </div>
  );
};

export default App;
