import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './Login.module.scss';
import {Form, Input, Button, notification} from 'antd';
import LoginLayout from '../layouts/Login';
import {apiRequest} from '../utils/api';
import {setAuthToken, isLoggedIn, setProfileImg} from '../utils/auth';

function Login() {

  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn()) {
      history.replace('/dashboard');
    }
  }, [history])

  const onFinish = values => {
      apiRequest.post(`/login`, {
        name: values.name,
        apiKey: values.apiKey
      }).then((response)=> {
        if (response.data.token.token) {
          setAuthToken(response.data.token.token)
          setProfileImg(response.data.image)
          history.replace('/dashboard');
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          notification.error({
            message: "Login details are invalid, please try again!",
          });
        }
      })    
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <LoginLayout>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>
          Login
        </h1>
        <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your id!" }]}
          >
            <Input placeholder="Id" />
          </Form.Item>

          <Form.Item
            name="apiKey"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.submitButton}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </LoginLayout>
  );
}

export default Login;
