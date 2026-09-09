// DevOpsAgent – watches infra, services, and deployment health.

const BaseAgent = require('../templates/base-agent');

class DevOpsAgent extends BaseAgent {
  constructor(config) {
    super({ ...config, agent_class: 'devops' });
  }

  async runInfraCheck(infraSnapshot) {
    const payload = { infra: infraSnapshot };
    const result = await this.runTask('infra_check', payload);
    return result;
  }
}

module.exports = DevOpsAgent;
