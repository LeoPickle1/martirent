self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "MartiRent";

  const options = {
    body: data.body || "You have a MartiRent reminder.",
    icon: "/FF0E6064-9B55-4A97-B9CC-56D20652082E.png",
    badge: "/FF0E6064-9B55-4A97-B9CC-56D20652082E.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});