// TelemetryAgent – watches logs, anomalies, and failure events.

const BaseAgent = require('../templates/base-agent');

class TelemetryAgent extends BaseAgent {
  constructor(config) {
    super({ ...config, agent_class: 'telemetry' });
  }

  async runTelemetrySweep(logSnapshot) {
    const payload = { logs: logSnapshot };
    const result = await this.runTask('telemetry_sweep', payload);
    return result;
  }
}

module.exports = TelemetryAgent;
