import { useState, useEffect } from "react";
import { Table, Switch } from "antd";

const App = () => {
  const [tableDataSource, setTableDataSource] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState();
  console.log(tableDataSource);

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
        return <Switch onChange={toggleTask} />;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
  ];

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const toggleTask = (text, record, index) => {
    console.log(text, record, index);
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
