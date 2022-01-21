import { TimeLineChart } from "./components/TimeLineChart";
import { useState } from "react";
import * as XLSX from 'xlsx';
function App() {
  const [data, setData] = useState([]);
  const [totalTime, setTotalTime] = useState(0)
  const [timePerPerson, setTimePerPerson] = useState([])
  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
 
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
 
        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
 
    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));
    console.log(list)
    list.sort((a, b) => new Date(a.Date) - new Date(b.Date))
    setData(list);
    const sum = list.reduce((sum, value) => sum + parseFloat(value.Hours), 0)
    setTotalTime(sum)

    const perPerson = list.reduce((res, value) => {
      if(!([value["First name"]] in res))
        res[value["First name"]] = 0
      
      res[value["First name"]] += parseFloat(value.Hours)
      return res
    }, {})
    setTimePerPerson(Object.keys(perPerson).map((person) => ({name: person, hours: perPerson[person]})))
  }
 
  // handle file upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  }

  return <>
    <input
      type="file"
      accept=".csv"
      onChange={handleFileUpload}
    />
    <h2>Total time in hours: {totalTime}</h2>
    <ul>
    {timePerPerson.map((data) => <>
      <li>{data.hours} = {data.name}</li>
    </>)}
    </ul>
    <TimeLineChart data={data} />
  </>
}

export default App;