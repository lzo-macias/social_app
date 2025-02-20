import React, { useEffect, useState } from "react";

import axios from "axios";

function App() {
  const [widgets, setWidgets] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/widgets`)
      .then((data) => {
        console.log(data.data);
        setWidgets(data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <h1>Welcome to Wonderful Widgets!</h1>
      {widgets.map((widget) => (
        <p key={widget.id}>{widget.name}</p>
      ))}
    </>
  );
}

export default App;
