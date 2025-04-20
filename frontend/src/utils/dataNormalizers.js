export const normalizeOrderData = (order) => ({
  orderType: order.order_type,
  description: order.description,
  paymentMethod: order.payment_method,
  cost: parseFloat(order.cost),
  weight: parseFloat(order.weight),
  height: parseFloat(order.height),
  length: parseFloat(order.length),
  width: parseFloat(order.width),
});

export const normalizeDeliveryData = (delivery) => ({
  deliveryCost: delivery.cost ? parseFloat(delivery.cost) : 0,
  desiredDuration: delivery.desired_duration ? parseFloat(delivery.desired_duration) : null,
  orderId: delivery.order_id ?? null,
  courierId: delivery.courier_id ?? null,
  clientId: delivery.client_id ?? null,
  addressId: delivery.address_id ?? null,
  deliveryType: delivery.delivery_type || '',
  paymentMethod: delivery.payment_method || '',
  deliveryStatus: delivery.delivery_status || '',
  startTime: delivery.start_time ?? null,
  endTime: delivery.end_time ?? null,
  warehouseId: delivery.warehouse_id ?? null,
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

export const normalizeWarehouseData = (warehouse) => ({
  name: warehouse.name,
  contactNumber: warehouse.contact_number,
  addressId: warehouse.address_id
});

export const normalizeClientData = (client) => ({
  name: warehouse.name,
  contactNumber: warehouse.contact_number,
  addressId: warehouse.address_id
});