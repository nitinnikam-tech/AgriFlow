
import('./server/repositories/index.js').then(async m => {
  const store = m.repository;
  const token = await store.getToken('A-127');
  const q = await import('./server/services/queueIntelligence.js');
  const qi = q.QueueIntelligenceService;

  async function testState(stateName) {
    token.status = stateName;
    const queueState = await qi.getCentreQueueState('PC-PUNE-01');
    const eta = await qi.calculateFarmerETA('A-127', 'PC-PUNE-01');
    const canonicalQueue = await qi.getCanonicalQueue('PC-PUNE-01');
    const callNextCanSelect = canonicalQueue.find(t => t.status === 'WAITING')?.tokenNumber === 'A-127';
    console.log('\nState: ' + stateName);
    console.log('Appears in waitingTokens: ' + queueState.waitingTokens.some(t => t.tokenNumber === 'A-127'));
    console.log('peopleAhead: ' + eta.peopleAhead);
    console.log('call_next can select it: ' + callNextCanSelect);
  }

  await testState('BOOKED');
  await testState('WAITING');
  await testState('PROCESSING');
});

