// TreasuryAgent – monitors balances, flows, and risk.

const BaseAgent = require('../templates/base-agent');

class TreasuryAgent extends BaseAgent {
  constructor(config) {
    super({ ...config, agent_class: 'treasury' });
  }

  async runTreasuryCheck(stateSnapshot) {
    const payload = { state: stateSnapshot };
    const result = await this.runTask('treasury_check', payload);
    return result;
  }
}

module.exports = TreasuryAgent;
