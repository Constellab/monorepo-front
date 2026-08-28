import { Expose, Type } from 'class-transformer';

/**
 * Status of the Claude Code plugin served by the lab.
 * The enum can gain members: anything that is not handled must be treated as MCP_DISABLED.
 */
export type LiClaudePluginStatus = 'AVAILABLE' | 'MCP_DISABLED' | 'URL_NOT_SUPPORTED';

/**
 * Commands to copy verbatim into Claude Code.
 * They are built by the lab (the slug, id suffix and rename rules live there),
 * they must never be rebuilt on the front-end.
 */
export class LiClaudePluginCommands {
  @Expose({ name: 'add_marketplace' })
  addMarketplace: string;

  install: string;

  @Expose({ name: 'update_marketplace' })
  updateMarketplace: string;

  @Expose({ name: 'update_plugin' })
  updatePlugin: string;
}

/**
 * How to install the plugin on a lab the marketplace channel cannot serve (typically localhost):
 * a shell script runs on the developer's machine, downloads the archive and writes a local
 * marketplace whose plugin source is a filesystem path.
 * All fields are set whenever the block is present.
 */
export class LiClaudePluginDevInstall {
  /** One-liner for macOS, Linux and WSL */
  @Expose({ name: 'posix_command' })
  posixCommand: string;

  /** One-liner for PowerShell */
  @Expose({ name: 'windows_command' })
  windowsCommand: string;

  /** Where the bash script is served, to read before piping it into a shell */
  @Expose({ name: 'posix_script_url' })
  posixScriptUrl: string;

  @Expose({ name: 'windows_script_url' })
  windowsScriptUrl: string;

  @Expose({ name: 'plugin_name' })
  pluginName: string;

  version: string;

  /** Name of the local marketplace the script writes, always the lab's own name plus `-dev` */
  @Expose({ name: 'marketplace_name' })
  marketplaceName: string;

  /**
   * The script wires this through the claude CLI itself, so this is only its fallback for a
   * machine without the CLI on its PATH. The script prints it, numbered, when it needs it:
   * do not display it, or someone will run it before the script has created the folder.
   */
  install: string;

  /** Same fallback, printed by the script alongside {@link install} */
  @Expose({ name: 'update_marketplace' })
  updateMarketplace: string;
}

/**
 * Everything needed to connect Claude Code to this lab.
 * Only status, labName and minimumClaudeCodeVersion are always set.
 * `commands` and `devInstall` are mutually exclusive and follow the status:
 * commands on AVAILABLE, devInstall on URL_NOT_SUPPORTED, neither on MCP_DISABLED.
 * Branch on the status, never on the presence of a field.
 */
export class LiClaudePluginInfo {
  status: LiClaudePluginStatus;

  @Expose({ name: 'lab_name' })
  labName: string;

  @Expose({ name: 'minimum_claude_code_version' })
  minimumClaudeCodeVersion: string;

  @Expose({ name: 'marketplace_name' })
  marketplaceName?: string;

  @Expose({ name: 'marketplace_url' })
  marketplaceUrl?: string;

  @Expose({ name: 'plugin_name' })
  pluginName?: string;

  /**
   * Opaque `<gws_core version>+<fingerprint>`, it is not a semver: display it, never compare it
   */
  version?: string;

  @Expose({ name: 'mcp_url' })
  mcpUrl?: string;

  @Type(() => LiClaudePluginCommands)
  commands?: LiClaudePluginCommands;

  @Expose({ name: 'dev_install' })
  @Type(() => LiClaudePluginDevInstall)
  devInstall?: LiClaudePluginDevInstall;

  public isAvailable(): boolean {
    return this.status === 'AVAILABLE';
  }

  public isUrlNotSupported(): boolean {
    return this.status === 'URL_NOT_SUPPORTED';
  }

  /**
   * True for MCP_DISABLED and for any status this front-end does not know about
   */
  public isMcpDisabled(): boolean {
    return !this.isAvailable() && !this.isUrlNotSupported();
  }
}
