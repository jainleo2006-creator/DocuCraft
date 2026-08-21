type Listener = (isLoading: boolean) => void;

class LoadingManager {
  private activeRequests = 0;
  private listeners: Set<Listener> = new Set();

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public startLoading() {
    this.activeRequests++;
    this.notify();
  }

  public stopLoading() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.notify();
  }

  private notify() {
    const isLoading = this.activeRequests > 0;
    this.listeners.forEach((l) => l(isLoading));
  }
}

export const loadingManager = new LoadingManager();
