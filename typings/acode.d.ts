type Strings = string[];
declare var acode: Acode;

interface WCPage extends HTMLElement {
  on(event: "hide" | "show", cb: (this: WCPage) => void): void;
  off(event: "hide" | "show", cb: (this: WCPage) => void): void;

  settitle(title: string): void;

  id: string;

  hide(): void;
  show(): void;

  get body(): HTMLElement | null;
  set body($el: HTMLElement | null);

  get innerHTML(): string;
  set innerHTML(html: string);

  get textContent(): string | null;
  set textContent(text: string);

  get lead(): HTMLElement;
  set lead($el: HTMLElement);

  get header(): HTMLElement;
  set header($el: HTMLElement);
}

interface Input {
  id: string;
  required?: boolean;
  type: string;
  match?: RegExp;
  value?: string;
  placeholder?: string;
  hints?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autofocus?: boolean;
  hidden?: boolean;
  onclick?: (event: Event) => void;
  onchange?: (event: Event) => void;
}

/**
 * Options for a notification.
 */
interface NotificationOptions {
  /**
   * Icon for the notification, can be a URL or a base64 encoded image or icon class or svg string.
   */
  icon?: string;
  /**
   * Whether notification should auto close.
   * @default true
   */
  autoClose?: boolean;
  /**
   * Action callback when notification is clicked.
   * @default null
   */
  action?: (() => void) | null;
  /**
   * Type of notification.
   * @default 'info'
   */
  type?: 'info' | 'warning' | 'error' | 'success';
}

interface FileInfo {
  uri: string; // The URI or path to the file
  name: string; // The file name
  stats: FsStat;
  readOnly: boolean;
  options: Object;
}

/**
 * Configuration for a file type handler.
 */
interface FileHandlerOptions {
  /**
   * File extensions to handle (without dots).
   */
  extensions: string[];
  /**
   * Async function to handle the file.
   * This function will be called when a file with one of the specified extensions is opened.
   */
  handleFile: (fileInfo: FileInfo) => Promise<void>;
}

interface Acode {
  /**
   * Define a module
   * @param {string} name
   * @param {Object|function} module
   */
  define(name: string, module: Object | Function): void;

  require(module: "fsOperation"): FsOperation;
  require(module: "loader"): LoaderDialog;
  require(module: "prompt"): PromptDialog;
  require(module: "alert"): AlertDialog;
  require(module: "fileBrowser"): FileBrowser;
  require(module: string): any; // Allow other modules

  exec(key: string, val: any): boolean | undefined;

  get exitAppMessage(): string | undefined;

  setLoadingMessage(message: string): void;

  setPluginInit(
    id: string,
    initFunction: (
      baseUrl: string,
      $page: WCPage,
      options?: any
    ) => Promise<void>,
    settings?: any
  ): void;

  getPluginSettings(id: string): any;

  setPluginUnmount(id: string, unmountFunction: () => void): void;

  /**
   * @param {string} id plugin id
   * @param {string} baseUrl local plugin url
   * @param {WCPage} $page
   */
  initPlugin(
    id: string,
    baseUrl: string,
    $page: WCPage,
    options?: any
  ): Promise<void>;

  unmountPlugin(id: string): void;

  registerFormatter(
    id: string,
    extensions: string[],
    format: () => Promise<void>
  ): void;

  unregisterFormatter(id: string): void;

  format(selectIfNull?: boolean): Promise<void>;

  fsOperation(file: string): any;

  newEditorFile(filename: string, options?: any): void;

  // readonly formatters(): { id: string; name: string; exts: string[] }[];

  /**
   * @param {string[]} extensions
   * @returns {Array<[id: string, name: string]>} options
   */
  getFormatterFor(extensions: string[]): [id: string, name: string][];

  alert(title: string, message: string, onhide: () => void): void;

  loader(
    title: string,
    message: string,
    cancel: { timeout: number; callback: () => void }
  ): void;

  joinUrl(...args: string[]): string;

  addIcon(className: string, src: string): void;

  prompt(
    message: string,
    defaultValue: string,
    type: "textarea" | "text" | "number" | "tel" | "search" | "email" | "url",
    options?: {
      match: RegExp;
      required: boolean;
      placeholder: string;
      test: (value: string) => boolean;
    }
  ): Promise<any>;

  confirm(title: string, message: string): Promise<boolean>;

  select(
    title: string,
    options: [string, string, string, boolean][] | string,
    opts?:
      | {
          onCancel?: () => void;
          onHide?: () => void;
          hideOnSelect?: boolean;
          textTransform?: boolean;
          default?: string;
        }
      | boolean
  ): Promise<any>;

  multiPrompt(
    title: string,
    inputs: Array<Input | Input[]>,
    help: string
  ): Promise<Strings>;

  fileBrowser(
    mode: "file" | "folder" | "both",
    info: string,
    doesOpenLast: boolean
  ): Promise<
    | {
        name: string;
        type: "file";
        url: string;
      }
    | {
        list: {
          icon: string;
          isDirectory: boolean;
          isFile: boolean;
          mime: string;
          name: string;
          type: "file" | "folder";
          uri: string;
          url: string;
        }[];
        scroll: number;
        name: string;
        type: "folder";
        url: string;
      }
  >;

  toInternalUrl(url: string): Promise<string>;

  /**
  * Installs an Acode plugin from registry
  * @param pluginId id of the plugin to install
  * @param installerPluginName Name of plugin attempting to install
  * @returns {Promise<void>}
  */
  installPlugin(pluginId: string, installerPluginName: string): Promise<void>;

  /**
  * Push a notification
  * @param title Title of the notification
  * @param message Message body of the notification
  * @param options Notification options
  */
  pushNotification(
    title: string,
    message: string,
    options?: NotificationOptions
  ): void;

  /**
  * Register a file type handler
  * @param id - Unique identifier for the handler
  * @param options - Handler options
  * @throws {Error} If id is already registered or required options are missing
  */
  registerFileHandler(id: string, options: FileHandlerOptions): void;

  /**
  * Unregister a file type handler
  * @param id The handler id to remove
  */
  unregisterFileHandler(id: string): void;
}
