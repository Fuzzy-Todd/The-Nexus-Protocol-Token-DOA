// /agents/core/agent-brain.js
// Nexus Protocol Token DAO – Shared Intelligence Module
// Every agent uses this to become adaptive, self-healing, policy-aware, and hardware-aware.

const AgentScheduler = require('./agent-scheduler');
const AgentPolicy = require('./agent-policy');
const AgentMemory = require('./agent-memory');

class AgentBrain {
  constructor(config) {
    this.agent_id = config.agent_id;
    this.agent_class = config.agent_class;
    this.server_id = config.server_id;
    this.gpu_id = config.gpu_id;
    this.model = config.model;

    this.memory = new AgentMemory(this.agent_id);
    this.scheduler = new AgentScheduler(this.server_id);
    this.policy = new AgentPolicy();
  }

  /**
   * Decide the best completion method dynamically.
   * Uses GPU load, LLM latency, policy constraints, and historical performance.
   */
  decideCompletionMethod(taskType) {
    const gpuLoad = this.scheduler.getGpuLoad(this.gpu_id);
    const llmLatency = this.scheduler.getModelLatency(this.model);
    const history = this.memory.getRecentPerformance();

    // Basic adaptive logic
    if (gpuLoad > 85) {
      return 'llama_only';
    }

    if (llmLatency > 150) {
      return 'cuda_preprocess+llama';
    }

    if (history.failRate > 0.3) {
      return 'replicated_agents+llama';
    }

    return 'cuda_preprocess+llama';
  }

  /**
   * Apply policy checks and adjust behavior if needed.
   */
  enforcePolicy(llmUsage, mcpCalls) {
    const violations = this.policy.check({
      llmUsage,
      mcpCalls
    });

    return {
      compliant: violations.length === 0,
      violations
    };
  }

  /**
   * Self-healing logic for failed tasks.
   */
  async selfHeal(error) {
    const classified = this.policy.classifyError(error);

    // Basic healing strategies
    if (classified === 'llm_timeout') {
      await this.scheduler.switchToFasterModel();
      return { attempted: true, success: true, recovery_time_ms: 50 };
    }

    if (classified === 'gpu_overload') {
      await this.scheduler.migrateToLowerLoadGpu();
      return { attempted: true, success: true, recovery_time_ms: 120 };
    }

    // No healing strategy available
    return { attempted: true, success: false, recovery_time_ms: null };
  }

  /**
   * Decide whether replication is needed.
   */
  evaluateReplication(agentScore) {
    if (agentScore < 40) {
      return {
        requested: true,
        reason: 'low_score',
        spawned_agent_id: null
      };
    }

    if (agentScore > 90) {
      return {
        requested: true,
        reason: 'scale_out',
        spawned_agent_id: null
      };
    }

    return {
      requested: false,
      reason: null,
      spawned_agent_id: null
    };
  }

  /**
   * Record task performance into memory.
   */
  recordTaskPerformance(task, score) {
    this.memory.record({
      duration: task.duration_ms,
      success: task.success,
      score
    });
  }
}

module.exports = AgentBrain;
