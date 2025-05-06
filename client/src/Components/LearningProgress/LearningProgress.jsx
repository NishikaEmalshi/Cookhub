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
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditing(null);
    form.resetFields();
    setSelectedTemplate(null);
  };

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
    message.info("Template selected. Please fill in the details yourself.");
  };

  // Dynamically style select
  const getSelectColorClass = () => {
    switch (selectedTemplate) {
      case "tutorial":
        return "bg-red-500 text-white";
      case "skill":
        return "bg-green-500 text-white";
      case "project":
        return "bg-blue-500 text-white";
      default:
        return "bg-white text-black";
    }
  };

  //test comment
  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-8"
      style={{
        backgroundImage: `url('https://t3.ftcdn.net/jpg/03/39/06/02/360_F_339060225_w8ob8LjMJzPdEqD9UFxbE6ibcKx8dFrP.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-7xl">
        <div className="flex flex-col items-center mb-12">
          <h2 className="mb-6 text-4xl font-bold text-center text-black">
            Learning Progress Updates
          </h2>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-2 text-lg bg-blue-500 hover:bg-blue-600"
          >
            Add Update
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {updates.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                className="transition-shadow duration-300 hover:shadow-lg"
                title={
                  <div className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </div>
                }
                extra={
                  <div className="flex space-x-2">
                    <Button
                      type="text"
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => {
                        setEditing(item);
                        form.setFieldsValue(item);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="text"
                      className="text-red-500 hover:text-red-600"
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
                <p className="text-gray-600">{item.content}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          open={isModalOpen}
          onCancel={handleModalClose}
          onOk={() => form.submit()}
          title={
            <div className="px-6 py-4 -mx-6 -mt-6 bg-blue-500 rounded-t-lg">
              <span className="text-xl font-semibold text-white">
                {editing ? "Edit Update" : "Add Progress Update"}
              </span>
            </div>
          }
          className="rounded-lg"
          width={600}
          bodyStyle={{ paddingTop: "20px" }}
          footer={
            <div className="flex justify-end pt-4 space-x-2 border-t">
              <Button onClick={handleModalClose} className="px-6">
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                className="px-6 bg-blue-500 hover:bg-blue-600"
              >
                {editing ? "Save Changes" : "Add Update"}
              </Button>
            </div>
          }
          //save changes button
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical" className="mt-4">
            {!editing && (
              <Form.Item
                label={
                  <span className="text-base font-medium text-gray-700">
                    Select Progress Type
                  </span>
                }
              >
                
                <Select
                  placeholder="Select a template"
                  onChange={handleTemplateChange}
                  className={`w-full rounded-md ${getSelectColorClass()}`}
                  size="large"
                >
                  
                  <Option value="tutorial">Completed Tutorial</Option>
                  <Option value="skill">New Skill Learned</Option>
                  <Option value="project">Enhancing the knowledge</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="title"
              label={<span className="text-base font-medium text-gray-700">Title</span>}
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input
                className="rounded-md"
                size="large"
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
              label={<span className="text-base font-medium text-gray-700">Details</span>}
              rules={[{ required: true, message: "Please enter details" }]}
            >
              <Input.TextArea
                rows={4}
                className="rounded-md"
                size="large"
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
    </div>
  );
};

export default LearningProgress;
