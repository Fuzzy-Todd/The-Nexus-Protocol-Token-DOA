// LlmOrchestratorAgent – chooses models, routes prompts, and tracks LLM performance.

const BaseAgent = require('../templates/base-agent');

class LlmOrchestratorAgent extends BaseAgent {
  constructor(config) {
    super({ ...config, agent_class: 'llm_orchestrator' });
  }

  async runInference(prompt, context = {}) {
    const payload = { prompt, context };
    const result = await this.runTask('llm_inference', payload);
    return result;
  }
}

module.exports = LlmOrchestratorAgent;
