import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from './Canvas';
import { Workflow } from '../lib/triggers';

describe('Canvas Component', () => {
  const mockWorkflow: Workflow = {
    id: '1',
    name: 'Test Workflow',
    description: 'Test Description',
    firstStepId: 'step1',
    steps: {
      step1: {
        id: 'step1',
        name: 'Step 1',
        description: 'First Step',
        triggerId: 'system-info',
        trigger: {
          id: 'system-info',
          name: 'System Info',
          description: 'Get system info',
          params: [],
          execute: async () => ({})
        },
        params: {},
        nextStepId: undefined
      }
    },
    triggers: [],
    status: 'inactive',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  test('renders empty state initially', () => {
    render(<Canvas />);
    expect(screen.getByText('Aucun workflow créé')).toBeInTheDocument();
    expect(screen.getByText('Créer un workflow')).toBeInTheDocument();
  });

  test('shows workflow builder when create button is clicked', () => {
    render(<Canvas />);
    fireEvent.click(screen.getByText('Créer un workflow'));
    expect(screen.queryByText('Aucun workflow créé')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nom du workflow')).toBeInTheDocument();
  });

  test('displays workflow preview after saving', () => {
    const onSave = jest.fn();
    render(<Canvas onSave={onSave} />);

    // Click create button
    fireEvent.click(screen.getByText('Créer un workflow'));

    // Fill in workflow details
    const nameInput = screen.getByPlaceholderText('Nom du workflow');
    fireEvent.change(nameInput, { target: { value: 'Test Workflow' } });

    // Save workflow
    fireEvent.click(screen.getByText('Sauvegarder'));

    // Check if preview is shown
    expect(screen.getByText('Test Workflow')).toBeInTheDocument();
    expect(onSave).toHaveBeenCalled();
  });

  test('shows edit button when workflow exists', () => {
    const { rerender } = render(<Canvas />);
    
    // Initially no edit button
    expect(screen.queryByText('Modifier')).not.toBeInTheDocument();

    // After workflow is created
    rerender(<Canvas onSave={jest.fn()} />);
    fireEvent.click(screen.getByText('Créer un workflow'));
    
    const nameInput = screen.getByPlaceholderText('Nom du workflow');
    fireEvent.change(nameInput, { target: { value: 'Test Workflow' } });
    fireEvent.click(screen.getByText('Sauvegarder'));

    // Edit button should be visible
    expect(screen.getByText('Modifier')).toBeInTheDocument();
  });

  test('displays workflow steps correctly', () => {
    const { rerender } = render(<Canvas />);
    
    // Create workflow with steps
    rerender(<Canvas onSave={jest.fn()} />);
    fireEvent.click(screen.getByText('Créer un workflow'));
    
    // Add a step
    const systemInfoTrigger = screen.getByText('Informations Système');
    fireEvent.click(systemInfoTrigger);

    // Save workflow
    fireEvent.click(screen.getByText('Sauvegarder'));

    // Check if step is displayed
    expect(screen.getByText('Informations Système')).toBeInTheDocument();
  });

  test('handles workflow cancellation', () => {
    render(<Canvas />);
    
    // Start creating workflow
    fireEvent.click(screen.getByText('Créer un workflow'));
    
    // Fill in some data
    const nameInput = screen.getByPlaceholderText('Nom du workflow');
    fireEvent.change(nameInput, { target: { value: 'Test Workflow' } });
    
    // Cancel
    fireEvent.click(screen.getByText('Annuler'));
    
    // Should show empty state again
    expect(screen.getByText('Aucun workflow créé')).toBeInTheDocument();
  });

  test('displays available triggers', () => {
    render(<Canvas />);
    
    // Check if triggers section is visible
    expect(screen.getByText('Triggers Disponibles')).toBeInTheDocument();
    
    // Check if system info trigger is listed
    expect(screen.getByText('Informations Système')).toBeInTheDocument();
    
    // Check if camera trigger is listed
    expect(screen.getByText('Flux Caméra')).toBeInTheDocument();
  });
});
