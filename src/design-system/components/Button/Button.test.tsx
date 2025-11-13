/**
 * Button Component Tests
 * 
 * Tests for Button component variants, sizes, and states.
 * Requirements: 2.1
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  describe('Variants', () => {
    it('renders primary variant with correct styles', () => {
      render(<Button variant="primary">Primary Button</Button>);
      const button = screen.getByRole('button', { name: /primary button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary-500', 'text-white');
    });

    it('renders secondary variant with correct styles', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      const button = screen.getByRole('button', { name: /secondary button/i });
      expect(button).toHaveClass('bg-transparent', 'border-primary-500');
    });

    it('renders tertiary variant with correct styles', () => {
      render(<Button variant="tertiary">Tertiary Button</Button>);
      const button = screen.getByRole('button', { name: /tertiary button/i });
      expect(button).toHaveClass('bg-primary-50');
    });

    it('renders ghost variant with correct styles', () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      const button = screen.getByRole('button', { name: /ghost button/i });
      expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('Sizes', () => {
    it('renders small size with correct styles', () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button', { name: /small button/i });
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('renders medium size with correct styles', () => {
      render(<Button size="md">Medium Button</Button>);
      const button = screen.getByRole('button', { name: /medium button/i });
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('renders large size with correct styles', () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole('button', { name: /large button/i });
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('States', () => {
    it('renders loading state with spinner', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
      // Check for the screen reader text specifically
      expect(screen.getByText('Loading...', { selector: '.sr-only' })).toBeInTheDocument();
    });

    it('renders disabled state', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button', { name: /disabled button/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('handles click events when enabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not handle click events when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button disabled onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not handle click events when loading', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button loading onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole('button');
      
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icon Support', () => {
    it('renders with icon', () => {
      const icon = <span data-testid="test-icon">Icon</span>;
      render(<Button icon={icon}>Button with Icon</Button>);
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText(/button with icon/i)).toBeInTheDocument();
    });

    it('shows spinner instead of icon when loading', () => {
      const icon = <span data-testid="test-icon">Icon</span>;
      render(<Button icon={icon} loading>Loading</Button>);
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
      // Check for the screen reader text specifically
      expect(screen.getByText('Loading...', { selector: '.sr-only' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper button type by default', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button', { name: /button/i });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('supports custom button type', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('is keyboard accessible', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      const button = screen.getByRole('button', { name: /keyboard button/i });
      
      button.focus();
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('has focus ring styles', () => {
      render(<Button>Focus Button</Button>);
      const button = screen.getByRole('button', { name: /focus button/i });
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-primary-500');
    });
  });
});
