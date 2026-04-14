// EventGo.ts

type EventHandler = (...args: any[]) => void;
type EventMap = {
  [eventName: string]: EventHandler[];
};

class EventGoClass {
  private events: EventMap = {};

  /**
   * 註冊事件監聽
   */
  on(eventName: string, handler: EventHandler): void {
    if (!this.events[eventName]) {
      this.events[eventName] = []; // ✅ 修正：原本誤寫為 event(eventName)
    }
    this.events[eventName].push(handler);
  }

  /**
   * 觸發事件
   */
  emit(eventName: string, ...args: any[]): void {
    const handlers = this.events[eventName];
    if (handlers) {
      // 複製陣列避免遍歷時被修改
      const copy = [...handlers];
      for (const handler of copy) {
        handler(...args);
      }
    }
  }

  /**
   * 移除特定監聽器
   */
  off(eventName: string, handler: EventHandler): void {
    const handlers = this.events[eventName];
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 移除某事件所有監聽器
   */
  offAll(eventName: string): void {
    delete this.events[eventName];
  }

  /**
   * 清空所有事件（例如遊戲重啟時）
   */
  clear(): void {
    this.events = {};
  }
}

export const EventGo = new EventGoClass();