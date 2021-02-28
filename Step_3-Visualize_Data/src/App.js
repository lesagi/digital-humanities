import React, { useState, useEffect } from "react";
import "./App.css";
import NivoBarChart from "./components/NivoBarChart";
import Sidebar from "./components/Sidebar";
import moment from "moment";

function App() {
  const [data, setData] = useState(null);
  const [keys, setKeys] = useState([]);
  const [topicsFetched, setTopicsFetched] = useState(false);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  const [sortingKey, setSortingKey] = useState(null);
  const [isDescOrder, setIsDescOrder] = useState(true);

  const onKeyClickHandlerCtor = (key) => {
    return () => {
      const isDiffKey = sortingKey !== key;
      let isDesc = isDescOrder;
      if (isDiffKey) {
        isDesc = true;
        setSortingKey(key);
      } else {
        isDesc = !isDesc;
      }
      let mult = isDesc ? 1 : -1;
      const newData = [...data];
      newData.sort((a, b) => mult * (a[key] - b[key]));
      setData(newData);
      setIsDescOrder(isDesc);
    };
  };
  const updateChartData = (apiRes, key) => {
    const newData = [...data];
    for (let i = 0; i < data.length; i++) {
      let count = 0;
      for (let topic of apiRes) {
        if (topic["Topic_ID"] === i) {
          count = topic["Num_Documents"];
        }
      }
      newData[i][key] = count;
    }

    return newData;
  };

  useEffect(() => {
    if (!topicsFetched) {
      setTopicsFetched(true);
      fetch(`/topics`)
        .then((res) => res.json())
        .then((initialData) => {
          setData(
            Object.values(initialData).map((curr, ind) => {
              return { topic: curr, id: ind };
            })
          );
        });
    }
  }, []);

  const addDateSubmissionHandler = () => {
    const startDateValue = startDate.format("YYYY-MM-DD");
    const endDateValue = endDate.format("YYYY-MM-DD");
    const key = `${startDateValue},${endDateValue}`
      .replace(/\-/gim, "/")
      .replace(",", "-");
    setKeys([...keys, key].filter((key) => key));

    fetch(`/data?dates=${startDateValue},${endDateValue}`)
      .then((res) => res.json())
      .then((res) => {
        setData(updateChartData(res, key));
      });
  };

  const removeDateHandler = (e) => {
    const keyText = e.target.innerText;
    const newKeys = [...keys];
    newKeys.splice(newKeys.indexOf(keyText), 1);
    setKeys(newKeys);
  };
  return (
    <div className="app">
      <div id="sidebar-area">
        <Sidebar
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          addDateSubmissionHandler={addDateSubmissionHandler}
          keys={keys}
          setKeys={setKeys}
          removeDateHandler={removeDateHandler}
          onKeyClickHandlerCtor={onKeyClickHandlerCtor}
          sortingKey={sortingKey}
          isDescOrder={isDescOrder}
        />
      </div>

      <div id="chart-area">
        {data && <NivoBarChart data={data} keys={keys} />}
      </div>
    </div>
  );
}

export default App;
