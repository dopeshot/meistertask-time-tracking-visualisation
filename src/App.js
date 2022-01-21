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
    <h2>Total time in hours: {totalTime}</h2>
    <h2>Total project time in days: {totalProjectTime}</h2>
    <ul>
    {timePerPerson.map((data) => <>
      <li>{data.hours} = {data.name}</li>
    </>)}
    </ul>
    {data.length > 0 && <TimeLineChart data={data} />}
  </>
}

export default App;