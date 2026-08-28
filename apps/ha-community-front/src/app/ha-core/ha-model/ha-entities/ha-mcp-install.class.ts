import { Type } from 'class-transformer';

/**
 * One step of the Claude Code install, in the order the back-end returns them.
 * The numbering is the position in the list, it is not carried by the step.
 */
export class HaMcpInstallStep {
  /**
   * Command to paste verbatim in a terminal.
   * Null when the step happens inside Claude Code and there is nothing to copy:
   * only the description is then shown.
   */
  command: string | null;

  description: string;
}

/**
 * Everything needed to connect Claude Code to Community, from the public GET /mcp/install.
 * The commands are built by the back-end (they embed the api url of this environment),
 * they must never be rebuilt on the front-end.
 */
export class HaMcpInstall {
  pluginName: string;

  marketplace: string;

  apiUrl: string;

  mcpEndpointUrl: string;

  @Type(() => HaMcpInstallStep)
  steps: HaMcpInstallStep[];
}
