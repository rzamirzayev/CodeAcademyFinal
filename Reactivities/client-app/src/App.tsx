import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/activities").then((response) => {
      setActivities(response.data);
    });
  }, []);
  return (
    <div>
      <ul>
        {activities.map((activity: any) => (
          <li key={activity.id}>{activity.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
