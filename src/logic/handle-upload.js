import * as XLSX from 'xlsx';
import { formatDate, millisToDays } from './helper';
const createDataTemplate = (startDate, list) => {
    return list.reduce((res, value) => {
        if (!([value["First name"]] in res))
            res[value["First name"]] = 0
        return res
    }, {
        Date: startDate
    })
}
const createArrayFromTemplate = (template, duration, startDate) => {
    const finalData = new Array(parseInt(duration + 1))
    for (let x = 0; x < duration; x++) {
        const nextDate = new Date(startDate)
        finalData[x] = { ...template, Date: formatDate(new Date(new Date(nextDate).setDate(nextDate.getDate() + x))) }
    }
    return finalData
}
const fillInHours = (templateArray, list) => {
    for (let x = 0; x < list.length; x++) {
        const entry = list[x]
        // Add time to total time
        templateArray.at(-1)[entry["First name"]] += parseFloat(entry.Hours)
        // Find index of array with that date
        const i = templateArray.findIndex((o) => o.Date === entry.Date)
        // Add time to this day
        templateArray[i][entry["First name"]] = parseFloat(templateArray.at(-1)[entry["First name"]]).toFixed(2)

    }
    return templateArray
}
const fillZeros = (data) => {
    // Fill in zeros with previous day value
    for (let x = 1; x < data.length - 1; x++) {
        Object.keys(data[x]).forEach((key) => {
            if (data[x][key] === 0) {
                data[x][key] = data[x - 1][key]
            }
        })
    }
    return data
}
const extractTotalPersonTime = (list) => {
    const perPerson = list.reduce((res, value) => {
        if (!([value["First name"]] in res))
            res[value["First name"]] = 0

        res[value["First name"]] += parseFloat(value.Hours)
        return res
    }, {})
    return Object.keys(perPerson).map((person) => ({ name: person, hours: perPerson[person] }))
}

const processOutputs = (list, setData, setTotalTime, setTimePerPerson, setTotalProjectTime) => {

    // Sort the data by date
    list.sort((a, b) => new Date(a.Date) - new Date(b.Date))

    // Total time in hours
    const sum = list.reduce((sum, value) => sum + parseFloat(value.Hours), 0)
    setTotalTime(sum)

    // Time per person
    
    const timePerPerson = extractTotalPersonTime(list)
    setTimePerPerson(timePerPerson.sort((a,b)=> b.hours-a.hours))

    // Time data
    const startDate = new Date(list[0].Date) 
    const projectDuration = millisToDays(new Date(list.at(-1).Date) - startDate)
    
    const dataTemplate = createDataTemplate(startDate, list)

    const templateArray = createArrayFromTemplate(dataTemplate, projectDuration +1, startDate)
    console.log(templateArray);
    const filledData = fillInHours(templateArray, list)

    const finalData = fillZeros(filledData)

    setTotalProjectTime(projectDuration)
    setData(finalData)
}

// process CSV data
const processData = (dataString, setData, setTotalTime, setTimePerPerson, setTotalProjectTime) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length === headers.length) {
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
                let d = row[j];
                if (d.length > 0) {
                    if (d[0] === '"')
                        d = d.substring(1, d.length - 1);
                    if (d[d.length - 1] === '"')
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
    processOutputs(list, setData, setTotalTime, setTimePerPerson, setTotalProjectTime)
}

// Handle file upload
export const handleFileUpload = (e, setData, setTotalTime, setTimePerPerson, setTotalProjectTime) => {
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
        processData(data, setData, setTotalTime, setTimePerPerson, setTotalProjectTime);
    };
    reader.readAsBinaryString(file);
}