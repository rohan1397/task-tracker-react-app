import "./App.css";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import { Route, BrowserRouter as Router } from "react-router-dom";
import About from "./components/About";

function App() {
	const [showAddTask, setShowAddTask] = useState(false);
	const [tasks, setTasks] = useState([]);
	useEffect(() => {
		const getTasks = async () => {
			const tasksFromServer = await fecthTasks();
			setTasks(tasksFromServer);
		};
		getTasks();
	}, []);

	// fetchTask
	const fecthTasks = async () => {
		const res = await fetch("http://localhost:5000/tasks");
		const data = await res.json();
		return data;
		// setTasks(data);
	};
	// Add Task
	const addTask = async (task) => {
		const res = await fetch("http://localhost:5000/tasks", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(task),
		});

		const data = await res.json();

		setTasks([...tasks, data]);

		// const id = Math.floor(Math.random() * 10000) + 1
		// const newTask = { id, ...task }
		// setTasks([...tasks, newTask])
	};

	//Delete Task

	const deleteTask = async (id) => {
		await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
		setTasks(tasks.filter((task) => task.id !== id));
	};
	const fecthTask = async (id) => {
		const res = await fetch(`http://localhost:5000/tasks/${id}`);
		const data = await res.json();

		return data;
	};
	//toggle Reminder
	const toogleReminder = async (id) => {
		const taskToToggle = await fecthTask(id);
		const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
		const res = await fetch(`http://localhost:5000/tasks/${id}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(updTask),
		});

		const data = await res.json();

		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, reminder: !task.reminder } : task
			)
		);
	};
	return (
		<Router>
			<div className="container">
				<Header
					onAdd={() => setShowAddTask(!showAddTask)}
					showAddTask={showAddTask}
				/>

				<Route
					path="/"
					exact
					render={(props) => (
						<>
							{showAddTask && <AddTask onAdd={addTask} />}
							{tasks.length > 0 ? (
								<Tasks
									tasks={tasks}
									onDelete={deleteTask}
									onToggle={toogleReminder}
								/>
							) : (
								"No Tasks"
							)}
						</>
					)}
				/>
				<Route path="/about" component={About} />
				<Footer />
			</div>
		</Router>
	);
}

export default App;
