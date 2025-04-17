export const normalizeOrderData = (order) => ({
  ...order,
  cost: parseFloat(order.cost),
  weight: parseFloat(order.weight),
  height: parseFloat(order.height),
  length: parseFloat(order.length),
  width: parseFloat(order.width),
});

export const normalizeDeliveryData = (delivery) => ({
  ...delivery,
  cost: parseFloat(delivery.cost),
  desired_duration: parseFloat(delivery.desired_duration),
});
