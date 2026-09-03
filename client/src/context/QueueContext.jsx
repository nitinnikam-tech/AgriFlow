import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSocket } from '../services/socket';
import { api } from '../services/api';
import { soundAlerts } from '../utils/soundEffects';

const QueueContext = createContext();

export function QueueProvider({ children }) {
  const [centreId, setCentreId] = useState('PC-PUNE-01');
  const [targetTokenNumber, setTargetTokenNumber] = useState('A-127');
  const [queueState, setQueueState] = useState(null);
  const [heroToken, setHeroToken] = useState(null);
  const [farmerETA, setFarmerETA] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('OFFLINE'); // LIVE, RECONNECTING, OFFLINE
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [demoStep, setDemoStep] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // Initial Fetch & Socket Listeners
  const refreshData = useCallback(async () => {
    try {
      const [queueRes, tokenRes, notifRes] = await Promise.all([
        api.getLiveQueue(centreId),
        api.getToken(targetTokenNumber),
        api.getFarmerNotifications('FMR-1002')
      ]);

      if (queueRes.success) setQueueState(queueRes);
      if (tokenRes.success) {
        setHeroToken(tokenRes.token);
        setFarmerETA(tokenRes.eta);
      }
      if (notifRes.success) setNotifications(notifRes.notifications);
    } catch (err) {
      console.error('Error fetching initial queue state:', err);
    }
  }, [centreId, targetTokenNumber]);

  useEffect(() => {
    refreshData();

    const socket = getSocket();

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('LIVE');
      socket.emit('join:centre', centreId);
      socket.emit('join:farmer', { tokenNumber: targetTokenNumber, centreId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setConnectionStatus('OFFLINE');
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
      setConnectionStatus('RECONNECTING');
    });

    socket.on('queue:update', (data) => {
      setQueueState(data);
      if (data.toastMessage) {
        setToastMessage(data.toastMessage);
        if (audioEnabled) soundAlerts.playChime('NOTIFICATION');
        setTimeout(() => setToastMessage(null), 4000);
      }
    });

    socket.on('eta:update', (data) => {
      setFarmerETA(data);
    });

    socket.on('token:update', (data) => {
      setHeroToken(data);
      if (data?.status === 'PROCESSING' && audioEnabled) {
        soundAlerts.playChime('ALERT');
        soundAlerts.speakAnnouncement(`Token ${data.tokenNumber}, please proceed to Counter 1.`);
      }
    });

    socket.on('global:telemetry', ({ queueState, eta }) => {
      if (queueState) setQueueState(queueState);
      if (eta && eta.tokenNumber === targetTokenNumber) setFarmerETA(eta);
    });

    return () => {
      socket.off('queue:update');
      socket.off('eta:update');
      socket.off('token:update');
      socket.off('global:telemetry');
    };
  }, [centreId, targetTokenNumber, audioEnabled, refreshData]);

  // Actions
  const callNext = (counterId = 'CNT-PUN-01') => {
    const socket = getSocket();
    socket.emit('token:call_next', { counterId, centreId });
  };

  const completeToken = (counterId = 'CNT-PUN-01', tokenNumber = 'A-109') => {
    const socket = getSocket();
    socket.emit('token:complete', { counterId, tokenNumber, centreId });
  };

  const toggleCounter = (counterId) => {
    const socket = getSocket();
    socket.emit('counter:toggle', { counterId, centreId });
  };

  const addCounter = () => {
    const socket = getSocket();
    socket.emit('counter:add', { centreId });
  };

  const triggerCongestionSpike = () => {
    const socket = getSocket();
    socket.emit('demo:trigger_spike', { centreId });
  };

  const applySlotOptimization = () => {
    const socket = getSocket();
    socket.emit('demo:optimize', { centreId });
  };

  const resetDemoState = () => {
    const socket = getSocket();
    socket.emit('demo:reset');
    setDemoStep(1);
    refreshData();
  };

  return (
    <QueueContext.Provider value={{
      centreId,
      setCentreId,
      targetTokenNumber,
      setTargetTokenNumber,
      queueState,
      heroToken,
      farmerETA,
      notifications,
      isConnected,
      connectionStatus,
      audioEnabled,
      setAudioEnabled,
      demoStep,
      setDemoStep,
      toastMessage,
      refreshData,
      callNext,
      completeToken,
      toggleCounter,
      addCounter,
      triggerCongestionSpike,
      applySlotOptimization,
      resetDemoState
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export const useQueue = () => useContext(QueueContext);
