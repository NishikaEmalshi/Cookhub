import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createLearningPlan, 
  getLearningPlans, 
  updateLearningPlan, 
  deleteLearningPlan,
  addTopicToPlan,
  updateTopic,
  deleteTopic,
  addResourceToTopic,
  updateResource,
  deleteResource
} from '../../Redux/LearningPlan/Action';
import { Button, Modal, Form, Input, DatePicker, Checkbox, List, Card, Space, message, Collapse, Tag, Alert, Spin, Divider, Popconfirm } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LinkOutlined,
  FileAddOutlined,
  BookOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import moment from 'moment';
import "./LearningPlan.css";

const { TextArea } = Input;

const LearningPlan = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { learningPlan } = useSelector((store) => store);
  const [planForm] = Form.useForm();
  const [topicForm] = Form.useForm();
  const [resourceForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planModal, setPlanModal] = useState({
    visible: false,
    mode: 'create',
    currentPlan: null
  });
  const [topicModal, setTopicModal] = useState({
    visible: false,
    mode: 'create',
    currentTopic: null,
    planId: null
  });
  const [resourceModal, setResourceModal] = useState({
    visible: false,
    mode: 'create',
    currentResource: null,
    topicId: null
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

  // Handler functions defined before render
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
          targetCompletionDate: values.targetCompletionDate?.format('YYYY-MM-DD') || null
        }
      }));
      setTopicModal({...topicModal, visible: false});
      topicForm.resetFields();
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
          targetCompletionDate: values.targetCompletionDate?.format('YYYY-MM-DD') || null
        }
      }));
      setTopicModal({...topicModal, visible: false});
      topicForm.resetFields();
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

  const handleCreateResource = async (values) => {
    try {
      await dispatch(addResourceToTopic({
        jwt: token,
        topicId: resourceModal.topicId,
        resourceData: values
      }));
      setResourceModal({...resourceModal, visible: false});
      resourceForm.resetFields();
      message.success('Resource added successfully');
    } catch (err) {
      message.error(err.message || 'Failed to add resource');
    }
  };

  const handleUpdateResource = async (values) => {
    try {
      await dispatch(updateResource({
        jwt: token,
        resourceId: resourceModal.currentResource.id,
        resourceData: values
      }));
      setResourceModal({...resourceModal, visible: false});
      resourceForm.resetFields();
      message.success('Resource updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update resource');
    }
  };

  const handleDeleteResource = (resourceId) => {
    Modal.confirm({
      title: 'Delete Resource',
      content: 'Are you sure you want to delete this resource?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteResource({
            jwt: token,
            resourceId
          }));
          message.success('Resource deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete resource');
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
      planId
    });
    if (mode === 'edit') {
      topicForm.setFieldsValue({
        title: topic.title,
        description: topic.description,
        completed: topic.completed,
        targetCompletionDate: topic.targetCompletionDate ? moment(topic.targetCompletionDate) : null
      });
    }
  };

  const showResourceModal = (mode = 'create', resource = null, topicId = null) => {
    setResourceModal({
      visible: true,
      mode,
      currentResource: resource,
      topicId
    });
    if (mode === 'edit') {
      resourceForm.setFieldsValue({
        url: resource.url,
        description: resource.description
      });
    }
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
      <h1 className="text-4xl font-extrabold text-center text-Black-600 drop-shadow-md">
          My Learning Plans
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
        <div className="text-center py-10 border-2 border-dashed rounded-lg hover:border-blue-400 transition-colors">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPlan.plans?.map((plan) => (
            <div 
              key={plan.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-lg truncate">{plan.title}</h3>
                <div className="flex space-x-2">
                  <Button 
                    size="small" 
                    icon={<EditOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      showPlanModal('edit', plan);
                    }}
                  />
                  <Popconfirm
                    title="Delete this plan?"
                    onConfirm={() => handleDeletePlan(plan.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button 
                      size="small" 
                      icon={<DeleteOutlined />} 
                      danger
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 mb-3 line-clamp-2">{plan.description || 'No description'}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>{plan.topics?.length || 0} Topics</span>
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      showTopicModal('create', null, plan.id);
                    }}
                  >
                    Add Topic
                  </Button>
                </div>
                
                {plan.topics?.slice(0, 3).map(topic => (
                  <div 
                    key={topic.id} 
                    className="p-3 mb-2 border rounded hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                    }}
                  >
                    <div className="flex justify-between items-start">
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
                      <div className="flex space-x-1">
                        <Button 
                          size="small" 
                          type="text" 
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            showTopicModal('edit', topic, plan.id);
                          }}
                        />
                        <Popconfirm
                          title="Delete this topic?"
                          onConfirm={() => handleDeleteTopic(topic.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button 
                            size="small" 
                            type="text" 
                            icon={<DeleteOutlined />} 
                            danger
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                    
                    {topic.targetCompletionDate && (
                      <div className="mt-1 text-xs">
                        <Tag color={new Date(topic.targetCompletionDate) < new Date() && !topic.completed ? "red" : "orange"}>
                          Target: {new Date(topic.targetCompletionDate).toLocaleDateString()}
                        </Tag>
                      </div>
                    )}
                  </div>
                ))}
                
                {plan.topics?.length > 3 && (
                  <div className="text-center text-blue-500 text-sm mt-2">
                    + {plan.topics.length - 3} more topics
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Plan Detail View */}
      {selectedPlan && (
        <div className="mt-8 border rounded-lg overflow-hidden shadow-sm bg-white">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-semibold">{selectedPlan.title}</h2>
            <div className="flex space-x-2">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showTopicModal('create', null, selectedPlan.id)}
              >
                Add Topic
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => showPlanModal('edit', selectedPlan)}
              >
                Edit Plan
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-gray-700 mb-4">{selectedPlan.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Progress</h3>
                {selectedPlan.topics?.length > 0 ? (
                  <>
                    <div className="mb-2">
                      <span className="text-gray-600">
                        {selectedPlan.topics.filter(t => t.completed).length} of {selectedPlan.topics.length} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${(selectedPlan.topics.filter(t => t.completed).length / selectedPlan.topics.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">No topics to track progress</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Recent Activity</h3>
                {selectedPlan.topics?.length > 0 ? (
                  <div className="text-sm">
                    {selectedPlan.topics.slice(0, 2).map(topic => (
                      <div key={topic.id} className="mb-1">
                        <span className="font-medium">{topic.title}</span> - {topic.completed ? 'Completed' : 'In progress'}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent activity</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Quick Actions</h3>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showTopicModal('create', null, selectedPlan.id)}
                  >
                    Add Topic
                  </Button>
                  <Button
                    icon={<LinkOutlined />}
                    onClick={() => {
                      if (selectedPlan.topics?.length > 0) {
                        showResourceModal('create', null, selectedPlan.topics[0].id);
                      }
                    }}
                    disabled={!selectedPlan.topics || selectedPlan.topics.length === 0}
                  >
                    Add Resource
                  </Button>
                </Space>
              </div>
            </div>
            
            <Divider orientation="left">Topics</Divider>
            
            {selectedPlan.topics?.length > 0 ? (
              <div className="space-y-4">
                {selectedPlan.topics.map(topic => (
                  <div key={topic.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Checkbox 
                          checked={topic.completed}
                          className="mr-3"
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
                        <h4 className={`text-lg font-medium ${topic.completed ? "line-through" : ""}`}>
                          {topic.title}
                        </h4>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="small"
                          onClick={() => showResourceModal('create', null, topic.id)}
                        >
                          Add Resource
                        </Button>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => showTopicModal('edit', topic, selectedPlan.id)}
                        />
                        <Popconfirm
                          title="Delete this topic?"
                          onConfirm={() => handleDeleteTopic(topic.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                          />
                        </Popconfirm>
                      </div>
                    </div>
                    
                    <div className="ml-8 pl-2">
                      {topic.description && (
                        <p className="text-gray-600 mb-3">{topic.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {topic.targetCompletionDate && (
                          <Tag color={new Date(topic.targetCompletionDate) < new Date() && !topic.completed ? "red" : "orange"}>
                            Target: {new Date(topic.targetCompletionDate).toLocaleDateString()}
                          </Tag>
                        )}
                        {topic.completed && (
                          <Tag color="green">Completed</Tag>
                        )}
                      </div>
                      
                      {topic.resources?.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium mb-2">Resources:</h5>
                          <div className="space-y-2">
                            {topic.resources.map(resource => (
                              <div key={resource.id} className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100">
                                <div className="flex items-center">
                                  <LinkOutlined className="mr-2 text-blue-500" />
                                  <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {resource.description || resource.url}
                                  </a>
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => showResourceModal('edit', resource, topic.id)}
                                  />
                                  <Popconfirm
                                    title="Delete this resource?"
                                    onConfirm={() => handleDeleteResource(resource.id)}
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <Button
                                      size="small"
                                      icon={<DeleteOutlined />}
                                      danger
                                    />
                                  </Popconfirm>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <p className="text-gray-500 mb-3">No topics in this plan yet</p>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showTopicModal('create', null, selectedPlan.id)}
                >
                  Add First Topic
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keep all your existing modal code unchanged */}
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
        onCancel={() => setTopicModal({...topicModal, visible: false})}
        onOk={() => topicForm.submit()}
        destroyOnClose
        width={600}
      >
        <Form 
          form={topicForm} 
          onFinish={topicModal.mode === 'create' ? handleCreateTopic : handleUpdateTopic}
          layout="vertical"
        >
          <Form.Item 
            name="title" 
            label="Topic Title" 
            rules={[
              { required: true, message: 'Please input the topic title!' },
              { max: 100, message: 'Title must be less than 100 characters' }
            ]}
          >
            <Input placeholder="Enter topic title" />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Description"
            rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}
          >
            <TextArea rows={3} placeholder="Describe what this topic covers" />
          </Form.Item>
          <Form.Item name="targetCompletionDate" label="Target Completion Date">
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Select target date"
            />
          </Form.Item>
          <Form.Item name="completed" valuePropName="checked">
            <Checkbox>Mark as completed</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={resourceModal.mode === 'create' ? 'Add New Resource' : 'Edit Resource'}
        visible={resourceModal.visible}
        onCancel={() => setResourceModal({...resourceModal, visible: false})}
        onOk={() => resourceForm.submit()}
        destroyOnClose
        width={600}
      >
        <Form 
          form={resourceForm} 
          onFinish={resourceModal.mode === 'create' ? handleCreateResource : handleUpdateResource}
          layout="vertical"
        >
          <Form.Item 
            name="url" 
            label="Resource URL" 
            rules={[
              { required: true, message: 'Please input the resource URL!' },
              { type: 'url', message: 'Please enter a valid URL!' }
            ]}
          >
            <Input 
              prefix={<LinkOutlined />} 
              placeholder="https://example.com/resource" 
            />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Description (Optional)"
            rules={[{ max: 200, message: 'Description must be less than 200 characters' }]}
          >
            <Input placeholder="Brief description of the resource" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LearningPlan;