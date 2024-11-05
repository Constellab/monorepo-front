export class CoAgentHelper {
  static isAgent(typingName: string): boolean {
    const agentTypingNames = [
      'TASK.gws_core.RCondaAgent',
      'TASK.gws_core.RMambaAgent',
      'TASK.gws_core.PyCondaAgent',
      'TASK.gws_core.PyMambaAgent',
      'TASK.gws_core.PyPipenvAgent',
      'TASK.gws_core.PyAgent',
      'TASK.gws_core.StreamlitAgent',
    ];
    return agentTypingNames.includes(typingName);
  }
}
