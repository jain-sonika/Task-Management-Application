import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Input, Card, message } from 'antd';
import { LogIn, Lock, User } from 'lucide-react';
import { useAuthStore } from '../store';
import { authApi } from '../utils/api';
import { loginSchema } from '../utils/validations';
import { LoginCredentials } from '../types';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const initialValues: LoginCredentials = {
    username: '',
    password: '',
  };

  const handleSubmit = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);
      login(response.user, response.token);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <LogIn size={48} className="login-icon" />
          <h1>Task Manager</h1>
          <p>Sign in to manage your tasks</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form className="login-form">
              <div className="form-field">
                <label htmlFor="username">
                  <User size={16} />
                  Username
                </label>
                <Field
                  as={Input}
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={errors.username && touched.username ? 'error' : ''}
                  size="large"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">
                  <Lock size={16} />
                  Password
                </label>
                <Field
                  as={Input.Password}
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={errors.password && touched.password ? 'error' : ''}
                  size="large"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                className="submit-button"
              >
                Sign In
              </Button>

              <div className="demo-credentials">
                <p>Demo Credentials:</p>
                <p>Username: <strong>test</strong></p>
                <p>Password: <strong>test123</strong></p>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Login;
