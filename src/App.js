import { useState, useEffect } from "react";
import { Table, Switch, Col, Row, Button, Modal, Input } from "antd";
import styles from "./App.css";

const App = () => {
  const [tableDataSource, setTableDataSource] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState("");
  const [parentId, setParentId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [completedNestedTasks, setCompletedNestedTasks] = useState([]);

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
    {
      title: "Actions",
      dataIndex: "add-task",
      key: "add-task",
      render: (text, record, index) => {
        return !taskCompleted.includes(index) ? (
          <>
            <Button
              className="add-task"
              onClick={(e) => addTask()}
              type="primary"
            >
              Add Task
            </Button>
            <Button onClick={(e) => addSubTask(record.id)}>Add Sub Task</Button>
          </>
        ) : (
          <span>Task completed </span>
        );
      },
    },
  ];

  const addSubTask = (parentId) => {
    setModal(true);
    setParentId(parentId);
  };

  const addTask = () => {
    setModal(true);
  };

  const toggleTask = (index) => {
    if (parentId) {
      setCompletedNestedTasks(completedNestedTasks.concat(index));
    } else {
      setTaskCompleted(taskCompleted.concat(index));
    }
  };

  const pushTodo = () => {
    const todo = {
      userId: 1,
      id: "",
      title: currentTodo,
      completed: false,
      parentId: parentId,
    };
    if (!parentId) {
      todo.id = tableDataSource.length + 1;
      pushToMainTodos(todo);
    } else {
      todo.id = tableData.length + 1;
      pushToNestedTodos(todo);
    }
  };

  const pushToMainTodos = (todo) => {
    let exisitingSubTasks = [...tableDataSource];
    exisitingSubTasks.push(todo);
    setTableDataSource(exisitingSubTasks);
    setModal(false);
  };

  const pushToNestedTodos = (todo) => {
    let exisitingTasks = [...tableData];
    exisitingTasks.push(todo);
    setTableData(exisitingTasks);
    setModal(false);
  };

  const expandedRow = (row) => {
    const columns = [
      {
        title: "Completed",
        dataIndex: "completed",
        key: "completed",
        render: (text, record, index) => {
          return (
            <Switch
              disabled={completedNestedTasks.includes(index)}
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
          return completedNestedTasks.includes(index) ? (
            <del>{text}</del>
          ) : (
            <span>{text}</span>
          );
        },
      },
    ];
    let inTableData = tableData.filter((data) => {
      return data.parentId == parentId;
    });
    return (
      <Table columns={columns} dataSource={inTableData} pagination={false} />
    );
  };

  return (
    <>
      <Row>
        <Col span={3}></Col>
        <Col span={18}>
          <h1 style={{ textAlign: "center" }}>TODO LIST</h1>
          <Table
            className="components-table-demo-nested"
            dataSource={tableDataSource}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.id}
            expandable={{
              expandedRowRender: expandedRow,
            }}
          />
        </Col>
        <Col span={3}></Col>
      </Row>
      <Modal
        title="Enter Todo"
        centered
        visible={modal}
        onOk={() => pushTodo()}
        onCancel={() => setModal(false) && setCurrentTodo("")}
        okText="Save"
      >
        <Input
          placeholder="Enter todo"
          onChange={(e) => setCurrentTodo(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default App;
