import { useState, useEffect } from 'react';
import styles from './styles/app.module.scss';
import { BsTrash2Fill } from 'react-icons/bs';

const API_BASE = 'http://localhost:3001';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<
    {
      complete: boolean;
      _id: string;
      text: string;
    }[]
  >([]);
  const [showInsertTodo, setShowInsertTodo] = useState<boolean>(false);
  useEffect(() => {
    getTodos();
  }, [todos]);
  const saveTodo = async () => {
    const data = await fetch(API_BASE + '/saveTodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: todo,
      }),
    }).then((res) => res.json());
    setTodos([...todos, data]);
    setShowInsertTodo(false);
    setTodo('');
  };

  const getTodos = () => {
    fetch(API_BASE + '/fetchTodos')
      .then((res) => {
        if (!res.ok) {
          throw new Error('todos could not be fetched');
        }
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => console.error('Error:', err));
  };

  const deleteTodo = async (id: string) => {
    const data = await fetch(API_BASE + '/deleteTodo/' + id, {
      method: 'DELETE',
    }).then((res) => res.json());
    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };
  const completeTodo = async (id: string) => {
    const data = await fetch(API_BASE + '/todoComplete/' + id).then((res) =>
      res.json()
    );
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const closeInsertTodo = () => {
    setShowInsertTodo(!showInsertTodo);
  };

  return (
    <>
      <h2 className={styles.todo_header}>insert a todo</h2>
      <div className={styles.container}>
        {todos.map((todo, index) => (
          <div key={index} className={styles.todos_container}>
            <div className={styles.todo}>
              <div
                className={`${styles.completed} ${
                  todo.complete ? styles.is_complete : ''
                }`}
                onClick={() => completeTodo(todo._id)}
              ></div>
              {todo.text}
              <BsTrash2Fill
                className={styles.trash_bin}
                onClick={() => deleteTodo(todo._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {showInsertTodo && (
        <div className={styles.container_insert_todo}>
          <input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className={styles.insert_todo}
            type='text'
            placeholder='add todo'
          />
          <button onClick={saveTodo} className={styles.add_todo_btn}>
            add todo
          </button>
        </div>
      )}

      <button onClick={closeInsertTodo} className={styles.showInsertTodo}>
        X
      </button>
    </>
  );
}

export default App;
