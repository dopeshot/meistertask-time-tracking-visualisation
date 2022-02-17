import { TimeLineChart } from "./components/TimeLineChart";
import { useState } from "react";
import { handleFileUpload } from "./logic/handle-upload";
function App() {
  const [data, setData] = useState([]);
  const [totalTime, setTotalTime] = useState(0)
  const [timePerPerson, setTimePerPerson] = useState([])
  const [totalProjectTime, setTotalProjectTime] = useState(0)

  return <>
    <input
      type="file"
      accept=".csv"
      onChange={(event) => handleFileUpload(event,setData,setTotalTime,setTimePerPerson,setTotalProjectTime)}
    />
    <h2>[{totalProjectTime.toFixed(2)}] Days since project start.</h2>
    <h2>[{totalTime.toFixed(2)}] Hours of work.</h2>
    <ul>
    {timePerPerson.map((data) => <>
      <li>{data.hours.toFixed(2)} = {data.name}</li>
    </>)}
    </ul>
    {data.length > 0 && <TimeLineChart data={data} />}
    <h4>Version 0.2</h4>
  </>
}

export default App;