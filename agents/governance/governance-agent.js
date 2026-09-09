// GovernanceAgent – manages proposals, governance metrics, and alerts.

const BaseAgent = require('../templates/base-agent');

class GovernanceAgent extends BaseAgent {
  constructor(config) {
    super({ ...config, agent_class: 'governance' });
  }

  async runGovernanceCycle(proposalsSnapshot) {
    const payload = { proposals: proposalsSnapshot };
    const result = await this.runTask('governance_cycle', payload);
    return result;
  }
}

module.exports = GovernanceAgent;
