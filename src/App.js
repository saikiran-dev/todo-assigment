import { useState, useEffect } from "react";
import { Table, Switch } from "antd";
import styles from "./App.css";
const App = () => {
  const [tableDataSource, setTableDataSource] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10")
      .then((response) => response.json())
      .then((json) => setTableDataSource(json));
  }, []);

  const columns = [
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      render: (text, record, index) => {
        return (
          <Switch
            disabled={taskCompleted.includes(index)}
            onChange={(e) => toggleTask(e, text, record, index)}
          />
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record, index) => {
        return taskCompleted.includes(index) ? (
          <del>{text}</del>
        ) : (
          <span>{text}</span>
        );
      },
    },
  ];

  const toggleTask = (e, text, record, index) => {
    setTaskCompleted(taskCompleted.concat(index));
  };
  return (
    <Table
      dataSource={tableDataSource}
      columns={columns}
      pagination={false}
      rowKey={(record) => record.id}
    />
  );
};

export default App;
