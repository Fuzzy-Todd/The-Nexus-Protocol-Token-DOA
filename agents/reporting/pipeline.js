// /agents/reporting/pipeline.js
// Nexus Protocol Token DAO – Real-time metrics ingestion + scoring pipeline.
// Wires raw telemetry into the scoring engine and emits normalized records.

const {
  computeAgentScore,
  buildAgentMetricsRecord,
  computeMcpScore,
  buildMcpMetricsRecord,
  computeGovernanceScore,
  buildGovernanceMetricsRecord
} = require('./metrics');

// In a real system, these would push to a DB, message bus, or telemetry store.
function emitAgentMetrics(record) {
  // TODO: replace with actual persistence / streaming
  console.log('[AGENT_METRICS]', JSON.stringify(record));
}

function emitMcpMetrics(record) {
  console.log('[MCP_METRICS]', JSON.stringify(record));
}

function emitGovernanceMetrics(record) {
  console.log('[GOVERNANCE_METRICS]', JSON.stringify(record));
}

// Ingest a single agent task event and score it.
function ingestAgentTask(rawTaskMetrics) {
  const record = buildAgentMetricsRecord(rawTaskMetrics);
  emitAgentMetrics(record);
  return record;
}

// Ingest an MCP snapshot and score it.
function ingestMcpSnapshot(rawMcpMetrics) {
  const record = buildMcpMetricsRecord(rawMcpMetrics);
  emitMcpMetrics(record);
  return record;
}

// Ingest a governance snapshot and score it.
function ingestGovernanceSnapshot(rawGovernanceMetrics) {
  const record = buildGovernanceMetricsRecord(rawGovernanceMetrics);
  emitGovernanceMetrics(record);
  return record;
}

module.exports = {
  ingestAgentTask,
  ingestMcpSnapshot,
  ingestGovernanceSnapshot
};
