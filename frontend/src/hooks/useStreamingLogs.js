import { useState, useCallback } from 'react';

export function useStreamingLogs() {
  const [logs, setLogs] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const addLog = useCallback((agent, message, level = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const log = {
      id: Date.now() + Math.random(), // Ensure uniqueness
      timestamp,
      agent,
      message,
      level
    };

    setLogs(prev => [...prev, log]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const startStreaming = useCallback(() => {
    setIsActive(true);
    setLogs([]);
  }, []);

  const stopStreaming = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    logs,
    isActive,
    addLog,
    clearLogs,
    startStreaming,
    stopStreaming
  };
}
