import { format } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  const date = new Date(dateString);
  return format(date, 'MMMM dd, yyyy HH:mm:ss');
};

export const formatAddress = (address) => {
  if (!address) return 'No address';
  const { street_name, building_number, apartment_number, city, country } = address;
  const base = `${street_name} ${building_number}`;
  const apartment = apartment_number ? `, Apt. ${apartment_number}` : '';
  return `${base}${apartment}, ${city}, ${country}`;
};

export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatPaymentMethod = (paymentMethod) => {
  if (!paymentMethod) return '';
  return paymentMethod
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatPerson = (person) => {
  if (!person || !person.user) return 'No name';
  const { first_name, last_name } = person.user;
  return `${first_name} ${last_name}`;
};

export const formatUserFullName = (user) => {
  if (!user || !user.first_name || !user.last_name) return 'No name';
  const { first_name, last_name } = user;
  return `${first_name} ${last_name}`;
};

export const formatVehicle = (vehicle) => {
  if (!vehicle) return '';
  const { license_plate, model, transport_type } = vehicle;
  return `${license_plate} - ${model} (${transport_type})`;
};


export const formatDelivery = (delivery) => ({
  ...delivery,
  created_at: formatDate(delivery.created_at),
  updated_at: formatDate(delivery.updated_at),
  start_time: formatDate(delivery.start_time),
  end_time: formatDate(delivery.end_time),
  address: formatAddress(delivery.Address),
  warehouse: (
    <>
      <b>{delivery.warehouse.name}</b><br />
      {formatAddress(delivery.warehouse.address)}
    </>
  ),
  delivery_status: formatStatus(delivery.delivery_status),
  payment_method: formatPaymentMethod(delivery.payment_method),
  order: delivery.order.order_type,
  client: formatPerson(delivery.Client),
  courier: formatPerson(delivery.courier),
});

export const formatSchedule = (schedule) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeklySchedule = schedule?.CourierWeeklySchedule ?? [];

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };

  const scheduleDays = days.reduce((acc, day, index) => {
    const daySchedule = weeklySchedule.find(s => s.day_of_week === index + 1);
    if (daySchedule && daySchedule.start_time && daySchedule.end_time) {
      acc[day] = `${new Date(daySchedule.start_time).toLocaleTimeString('en-GB', timeOptions)} - ${new Date(daySchedule.end_time).toLocaleTimeString('en-GB', timeOptions)}`;
    } else {
      acc[day] = 'No Schedule';
    }
    return acc;
  }, {});

  scheduleDays.courier = formatUserFullName(schedule?.courier?.user);

  return scheduleDays;
};


export const formatOrder = (order) => ({
  ...order,
  payment_method: formatPaymentMethod(order.payment_method),
  created_at: formatDate(order.created_at),
  updated_at: formatDate(order.updated_at),
})

export const formatUsers = (user) => ({
  ...user,
  name: formatUserFullName(user),
  address: formatAddress(user.Client?.address),
  vehicle: formatVehicle(user.Courier?.vehicle),
  created_at: formatDate(user.created_at),
  updated_at: formatDate(user.updated_at),
})

export const formatWarehouse = (warehouse) => ({
  ...warehouse,
  name: warehouse.name,
  address: formatAddress(warehouse?.address),

})