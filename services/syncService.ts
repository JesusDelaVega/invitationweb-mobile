// Sync Service - Offline support with sync queue
import NetInfo from '@react-native-community/netinfo';
import { StorageService } from './storage';
import { ApiService } from './api';

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: 'project' | 'image' | 'rsvp';
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

const SYNC_QUEUE_KEY = 'sync_queue';
const MAX_RETRIES = 3;

class SyncService {
  private syncQueue: SyncOperation[] = [];
  private isSyncing = false;
  private isOnline = true;
  private netInfoSubscription: any = null;

  /**
   * Initialize sync service
   */
  async initialize(): Promise<void> {
    // Load sync queue from storage
    await this.loadSyncQueue();

    // Listen for network status changes
    this.netInfoSubscription = NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      // If we just came online, process queue
      if (wasOffline && this.isOnline) {
        console.log('Network restored, processing sync queue');
        this.processQueue();
      }
    });

    // Check initial network status
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected ?? false;

    // Process queue if online
    if (this.isOnline) {
      this.processQueue();
    }
  }

  /**
   * Add operation to sync queue
   */
  async addToQueue(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retries' | 'maxRetries'>): Promise<void> {
    const syncOp: SyncOperation = {
      ...operation,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: MAX_RETRIES,
    };

    this.syncQueue.push(syncOp);
    await this.saveSyncQueue();

    // Try to process immediately if online
    if (this.isOnline) {
      this.processQueue();
    }
  }

  /**
   * Process sync queue
   */
  async processQueue(): Promise<void> {
    if (this.isSyncing || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      const operations = [...this.syncQueue];

      for (const operation of operations) {
        try {
          await this.executeOperation(operation);

          // Remove from queue on success
          this.syncQueue = this.syncQueue.filter(op => op.id !== operation.id);
        } catch (error) {
          console.error('Error executing sync operation:', error);

          // Increment retry count
          const opIndex = this.syncQueue.findIndex(op => op.id === operation.id);
          if (opIndex !== -1) {
            this.syncQueue[opIndex].retries++;

            // Remove if max retries exceeded
            if (this.syncQueue[opIndex].retries >= this.syncQueue[opIndex].maxRetries) {
              console.error('Max retries exceeded for operation:', operation);
              this.syncQueue.splice(opIndex, 1);
            }
          }
        }
      }

      // Save updated queue
      await this.saveSyncQueue();
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Execute a sync operation
   */
  private async executeOperation(operation: SyncOperation): Promise<void> {
    const { type, resource, data } = operation;

    switch (resource) {
      case 'project':
        if (type === 'create') {
          await ApiService.projects.create(data);
        } else if (type === 'update') {
          await ApiService.projects.update(data.id, data);
        } else if (type === 'delete') {
          await ApiService.projects.delete(data.id);
        }
        break;

      case 'image':
        // Handle image uploads
        if (type === 'create') {
          // TODO: Implement image upload sync
        }
        break;

      case 'rsvp':
        // Handle RSVP submissions
        if (type === 'create') {
          // TODO: Implement RSVP sync
        }
        break;
    }
  }

  /**
   * Load sync queue from storage
   */
  private async loadSyncQueue(): Promise<void> {
    const queue = StorageService.getJSON<SyncOperation[]>(SYNC_QUEUE_KEY);
    this.syncQueue = queue || [];
  }

  /**
   * Save sync queue to storage
   */
  private async saveSyncQueue(): Promise<void> {
    StorageService.setJSON(SYNC_QUEUE_KEY, this.syncQueue);
  }

  /**
   * Get sync queue status
   */
  getSyncStatus(): {
    isOnline: boolean;
    isSyncing: boolean;
    queueLength: number;
    pendingOperations: SyncOperation[];
  } {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      pendingOperations: this.syncQueue,
    };
  }

  /**
   * Clear sync queue
   */
  async clearQueue(): Promise<void> {
    this.syncQueue = [];
    await this.saveSyncQueue();
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.netInfoSubscription) {
      this.netInfoSubscription();
      this.netInfoSubscription = null;
    }
  }
}

export const syncService = new SyncService();
export default syncService;
