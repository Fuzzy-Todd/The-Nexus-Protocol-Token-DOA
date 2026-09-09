// /frontend/js/report-card.js
// Wires backend metrics into /frontend/pages/report-card.html.
// Assumes an API or WebSocket that provides JSON metrics.

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

async function loadGovernanceMetrics() {
  const data = await fetchJson('/api/metrics/governance/latest');

  document.getElementById('governanceScore').innerText =
    data.governance_score.toFixed(1);
  document.getElementById('proposalQuality').innerText =
    data.proposal_quality.toFixed(1);
  document.getElementById('executionReliability').innerText =
    data.execution_reliability.toFixed(1);
  document.getElementById('participationHealth').innerText =
    data.participation_health.toFixed(1);
}

async function loadMcpMetrics() {
  const data = await fetchJson('/api/metrics/mcp/latest');

  document.getElementById('mcpScore').innerText =
    data.mcp_score.toFixed(1);
  document.getElementById('mcpReliability').innerText =
    data.tool_calls ? ((data.tool_calls.successful_calls /
      (data.tool_calls.total_calls || 1)) * 100).toFixed(1) : '--';
  document.getElementById('mcpThroughput').innerText =
    data.throughput ? data.throughput.requests_per_second.toFixed(1) : '--';
  document.getElementById('mcpSafety').innerText =
    data.safety ? (data.safety.policy_compliant ? 'OK' : 'ISSUES') : '--';
}

async function loadAgentMetrics() {
  const agents = await fetchJson('/api/metrics/agents/latest');

  const tbody = document.getElementById('agentTableBody');
  tbody.innerHTML = '';

  agents.forEach(a => {
    const tr = document.createElement('tr');
    tr.className = 'agent-row';

    tr.innerHTML = `
      <td>${a.agent_id}</td>
      <td>${a.agent_class}</td>
      <td>${(a.task && a.task.success ? '100' : '0')}%</td>
      <td>${a.quality_score.toFixed(1)}</td>
      <td>${a.self_healing && a.self_healing.success ? 'OK' : 'NONE'}</td>
      <td>${a.policy_compliance && a.policy_compliance.compliant ? 'OK' : 'VIOLATIONS'}</td>
      <td class="${a.agent_score < 50 ? 'fail' : ''}">${a.agent_score.toFixed(1)}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadGpuMetrics() {
  const gpus = await fetchJson('/api/metrics/gpu/latest');
  const container = document.getElementById('gpuMetrics');
  container.innerHTML = '';

  gpus.forEach(g => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `
      <h3>Server ${g.server_id} / GPU ${g.gpu_id}</h3>
      <p>CUDA Utilization: ${g.cuda_utilization_pct.toFixed(1)}%</p>
      <p>VRAM Used: ${g.vram_used_mb.toFixed(1)} MB</p>
      <p>Vulkan Compute: ${g.vulkan_compute_ms.toFixed(1)} ms</p>
      <p>OpenCL Compute: ${g.opencl_compute_ms.toFixed(1)} ms</p>
    `;
    container.appendChild(card);
  });
}

async function loadLlmMetrics() {
  const llms = await fetchJson('/api/metrics/llm/latest');
  const container = document.getElementById('llmMetrics');
  container.innerHTML = '';

  llms.forEach(m => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `
      <h3>${m.model}</h3>
      <p>Tokens In: ${m.tokens_in}</p>
      <p>Tokens Out: ${m.tokens_out}</p>
      <p>Latency: ${m.latency_ms.toFixed(1)} ms</p>
    `;
    container.appendChild(card);
  });
}

async function loadFailureLog() {
  const failures = await fetchJson('/api/metrics/failures/latest');
  const tbody = document.getElementById('failureLog');
  tbody.innerHTML = '';

  failures.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${f.timestamp}</td>
      <td>${f.component}</td>
      <td>${f.error}</td>
      <td>${f.recovery}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadAll() {
  try {
    await Promise.all([
      loadGovernanceMetrics(),
      loadMcpMetrics(),
      loadAgentMetrics(),
      loadGpuMetrics(),
      loadLlmMetrics(),
      loadFailureLog()
    ]);
  } catch (err) {
    console.error('Failed to load report card data:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadAll);
