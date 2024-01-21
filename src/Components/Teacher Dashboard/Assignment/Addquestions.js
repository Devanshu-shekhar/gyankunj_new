import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import TeacherSidebar from '../TeacherSidebar';
import { getQuestions, SaveAssignmentData, publishAssignmentData } from '../../../ApiClient';
import BaseQuestion from './QuestionForm/base';
import Question from './Question';
import './addQuestion.css';

const AddQuestions = () => {
    const navigate = useNavigate();
    const { state: id } = useLocation();
    const userDetails = JSON.parse(localStorage.getItem('UserData'));
    const [questionList, setQuestionList] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        getQueries(id);
    }, []);

    const getQueries = async (id) => {
        const res = await getQuestions(id);
        setQuestionList(res.data.assignment_details[0].assignment_data);
    };

    useEffect(() => {
        setQuestions(Object.values(questionList));
    }, [questionList]);

    const handle = (data) => {
        setQuestions((old) => [...old, data]);
    };

    const handleBack = () => navigate('/teacherDashboard/Assignment');

    const handleSave = async () => {
        const temp = { ...questions };
        const result = {
            assignment_id: id,
            assignment_data: temp,
        };

        try {
            const res = await SaveAssignmentData(result);

            if (res.data.status === 'success') {
                navigate('/teacherDashboard/Assignment');
            } else {
                console.log('ERR', res.data.status);
                navigate('/teacherDashboard/Assignment');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePublish = async () => {
        const temp = { ...questions };
        const result = {
            assignment_id: id,
            assignment_data: temp,
        };

        try {
            const saveRes = await SaveAssignmentData(result);

            if (saveRes.data.status === 'success') {
                const publishRes = await publishAssignmentData(id);

                if (publishRes.data.status === 'success') {
                    navigate('/teacherDashboard/Assignment');
                } else {
                    console.log('ERR', publishRes.data.status);
                    navigate('/teacherDashboard/Assignment');
                }
            } else {
                console.log('ERR', saveRes.data.status);
                navigate('/teacherDashboard/Assignment');
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleEdit = (index, updatedData) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = updatedData;
        setQuestions(updatedQuestions);
      };
    return (
        <>
            <Row>
                <Col md={3} style={{ marginTop: '91px', width: '20%' }}>
                    <TeacherSidebar />
                </Col>
                <Col md={9}>
                    <div className='reportSection'>
                        <Row
                            style={{
                                height: '74px',
                                boxShadow: '0px 3px 6px #B4B3B329',
                                position: 'relative',
                                left: '12px',
                                width: '100%',
                            }}
                        >
                            <Col md={9}>
                                <div className='d-flex flex-row align-items-center'>
                                    <h4>Add Questions</h4>
                                    <BaseQuestion id={id} handle={handle} />
                                </div>
                            </Col>
                            <Col md={3} style={{ paddingTop: '17px' }} onClick={handleBack}>
                                <Button variant='outline-primary'>Go to Assignments</Button>
                            </Col>
                        </Row>
                        {questions.length > 0 && (
                            <div className='d-flex justify-content-end mt-4 mx-5'>
                                <Button variant='outline-primary' onClick={handleBack}>
                                    Back
                                </Button>
                                <Button variant='outline-primary mx-3' onClick={handleSave}>
                                    Save
                                </Button>
                                <Button variant='outline-primary' onClick={handlePublish}>
                                    Publish
                                </Button>
                            </div>
                        )}
                        <Row>
                            <Col style={{ marginTop: '45px' }}>
                                {questions.map((data, index) => (
                                    <Question key={index} data={data} index={index} handleEdit={handleEdit} />
                                ))}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default AddQuestions;
