import { TimeLineChart } from "./components/TimeLineChart";
import * as csv from "csvtojson"
import { useEffect, useState } from "react";
import * as file from "./file.csv"
function App() {
    const [data, setData] = useState()
    const reader = new FileReader()
    useEffect(() => {
        async function loadCSV() {
            const fetchData = await csv().fromString(file)
            console.log(fetchData)
            setData(fetchData)
        }
        loadCSV()
    }, [])

    return <>

        <p>{JSON.stringify(data)}</p>
        <TimeLineChart data = { data } /> 
    </>
}

export default App;