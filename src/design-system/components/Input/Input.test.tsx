/**
 * Input Component Tests
 * 
 * Tests for Input component with validation and accessibility.
 * Requirements: 2.2
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  describe('Basic Rendering', () => {
    it('renders input field', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<Input helperText="Enter your username" />);
      expect(screen.getByText(/enter your username/i)).toBeInTheDocument();
    });

    it('renders with icon', () => {
      const icon = <span data-testid="test-icon">Icon</span>;
      render(<Input icon={icon} />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Validation and Error States', () => {
    it('renders error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });

    it('applies error styles when error is present', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-500');
    });

    it('sets aria-invalid when error is present', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not show helper text when error is present', () => {
      render(<Input error="Error message" helperText="Helper text" />);
      expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
      expect(screen.getByText(/error message/i)).toBeInTheDocument();
    });

    it('error message has role alert', () => {
      render(<Input error="Error message" />);
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveTextContent(/error message/i);
    });
  });

  describe('Required Field', () => {
    it('shows asterisk for required fields', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('sets aria-required attribute', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Disabled State', () => {
    it('renders disabled input', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('User Interaction', () => {
    it('accepts user input', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Type here" />);
      
      const input = screen.getByPlaceholderText(/type here/i);
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('calls onChange handler', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'a');
      expect(handleChange).toHaveBeenCalled();
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Focus me" />);
      
      const input = screen.getByPlaceholderText(/focus me/i);
      await user.tab();
      
      expect(input).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('associates label with input using htmlFor', () => {
      render(<Input label="Email Address" id="email" />);
      const label = screen.getByText(/email address/i);
      const input = screen.getByLabelText(/email address/i);
      
      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
    });

    it('generates unique id when not provided', () => {
      render(<Input label="Username" />);
      const input = screen.getByLabelText(/username/i);
      expect(input).toHaveAttribute('id');
    });

    it('links error message with aria-describedby', () => {
      render(<Input error="Invalid input" id="test-input" />);
      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      
      expect(describedBy).toContain('test-input-error');
    });

    it('links helper text with aria-describedby', () => {
      render(<Input helperText="Helper text" id="test-input" />);
      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      
      expect(describedBy).toContain('test-input-helper');
    });

    it('has focus ring styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:ring-2');
    });
  });

  describe('Input Types', () => {
    it('supports email type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('supports password type', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('supports number type', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });
});
