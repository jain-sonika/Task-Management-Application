import { render, screen } from '@testing-library/react';
import App from '../App';
import { useAuthStore, useTaskStore, useThemeStore } from '../store';

jest.mock('../pages/Login', () => ({
  __esModule: true,
  default: () => <div>Login Page</div>,
}));

jest.mock('../pages/Dashboard', () => ({
  __esModule: true,
  default: () => <div>Dashboard Page</div>,
}));

describe('App', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    useTaskStore.setState({
      tasks: [],
      loading: false,
      error: null,
    });
    useThemeStore.setState({
      isDarkMode: false,
    });
  });

  it('should initialize stores on mount', () => {
    const initAuthMock = jest.fn();
    const initTasksMock = jest.fn();
    const initThemeMock = jest.fn();

    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      initialize: initAuthMock,
    });

    useTaskStore.setState({
      tasks: [],
      loading: false,
      error: null,
      initialize: initTasksMock,
    });

    useThemeStore.setState({
      isDarkMode: false,
      initialize: initThemeMock,
    });

    render(<App />);

    expect(initAuthMock).toHaveBeenCalled();
    expect(initTasksMock).toHaveBeenCalled();
    expect(initThemeMock).toHaveBeenCalled();
  });

  it('should redirect to dashboard when accessing root path and authenticated', () => {
    useAuthStore.setState({
      user: { id: '1', username: 'test', email: 'test@example.com' },
      token: 'token123',
      isAuthenticated: true,
    });

    render(<App />);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('should redirect to login when accessing root path and not authenticated', () => {
    render(<App />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render with dark theme', () => {
    useThemeStore.setState({
      isDarkMode: true,
    });

    render(<App />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render with light theme', () => {
    useThemeStore.setState({
      isDarkMode: false,
    });

    render(<App />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
