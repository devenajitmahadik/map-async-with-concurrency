import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import mapAsyncWithConcurrency from './utils/mapAsyncWithConcurrency';

jest.mock('./utils/mapAsyncWithConcurrency');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the app correctly', () => {
    render(<App />);
    expect(screen.getByTestId('heading')).toBeInTheDocument();
  });

  test('handles input change correctly', () => {
    render(<App />);
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: '1, 2, 3' } });
    expect(input.getAttribute('value')).toBe('1, 2, 3');
  });

  test('displays correct results on submit', async () => {
    const mockResults = ['2', '4', '6'];
    (mapAsyncWithConcurrency as jest.Mock).mockImplementation(async () => mockResults);
    render(<App />);
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: '1, 2, 3' } });
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText(/Submit/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i));

    expect(await screen.getByTestId('result-row-0')).toBeInTheDocument();
    expect(await screen.getByTestId('result-row-1')).toBeInTheDocument();
    expect(await screen.getByTestId('result-row-2')).toBeInTheDocument();
  });

  test('handles empty input correctly', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(async () => {
      expect(screen.queryByTestId('result-row-0')).not.toBeInTheDocument();
      expect(screen.queryByTestId('result-row-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('result-row-3')).not.toBeInTheDocument();
    });
  });
});
