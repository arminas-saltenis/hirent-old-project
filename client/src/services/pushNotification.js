import { MODIFY } from './api-service';

class pushNotification {
  constructor() {
    this.publicVapidKey = 'BPLqO7feCBth7aqW8C6UpHbDcLuCBdmlOa4Truqa13mUDIAD3Qm6Q5XcCcO7o1QTTqYVqGyq73VwRYh1W8AVWOs';
  }

  async registerPushNotification(userId) {
    await navigator.serviceWorker.ready.then(async serviceWorker => {
      const subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey)
      });

      MODIFY('notifications/subscribe', 'POST', {subscription, userId});
    })
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export default new pushNotification();