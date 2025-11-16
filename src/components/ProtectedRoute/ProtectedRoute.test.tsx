import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../contexts/RouteLoadingContext', () => ({
  useRouteLoading: () => ({
    startLoading: vi.fn(),
    stopLoading: vi.fn(),
    withLoader: (operation: () => Promise<unknown> | unknown) => {
      try {
        return Promise.resolve(operation());
      } catch (error) {
        return Promise.reject(error);
      }
    },
  }),
}));

const mockUseAuth = useAuth as unknown as Mock;

const baseAuthValue = {
  user: null,
  loading: false,
  error: null,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  refreshSession: vi.fn().mockResolvedValue(undefined),
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('shows retry UI when auth session fails', async () => {
    const refreshSession = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      ...baseAuthValue,
      error: new Error('network'),
      refreshSession,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Private</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/couldn't verify your session/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it('redirects to login when unauthenticated without errors', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuthValue,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <div>Protected</div>
              </ProtectedRoute>
            )}
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuthValue,
      user: { id: '123' },
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Secure content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/secure content/i)).toBeInTheDocument();
  });
});
