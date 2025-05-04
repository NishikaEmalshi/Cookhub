import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProgressUpdates,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate,
} from "../../Redux/LearningProgress/Action";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  message,
} from "antd";
import "./LearningProgress.css";

const { Option } = Select;

const LearningProgress = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { updates } = useSelector((store) => store.learningProgress);

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    dispatch(getProgressUpdates(token));
  }, [dispatch, token]);

  const handleSubmit = (values) => {
    if (editing) {
      dispatch(updateProgressUpdate(token, editing.id, values));
      message.success("Update edited successfully!");
    } else {
      dispatch(createProgressUpdate(token, values));
      message.success("New update added!");
    }
    form.resetFields();
    setIsModalOpen(false);
    setEditing(null);
    setSelectedTemplate(null);
  };

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
    message.info("Template selected. Please fill in the details yourself.");
  };

  return (
    <div className="learning-progress-container">
      <div className="header">
        <h2>📈 Learning Progress Updates</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Update
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {updates.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              className="progress-card"
              title={item.title}
              extra={
                <div className="card-actions">
                  <Button
                    type="link"
                    onClick={() => {
                      setEditing(item);
                      form.setFieldsValue(item);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => {
                      dispatch(deleteProgressUpdate(token, item.id));
                      message.success("Update deleted!");
                    }}
                  >
                    Delete
                  </Button>
                </div>
              }
            >
              <p>{item.content}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
          setSelectedTemplate(null);
        }}
        onOk={() => form.submit()}
        title={editing ? "Edit Update ✏️" : "Add Progress Update 🚀"}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {!editing && (
            <Form.Item label="Please Select the progreess Type">
              <Select
                placeholder="Select a template"
                onChange={handleTemplateChange}
              >
                <Option value="tutorial">Completed Tutorial</Option>
                <Option value="skill">New Skill Learned</Option>
                <Option value="project">Enhancing the knowledge</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              placeholder={
                selectedTemplate === "tutorial"
                  ? "e.g., Completed Cooking Tutorial"
                  : selectedTemplate === "skill"
                  ? "e.g., Area improves Skills"
                  : selectedTemplate === "project"
                  ? "e.g., Enhances Area of Knowledge"
                  : "Enter a title"
              }
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Details"
            rules={[{ required: true, message: "Please enter details" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder={
                selectedTemplate === "tutorial"
                  ? "Describe what you learned in the tutorial..."
                  : selectedTemplate === "skill"
                  ? "Describe the skill you learned..."
                  : selectedTemplate === "project"
                  ? "Describe the Enhanced knowledge area..."
                  : "Describe your learning update..."
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LearningProgress;
