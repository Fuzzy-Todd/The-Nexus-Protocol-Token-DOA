// ReplicationManager – decides when to spawn/retire agents based on scores and load.

const BaseAgent = require('../templates/base-agent');

class ReplicationManager extends BaseAgent {
  constructor(config) {
    super({ ...config, agent_class: 'replication_manager' });
  }

  async evaluateAndReplicate(agentMetricsSnapshot) {
    const payload = { metrics: agentMetricsSnapshot };
    const result = await this.runTask('replication_evaluation', payload);
    return result;
  }
}

module.exports = ReplicationManager;
