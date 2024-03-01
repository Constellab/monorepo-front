export class LtLiveTaskHelper{
  static isLiveTask(typingName: string): boolean {
    const liveTaskTypingNames = ['TASK.gws_core.RCondaLiveTask', 'TASK.gws_core.RMambaLiveTask', 'TASK.gws_core.PyCondaLiveTask',
      'TASK.gws_core.PyMambaLiveTask', 'TASK.gws_core.PyPipenvLiveTask', 'TASK.gws_core.PyLiveTask', 'TASK.gws_core.StreamlitLiveTask'];
    return liveTaskTypingNames.includes(typingName);
  }
}
