import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from './Canvas';
import { Workflow } from '../lib/triggers';
import { useChatConnection } from '@/features/chatbot/hooks/useChatConnection';
import { useVSCodeSync } from '../hooks/useVSCodeSync';

// Mock des hooks
jest.mock('@/features/chatbot/hooks/useChatConnection');
jest.mock('../hooks/useVSCodeSync');

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

  beforeEach(() => {
    // Mock par défaut pour useChatConnection
    (useChatConnection as jest.Mock).mockReturnValue({
      vscodeStatus: { isConnected: false, isLoading: false, error: null },
      notionStatus: { isConnected: false, isLoading: false, error: null }
    });

    // Mock par défaut pour useVSCodeSync
    (useVSCodeSync as jest.Mock).mockReturnValue({
      isConnected: false,
      error: null,
      syncToVSCode: jest.fn()
    });
  });

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

  test('shows VSCode sync button when connected', () => {
    (useChatConnection as jest.Mock).mockReturnValue({
      vscodeStatus: { isConnected: true, isLoading: false, error: null },
      notionStatus: { isConnected: false, isLoading: false, error: null }
    });

    render(<Canvas initialWorkflow={mockWorkflow} />);
    expect(screen.getByTitle('Synchroniser avec VSCode')).toBeInTheDocument();
  });

  test('shows Notion status when connected', () => {
    (useChatConnection as jest.Mock).mockReturnValue({
      vscodeStatus: { isConnected: false, isLoading: false, error: null },
      notionStatus: { isConnected: true, isLoading: false, error: null }
    });

    render(<Canvas initialWorkflow={mockWorkflow} />);
    expect(screen.getByTitle('Synchronisé avec Notion')).toBeInTheDocument();
  });

  test('calls syncToVSCode when VSCode sync button is clicked', () => {
    const mockSyncToVSCode = jest.fn();
    (useVSCodeSync as jest.Mock).mockReturnValue({
      isConnected: true,
      error: null,
      syncToVSCode: mockSyncToVSCode
    });
    (useChatConnection as jest.Mock).mockReturnValue({
      vscodeStatus: { isConnected: true, isLoading: false, error: null },
      notionStatus: { isConnected: false, isLoading: false, error: null }
    });

    render(<Canvas initialWorkflow={mockWorkflow} />);
    
    const syncButton = screen.getByTitle('Synchroniser avec VSCode');
    fireEvent.click(syncButton);
    
    expect(mockSyncToVSCode).toHaveBeenCalled();
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

  test('displays connection status in workflow info', () => {
    (useChatConnection as jest.Mock).mockReturnValue({
      vscodeStatus: { isConnected: true, isLoading: false, error: null },
      notionStatus: { isConnected: true, isLoading: false, error: null }
    });

    render(<Canvas initialWorkflow={mockWorkflow} />);
    
    // Check VSCode status
    const vscodeStatus = screen.getByText('VSCode:').nextElementSibling;
    expect(vscodeStatus).toHaveClass('connected');
    
    // Check Notion status
    const notionStatus = screen.getByText('Notion:').nextElementSibling;
    expect(notionStatus).toHaveClass('connected');
  });

  test('syncs with VSCode after saving workflow when connected', async () => {
    const mockSyncToVSCode = jest.fn();
    (useVSCodeSync as jest.Mock).mockReturnValue({
      isConnected: true,
      error: null,
      syncToVSCode: mockSyncToVSCode
    });
    (useChatConnection as jest.Mock).mockReturnValue({
      vscodeStatus: { isConnected: true, isLoading: false, error: null },
      notionStatus: { isConnected: false, isLoading: false, error: null }
    });

    render(<Canvas />);
    
    // Create and save workflow
    fireEvent.click(screen.getByText('Créer un workflow'));
    const nameInput = screen.getByPlaceholderText('Nom du workflow');
    fireEvent.change(nameInput, { target: { value: 'Test Workflow' } });
    fireEvent.click(screen.getByText('Sauvegarder'));
    
    expect(mockSyncToVSCode).toHaveBeenCalled();
  });
});
