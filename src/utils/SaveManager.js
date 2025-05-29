export class SaveManager {
    constructor() {
        this.cookieName = 'gamified_learning_save';
        this.version = '1.0';
        this.cookieExpireDays = 365; // 1 year
    }

    // Save data to both cookie and localStorage
    saveData(data) {
        try {
            const saveData = {
                version: this.version,
                timestamp: Date.now(),
                data: data
            };

            const jsonString = JSON.stringify(saveData);
            
            // Save to localStorage (primary)
            localStorage.setItem(this.cookieName, jsonString);
            
            // Save to cookie (backup/cross-session)
            this.setCookie(this.cookieName, this.compressData(jsonString), this.cookieExpireDays);
            
            console.log('SaveManager: Data saved successfully');
            return true;
        } catch (error) {
            console.error('SaveManager: Error saving data:', error);
            return false;
        }
    }

    // Load data from localStorage or cookie
    loadData() {
        try {
            // Try localStorage first
            let jsonString = localStorage.getItem(this.cookieName);
            
            // If not found, try cookie
            if (!jsonString) {
                const cookieData = this.getCookie(this.cookieName);
                if (cookieData) {
                    jsonString = this.decompressData(cookieData);
                }
            }

            if (!jsonString) {
                console.log('SaveManager: No save data found');
                return null;
            }

            const saveData = JSON.parse(jsonString);
            
            // Check version compatibility
            if (saveData.version !== this.version) {
                console.log('SaveManager: Save data version mismatch, migrating...');
                return this.migrateSaveData(saveData);
            }

            console.log('SaveManager: Data loaded successfully');
            return saveData.data;
        } catch (error) {
            console.error('SaveManager: Error loading data:', error);
            return null;
        }
    }

    // Check if save data exists
    hasSaveData() {
        return localStorage.getItem(this.cookieName) !== null || this.getCookie(this.cookieName) !== null;
    }

    // Clear all save data
    clearSaveData() {
        try {
            localStorage.removeItem(this.cookieName);
            this.deleteCookie(this.cookieName);
            console.log('SaveManager: Save data cleared');
            return true;
        } catch (error) {
            console.error('SaveManager: Error clearing save data:', error);
            return false;
        }
    }

    // Get save data info without loading
    getSaveInfo() {
        try {
            let jsonString = localStorage.getItem(this.cookieName);
            
            if (!jsonString) {
                const cookieData = this.getCookie(this.cookieName);
                if (cookieData) {
                    jsonString = this.decompressData(cookieData);
                }
            }

            if (!jsonString) return null;

            const saveData = JSON.parse(jsonString);
            return {
                version: saveData.version,
                timestamp: saveData.timestamp,
                lastPlayed: new Date(saveData.timestamp).toLocaleDateString(),
                playerName: saveData.data?.character?.name || 'Unknown Player',
                weeksCompleted: saveData.data?.weeksCompleted?.length || 0,
                totalScore: saveData.data?.totalScore || 0,
                coinBalance: saveData.data?.coinBalance || 0
            };
        } catch (error) {
            console.error('SaveManager: Error getting save info:', error);
            return null;
        }
    }

    // Cookie management methods
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // Simple compression for cookie storage
    compressData(data) {
        try {
            // Simple base64 encoding (could be enhanced with actual compression)
            return btoa(encodeURIComponent(data));
        } catch (error) {
            console.error('SaveManager: Error compressing data:', error);
            return data;
        }
    }

    decompressData(data) {
        try {
            return decodeURIComponent(atob(data));
        } catch (error) {
            console.error('SaveManager: Error decompressing data:', error);
            return data;
        }
    }

    // Handle save data migration between versions
    migrateSaveData(oldSaveData) {
        console.log('SaveManager: Migrating save data from version', oldSaveData.version, 'to', this.version);
        
        // For now, just return the old data
        // In the future, this could handle data structure changes
        return oldSaveData.data;
    }

    // Auto-save functionality
    enableAutoSave(progressTracker, intervalMs = 30000) { // Auto-save every 30 seconds
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            if (progressTracker) {
                const data = progressTracker.getAllData();
                this.saveData(data);
                console.log('SaveManager: Auto-save completed');
            }
        }, intervalMs);

        console.log('SaveManager: Auto-save enabled');
    }

    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
            console.log('SaveManager: Auto-save disabled');
        }
    }

    // Export save data for backup
    exportSaveData() {
        const data = this.loadData();
        if (data) {
            const exportData = {
                version: this.version,
                timestamp: Date.now(),
                data: data
            };
            return JSON.stringify(exportData, null, 2);
        }
        return null;
    }

    // Import save data from backup
    importSaveData(jsonString) {
        try {
            const importData = JSON.parse(jsonString);
            if (importData.data) {
                return this.saveData(importData.data);
            }
            return false;
        } catch (error) {
            console.error('SaveManager: Error importing save data:', error);
            return false;
        }
    }
} 