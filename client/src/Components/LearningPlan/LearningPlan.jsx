import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createLearningPlan, 
  getLearningPlans, 
  updateLearningPlan, 
  deleteLearningPlan,
  addTopicToPlan,
  updateTopic,
  deleteTopic
} from '../../Redux/LearningPlan/Action';
import { Button, Modal, Form, Input, DatePicker, Checkbox, List, Card, Space, message, Collapse, Tag, Alert, Spin } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LinkOutlined,
  FileAddOutlined,
  BookOutlined
} from '@ant-design/icons';
import moment from 'moment';
import "./LearningPlan.css";

const { Panel } = Collapse;
const { TextArea } = Input;

const LearningPlan = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { learningPlan } = useSelector((store) => store);
  const [planForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePanelKey, setActivePanelKey] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Modal states
  const [planModal, setPlanModal] = useState({
    visible: false,
    mode: 'create',
    currentPlan: null
  });
  
  const [topicModal, setTopicModal] = useState({
    visible: false,
    mode: 'create',
    currentTopic: null,
    planId: null,
    resources: []
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (isMounted) setLoading(true);
        await dispatch(getLearningPlans(token));
      } catch (err) {
        if (isMounted) setError("Failed to load learning plans. Please try again.");
        console.error("Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [dispatch, token]);

  const handleCreatePlan = async (values) => {
    try {
      await dispatch(createLearningPlan({
        jwt: token,
        planData: values
      }));
      setPlanModal({...planModal, visible: false});
      planForm.resetFields();
      message.success('Learning plan created successfully');
    } catch (err) {
      message.error(err.message || 'Failed to create learning plan');
    }
  };

  const handleUpdatePlan = async (values) => {
    try {
      await dispatch(updateLearningPlan({
        jwt: token,
        planId: planModal.currentPlan.id,
        planData: values
      }));
      setPlanModal({...planModal, visible: false});
      planForm.resetFields();
      message.success('Learning plan updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update learning plan');
    }
  };

  const handleDeletePlan = (planId) => {
    Modal.confirm({
      title: 'Delete Learning Plan',
      content: 'Are you sure you want to delete this learning plan?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteLearningPlan({
            jwt: token,
            planId
          }));
          message.success('Learning plan deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete learning plan');
        }
      }
    });
  };

  const handleCreateTopic = async (values) => {
    try {
      await dispatch(addTopicToPlan({
        jwt: token,
        planId: topicModal.planId,
        topicData: {
          ...values,
          resources: topicModal.resources.filter(r => r.url.trim() !== ''),
          targetCompletionDate: values.targetCompletionDate?.format('YYYY-MM-DD') || null
        }
      }));
      setTopicModal({...topicModal, visible: false, resources: []});
      message.success('Topic added successfully');
    } catch (err) {
      message.error(err.message || 'Failed to add topic');
    }
  };

  const handleUpdateTopic = async (values) => {
    try {
      await dispatch(updateTopic({
        jwt: token,
        topicId: topicModal.currentTopic.id,
        topicData: {
          ...values,
          resources: topicModal.resources.filter(r => r.url.trim() !== ''),
          targetCompletionDate: values.targetCompletionDate?.format('YYYY-MM-DD') || null
        }
      }));
      setTopicModal({...topicModal, visible: false, resources: []});
      message.success('Topic updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update topic');
    }
  };

  const handleDeleteTopic = (topicId) => {
    Modal.confirm({
      title: 'Delete Topic',
      content: 'Are you sure you want to delete this topic?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteTopic({
            jwt: token,
            topicId
          }));
          message.success('Topic deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete topic');
        }
      }
    });
  };

  const showPlanModal = (mode = 'create', plan = null) => {
    setPlanModal({
      visible: true,
      mode,
      currentPlan: plan
    });
    if (mode === 'edit') {
      planForm.setFieldsValue({
        title: plan.title,
        description: plan.description
      });
    }
  };

  const showTopicModal = (mode = 'create', topic = null, planId = null) => {
    setTopicModal({
      visible: true,
      mode,
      currentTopic: topic,
      planId,
      resources: topic?.resources || []
    });
  };

  const handlePanelChange = (key) => {
    setActivePanelKey(key);
    if (key.length > 0) {
      const planId = key[0];
      const selected = learningPlan.plans.find(plan => plan.id === planId);
      setSelectedPlan(selected);
    } else {
      setSelectedPlan(null);
    }
  };

  const handleAddResource = () => {
    setTopicModal(prev => ({
      ...prev,
      resources: [...prev.resources, { url: '', description: '' }]
    }));
  };

  const handleRemoveResource = (index) => {
    setTopicModal(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleResourceChange = (index, field, value) => {
    setTopicModal(prev => {
      const updatedResources = [...prev.resources];
      updatedResources[index] = { ...updatedResources[index], [field]: value };
      return { ...prev, resources: updatedResources };
    });
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-10">
          <Alert message="Error" description={error} type="error" showIcon />
          <Button 
            type="primary" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-10">
          <Spin size="large" />
          <p>Loading your learning plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <BookOutlined className="mr-2" /> My Learning Plans
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showPlanModal()}
        >
          New Learning Plan
        </Button>
      </div>

      {learningPlan.plans?.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <FileAddOutlined className="text-4xl text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No learning plans yet</p>
          <Button 
            type="primary" 
            className="mt-4"
            onClick={() => showPlanModal()}
          >
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <>
          <Collapse 
            activeKey={activePanelKey}
            onChange={handlePanelChange}
            className="mb-6"
          >
            {learningPlan.plans?.map((plan) => (
              <Panel 
                header={
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{plan.title}</span>
                    <div>
                      <Tag color="blue">{plan.topics?.length || 0} Topics</Tag>
                    </div>
                  </div>
                }
                key={plan.id.toString()}
                extra={
                  <Space>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        showTopicModal('create', null, plan.id);
                      }}
                    >
                      Add Topic
                    </Button>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        showPlanModal('edit', plan);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlan(plan.id);
                      }}
                    >
                      Delete
                    </Button>
                    
                  </Space>
                }
              >
                <div className="mb-4">
                  <p className="text-gray-700">{plan.description}</p>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Topics</h3>
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => showTopicModal('create', null, plan.id)}
                    >
                      Add Topic
                    </Button>
                  </div>

                  {plan.topics?.length > 0 ? (
                    <List
                      dataSource={plan.topics}
                      renderItem={(topic) => (
                        <List.Item className="!px-0">
                          <Card
                            size="small"
                            className="w-full"
                            title={
                              <div className="flex items-center">
                                <Checkbox 
                                  checked={topic.completed}
                                  className="mr-2"
                                  onChange={(e) => {
                                    dispatch(updateTopic({
                                      jwt: token,
                                      topicId: topic.id,
                                      topicData: {
                                        ...topic,
                                        completed: e.target.checked
                                      }
                                    }));
                                  }}
                                />
                                <span className={topic.completed ? "line-through" : ""}>
                                  {topic.title}
                                </span>
                              </div>
                            }
                            extra={
                              <Space>
                                <Button
                                  size="small"
                                  onClick={() => showTopicModal('edit', topic, plan.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  danger
                                  onClick={() => handleDeleteTopic(topic.id)}
                                >
                                  Delete
                                </Button>
                               
                              </Space>
                            }
                          >
                            <div className="mb-2">
                              <p className="text-gray-600">{topic.description}</p>
                              {topic.targetCompletionDate && (
                                <div className="mt-2">
                                  <Tag color="blue">
                                    Target: {new Date(topic.targetCompletionDate).toLocaleDateString()}
                                  </Tag>
                                  {new Date(topic.targetCompletionDate) < new Date() && !topic.completed && (
                                    <Tag color="red" className="ml-2">Overdue</Tag>
                                  )}
                                </div>
                              )}
                            </div>

                            {topic.resources?.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-2">Resources:</h4>
                                <List
                                  size="small"
                                  dataSource={topic.resources}
                                  renderItem={(resource) => (
                                    <List.Item className="!px-0">
                                      <div className="flex items-center">
                                        <LinkOutlined className="mr-2 text-blue-500" />
                                        <a 
                                          href={resource.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-500"
                                        >
                                          {resource.description || resource.url}
                                        </a>
                                      </div>
                                    </List.Item>
                                  )}
                                />
                              </div>
                            )}
                          </Card>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div className="text-center py-4 border-2 border-dashed rounded-lg">
                      <p className="text-gray-500">No topics yet</p>
                      <Button
                        type="dashed"
                        className="mt-2"
                        icon={<PlusOutlined />}
                        onClick={() => showTopicModal('create', null, plan.id)}
                      >
                        Add First Topic
                      </Button>
                    </div>
                  )}
                </div>
              </Panel>
            ))}
          </Collapse>

          <Modal
            title={planModal.mode === 'create' ? 'Create Learning Plan' : 'Edit Learning Plan'}
            visible={planModal.visible}
            onCancel={() => setPlanModal({...planModal, visible: false})}
            onOk={() => planForm.submit()}
            destroyOnClose
            width={600}
          >
            <Form 
              form={planForm} 
              onFinish={planModal.mode === 'create' ? handleCreatePlan : handleUpdatePlan}
              layout="vertical"
            >
              <Form.Item 
                name="title" 
                label="Plan Title" 
                rules={[
                  { required: true, message: 'Please input the plan title!' },
                  { max: 100, message: 'Title must be less than 100 characters' }
                ]}
              >
                <Input placeholder="Enter plan title" />
              </Form.Item>
              <Form.Item 
                name="description" 
                label="Description"
                rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}
              >
                <TextArea rows={4} placeholder="Describe what you want to learn" />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={topicModal.mode === 'create' ? 'Add New Topic' : 'Edit Topic'}
            visible={topicModal.visible}
            onCancel={() => setTopicModal({...topicModal, visible: false, resources: []})}
            onOk={() => {
              if (topicModal.mode === 'create') {
                handleCreateTopic({
                  title: topicModal.currentTopic?.title || '',
                  description: topicModal.currentTopic?.description || '',
                  completed: topicModal.currentTopic?.completed || false,
                  targetCompletionDate: topicModal.currentTopic?.targetCompletionDate || null
                });
              } else {
                handleUpdateTopic({
                  title: topicModal.currentTopic?.title || '',
                  description: topicModal.currentTopic?.description || '',
                  completed: topicModal.currentTopic?.completed || false,
                  targetCompletionDate: topicModal.currentTopic?.targetCompletionDate || null
                });
              }
            }}
            destroyOnClose
            width={800}
          >
            <Form layout="vertical">
              <Form.Item 
                name="title" 
                label="Topic Title" 
                rules={[
                  { required: true, message: 'Please input the topic title!' },
                  { max: 100, message: 'Title must be less than 100 characters' }
                ]}
              >
                <Input 
                  placeholder="Enter topic title" 
                  value={topicModal.currentTopic?.title}
                  onChange={(e) => setTopicModal(prev => ({
                    ...prev,
                    currentTopic: { ...prev.currentTopic, title: e.target.value }
                  }))}
                />
              </Form.Item>
              <Form.Item 
                name="description" 
                label="Description"
                rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe what this topic covers" 
                  value={topicModal.currentTopic?.description}
                  onChange={(e) => setTopicModal(prev => ({
                    ...prev,
                    currentTopic: { ...prev.currentTopic, description: e.target.value }
                  }))}
                />
              </Form.Item>
              <Form.Item name="targetCompletionDate" label="Target Completion Date">
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Select target date"
                  value={topicModal.currentTopic?.targetCompletionDate ? 
                    moment(topicModal.currentTopic.targetCompletionDate) : null}
                  onChange={(date) => setTopicModal(prev => ({
                    ...prev,
                    currentTopic: { ...prev.currentTopic, targetCompletionDate: date }
                  }))}
                />
              </Form.Item>
              <Form.Item name="completed" valuePropName="checked">
                <Checkbox
                  checked={topicModal.currentTopic?.completed || false}
                  onChange={(e) => setTopicModal(prev => ({
                    ...prev,
                    currentTopic: { ...prev.currentTopic, completed: e.target.checked }
                  }))}
                >
                  Mark as completed
                </Checkbox>
              </Form.Item>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Resources</h4>
                  <Button 
                    type="dashed" 
                    icon={<PlusOutlined />} 
                    onClick={handleAddResource}
                  >
                    Add Resource
                  </Button>
                </div>
                
                {topicModal.resources.map((resource, index) => (
                  <div key={index} className="flex mb-2 gap-2">
                    <Input
                      placeholder="URL (required)"
                      value={resource.url}
                      onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={resource.description}
                      onChange={(e) => handleResourceChange(index, 'description', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveResource(index)}
                    />
                  </div>
                ))}
              </div>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default LearningPlan;