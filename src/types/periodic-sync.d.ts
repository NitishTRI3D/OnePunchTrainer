interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  getTags(): Promise<string[]>;
  unregister(tag: string): Promise<void>;
}

interface ServiceWorkerRegistration {
  periodicSync: PeriodicSyncManager;
} 