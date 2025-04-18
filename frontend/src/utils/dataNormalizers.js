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

export const normalizeUserData = (user) => ({
  userId: user.user_id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  phoneNumber: user.phone_number,
  role: user.role,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
  hash: user.hash,
});

export const normalizeAddressData = (address) => ({
  streetName: address.street_name,
  buildingNumber: parseInt(address.building_number),
  apartmentNumber: address.apartment_number
    ? parseInt(address.apartment_number)
    : null,
  city: address.city,
  country: address.country,
});

export const normalizeVehicleData = (vehicle) => ({
  licensePlate: vehicle.license_plate,
  model: vehicle.model,
  transportType: vehicle.transport_type,
  isCompanyOwner: vehicle.is_company_owner,
});
