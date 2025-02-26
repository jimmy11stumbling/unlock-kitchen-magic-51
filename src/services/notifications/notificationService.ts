
const notificationSound = new Audio('/sounds/notification.mp3');

export const notificationService = {
  playSound() {
    notificationSound.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  },

  requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  },

  showNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
      this.playSound();
    }
  }
};
