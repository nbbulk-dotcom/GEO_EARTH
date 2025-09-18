import CryptoJS from 'crypto-js';
import axios from 'axios';

const UI_PASSWORD = 'nicolas';
const STORAGE_KEY = 'brett_ui_config';

export interface UIConfig {
  selectedSystem?: string;
  lastLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  preferences?: {
    theme: string;
    language: string;
    notifications: boolean;
  };
  dashboardLayout?: Record<string, any>;
}

export class UIConfigService {
  private static instance: UIConfigService;
  private isLocked: boolean = true;
  private encryptionKey: string;

  private constructor() {
    this.encryptionKey = CryptoJS.SHA256(UI_PASSWORD).toString();
  }

  public static getInstance(): UIConfigService {
    if (!UIConfigService.instance) {
      UIConfigService.instance = new UIConfigService();
    }
    return UIConfigService.instance;
  }

  public async authenticate(password: string): Promise<boolean> {
    if (password === UI_PASSWORD) {
      this.isLocked = false;
      return true;
    } else {
      await this.logFailedAttempt(password);
      return false;
    }
  }

  public lock(): void {
    this.isLocked = true;
  }

  public isUILocked(): boolean {
    return this.isLocked;
  }

  public encryptData(data: any): string {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, this.encryptionKey).toString();
    return encrypted;
  }

  public decryptData(encryptedData: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }

  public saveToLocalStorage(config: UIConfig): void {
    try {
      const encryptedConfig = this.encryptData(config);
      localStorage.setItem(STORAGE_KEY, encryptedConfig);
    } catch (error) {
      console.error('Failed to save config to localStorage:', error);
    }
  }

  public loadFromLocalStorage(): UIConfig | null {
    try {
      const encryptedConfig = localStorage.getItem(STORAGE_KEY);
      if (!encryptedConfig) return null;
      
      return this.decryptData(encryptedConfig);
    } catch (error) {
      console.error('Failed to load config from localStorage:', error);
      return null;
    }
  }

  public async saveToBackend(config: UIConfig): Promise<boolean> {
    try {
      const response = await axios.post('/api/ui-config', {
        config: this.encryptData(config),
        timestamp: new Date().toISOString()
      });
      return response.status === 200;
    } catch (error) {
      console.error('Failed to save config to backend:', error);
      return false;
    }
  }

  public async loadFromBackend(): Promise<UIConfig | null> {
    try {
      const response = await axios.get('/api/ui-config');
      if (response.data && response.data.config) {
        return this.decryptData(response.data.config);
      }
      return null;
    } catch (error) {
      console.error('Failed to load config from backend:', error);
      return null;
    }
  }

  public async updateConfig(updates: Partial<UIConfig>, password?: string): Promise<boolean> {
    if (this.isLocked && (!password || password !== UI_PASSWORD)) {
      await this.logFailedAttempt(password || '');
      return false;
    }

    try {
      const currentConfig = this.loadFromLocalStorage() || {};
      const newConfig = { ...currentConfig, ...updates };
      
      this.saveToLocalStorage(newConfig);
      await this.saveToBackend(newConfig);
      
      await this.logConfigChange('UPDATE', newConfig);
      return true;
    } catch (error) {
      console.error('Failed to update config:', error);
      return false;
    }
  }

  public async resetConfig(password: string): Promise<boolean> {
    if (password !== UI_PASSWORD) {
      await this.logFailedAttempt(password);
      return false;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
      await this.logConfigChange('RESET', {});
      return true;
    } catch (error) {
      console.error('Failed to reset config:', error);
      return false;
    }
  }

  private async logFailedAttempt(password: string): Promise<void> {
    try {
      await axios.post('/api/ui-config/log', {
        action: 'FAILED_AUTH',
        password_provided: password,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        success: false
      });

      await this.notifyAdmin(`Failed UI access attempt with password: "${password}" at ${new Date().toISOString()}`);
    } catch (error) {
      console.error('Failed to log attempt:', error);
    }
  }

  private async logConfigChange(action: string, config: any): Promise<void> {
    try {
      await axios.post('/api/ui-config/log', {
        action,
        config_data: JSON.stringify(config),
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        success: true
      });
    } catch (error) {
      console.error('Failed to log config change:', error);
    }
  }

  private async notifyAdmin(message: string): Promise<void> {
    try {
      await axios.post('/api/admin/notify', {
        message,
        type: 'security_alert',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to notify admin:', error);
    }
  }

  public getDefaultConfig(): UIConfig {
    return {
      selectedSystem: undefined,
      lastLocation: undefined,
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true
      },
      dashboardLayout: {}
    };
  }
}

export const uiConfigService = UIConfigService.getInstance();
