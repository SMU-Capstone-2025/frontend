import { useState } from "react";

export const useTaskColumn = (initialTasks = []) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newTaskObj = {
      id: tasks.length + 1,
      title: newTask,
      date: new Date().toISOString().split("T")[0],
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
    setIsModalOpen(false);
  };

  return {
    tasks,
    setTasks,
    newTask,
    setNewTask,
    isModalOpen,
    setIsModalOpen,
    handleAddTask,
  };
};
