import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
function App() {
  const { activityStore } = useStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSumbitting] = useState(false);

  useEffect(() => {
    activityStore.loadingActivities();
  }, [activityStore]);

  function handleCreateOrEditActicity(activity: Activity) {
    setSumbitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSumbitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSumbitting(false);
      });
    }
  }

  function handleDeleteActivity(id: string) {
    setSumbitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter((x) => x.id !== id)]);
      setSumbitting(false);
    });
  }

  //Load section
  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading app" />;

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activityStore.activities}
          createOrEdit={handleCreateOrEditActicity}
          deleteActivity={handleDeleteActivity}
          sumbitting={submitting}
        />
      </Container>
    </div>
  );
}

export default observer(App);
