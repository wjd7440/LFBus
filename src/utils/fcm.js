export const expoPush = async ({ deviceToken, notification }) => {
  const message = {
    to: deviceToken,
    sound: "default",
    ...notification,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
