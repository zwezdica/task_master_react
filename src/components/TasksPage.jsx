import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import TaskList from "./TaskList";
import "../styles/TasksPage.css";

const TasksPage = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="tasks-page">
      <div>
        <TaskList showWelcome={false} />
      </div>
    </div>
  );
};

export default TasksPage;
