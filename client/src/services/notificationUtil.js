class Notifications {
  pushNotification(notificationRef, message, type) {
    notificationRef.current.addNotification({
      message: message,
      type: type,
      insert: "top",
      container: "top-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 3000 },
      dismissable: { click: true }
    });
  }
}

export default new Notifications();