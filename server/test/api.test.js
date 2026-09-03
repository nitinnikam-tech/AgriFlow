import assert from 'node:assert';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { SlotOptimizerService } from '../services/slotOptimizer.js';
import { repository as dualModeStore } from '../repositories/index.js';
import { TOKEN_STATUS, CONGESTION_LEVELS } from '../config/constants.js';

console.log('🧪 Running AgriFlow Backend & Queue Intelligence Unit Tests...\n');

try {
  // Test 1: Store Seed Data Check
  const pune = await dualModeStore.getCentre('PC-PUNE-01');
  assert.ok(pune, 'Pune Centre must exist in seed store');
  assert.strictEqual(pune.totalCounters, 6, 'Pune Centre must have 6 total counters');
  assert.strictEqual(pune.activeCounters, 4, 'Pune Centre must have 4 active counters');
  console.log('✅ Test 1: Dual-Mode Seed Data Initialization Passed');

  // Test 2: Hero Token A-127 State
  const token = await dualModeStore.getToken('A-127');
  assert.ok(token, 'Hero Token A-127 must exist');
  assert.strictEqual(token.cropType, 'WHEAT', 'Token crop must be Wheat');
  assert.strictEqual(token.status, TOKEN_STATUS.WAITING, 'Token status must be WAITING');
  console.log('✅ Test 2: Hero Token A-127 Baseline Passed');

  // Test 3: Queue Telemetry Calculation
  const queueState = await QueueIntelligenceService.getCentreQueueState('PC-PUNE-01');
  assert.strictEqual(queueState.activeCountersCount, 4, 'Active counters must be 4');
  assert.ok(queueState.waitingCount >= 40, 'Waiting count must reflect seed queue');
  assert.ok(queueState.queueVelocityPerMin > 0, 'Queue velocity must be calculated positive');
  console.log('✅ Test 3: Queue Telemetry & Velocity Engine Passed');

  // Test 4: ETA Mathematical Accuracy
  const eta = await QueueIntelligenceService.calculateFarmerETA('A-127', 'PC-PUNE-01');
  assert.ok(eta, 'ETA must be calculated for A-127');
  assert.ok(eta.peopleAhead > 0, 'People ahead must be greater than 0');
  assert.ok(eta.estimatedWaitMin > 0, 'Estimated wait time must be positive');
  assert.ok(eta.recommendedArrivalTime, 'Recommended arrival time must be provided');
  console.log('✅ Test 4: Farmer ETA & Dynamic Arrival Window Passed');

  // Test 5: Dynamic Slot Optimization
  const proposal = await SlotOptimizerService.getOptimizationProposal('PC-PUNE-01');
  assert.ok(proposal.currentPeakLoadPercent > proposal.optimizedPeakLoadPercent, 'Optimization must reduce peak load');
  assert.ok(proposal.recommendedShifts.length > 0, 'Must have shift recommendations');
  console.log('✅ Test 5: Dynamic Slot Optimization Engine Passed');

  console.log('\n🎉 ALL 5 BACKEND & QUEUE INTELLIGENCE TESTS PASSED SUCCESSFULLY!\n');
} catch (err) {
  console.error('❌ Test Failure:', err);
  process.exit(1);
}
