export enum EduBridgeOperation {
  init = 'init', //初始化页面
  pageChange = 'pageChange', //切换页面
  modeChange = 'modeChange', //模式切换
  broadcast = 'broadcast', //广播消息
}

export enum EduClientMode {
  preview = 1, //普通的预览整个ppt的模式
  exec, //练习模式（ppt小窗的那个模式）
}

export interface EduPageBridge {
  operation: EduBridgeOperation;
}

export interface EduPageInit extends EduPageBridge {
  current: number; //当前页数
  total: number; //总页数
}

export interface EduPageChange extends EduPageInit {}

export interface EduModeChange extends EduPageBridge {
  mode: EduClientMode;
}

export class PageInfo {
  current: number = 0;
  total: number = 0;
}

export class IFrameBridge {
  pageInfo: PageInfo = new PageInfo();
  loaded: boolean = false;
  //当前模式
  curMode: EduClientMode = EduClientMode.preview;

  constructor() {}

  private _messageHandler: ((...args: any[]) => void) | undefined = undefined;

  private _registerEvent() {
    this._messageHandler = this._onMessage.bind(this);
    window.addEventListener('message', this._messageHandler);
  }

  private _postMessage(message: EduPageBridge) {
    //todo:这个后续要根据id去获取对应的 iframe
    let win = window.frames[2];
    if (win) {
      win.postMessage(message, '*');
    }
  }

  private _onMessage(event: any) {
    let data = event.data;
    if (!data.operation) return;
    const opt = data.operation;
    delete data.operation;
    switch (opt) {
      //页面初始化
      case EduBridgeOperation.init:
        this.pageInfo.current = data.current;
        this.pageInfo.total = data.total;
        this.loaded = true;
        break;
      //页面切换
      case EduBridgeOperation.pageChange:
        this.pageInfo.current = data.current;
        this.pageInfo.total = data.total;
        break;
      //模式切换，
      // todo:这边切换了模式之后，界面的模式需要跟着切换
      case EduBridgeOperation.modeChange:
        this.curMode = data.mode;
        break;
    }
  }

  setup() {
    this._registerEvent();
  }

  teardown() {
    if (this._messageHandler) {
      window.removeEventListener('message', this._messageHandler);
    }
  }

  /**
   * 下一页
   */
  nextPage() {
    if (this.pageInfo.current >= this.pageInfo.total) return;
    this.goPage(++this.pageInfo.current);
  }

  /**
   * 上一页
   */
  prePage() {
    if (this.pageInfo.current <= 1) return;
    this.goPage(--this.pageInfo.current);
  }

  /**
   * 跳转到页面
   * @param index
   */
  goPage(index: number) {
    let pageInfo: EduPageChange = {
      total: this.pageInfo.total,
      current: index,
      operation: EduBridgeOperation.pageChange,
    };
    this._postMessage(pageInfo);
  }
}

// export const iFrameBridge = new IFrameBridge();
