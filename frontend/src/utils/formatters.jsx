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

export const formatPerson = (person) => {
  if (!person || !person.user) return 'No name';
  const { first_name, last_name } = person.user;
  return `${first_name} ${last_name}`;
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
  order: delivery.order.order_type,
  client: formatPerson(delivery.Client),
  courier: formatPerson(delivery.courier),
});
