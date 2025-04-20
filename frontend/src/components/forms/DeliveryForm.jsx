const DeliveryForm = ({ selectedDelivery, setSelectedDelivery }) => {
  const paymentMethods = [
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Cash', value: 'cash' },
    { label: 'Online', value: 'online' }
  ];
  const deliveryTypes = [
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express' },
    { label: 'Overnight', value: 'overnight' }
  ];

  const deliveryStatuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Delivered', value: 'delivered' }
  ];


  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updatedDelivery = { ...selectedDelivery };
    let current = updatedDelivery;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    });

    setSelectedDelivery(updatedDelivery);
  };

  const renderInput = (label, path, value) => (
    <div className='input-field'>
      <label>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleChange(path, e.target.value)}
      />
    </div>
  );

  const renderDateTimeInput = (label, path, value) => (
    <div className='input-field'>
      <label>{label}</label>
      <input
        type="datetime-local"
        value={value ? value.slice(0, 16) : ''}
        onChange={(e) => handleChange(path, e.target.value)}
      />
    </div>
  );

  return (
    <div>
      <h2>Edit Delivery</h2>
      <div className='warehouse'>
        {renderInput("Warehouse Name", "warehouse.name", selectedDelivery?.warehouse?.name)}
        {renderInput("Warehouse Country", "warehouse.address.country", selectedDelivery?.warehouse?.address?.country)}
        {renderInput("Warehouse City", "warehouse.address.city", selectedDelivery?.warehouse?.address?.city)}
        {renderInput("Building Number", "warehouse.address.building_number", selectedDelivery?.warehouse?.address?.building_number)}
        {renderInput("Apartment Number", "warehouse.address.apartment_number", selectedDelivery?.warehouse?.address?.apartment_number)}
      </div>
      <div className='address'>
        {renderInput("Delivery Address Country", "Address.country", selectedDelivery?.Address?.country)}
        {renderInput("Delivery Address City", "Address.city", selectedDelivery?.Address?.city)}
        {renderInput("Street Name", "Address.street_name", selectedDelivery?.Address?.street_name)}
        {renderInput("Building Number", "Address.building_number", selectedDelivery?.Address?.building_number)}
        {renderInput("Apartment Number", "Address.apartment_number", selectedDelivery?.Address?.apartment_number)}
      </div>
      <div className='order'>
        {renderInput("Order Type", "order.order_type", selectedDelivery?.order?.order_type)}
        {renderInput("Order Description", "order.description", selectedDelivery?.order?.description)}
        {renderInput("Order Cost", "order.cost", selectedDelivery?.order?.cost)}
        {renderInput("Order Weight", "order.weight", selectedDelivery?.order?.weight)}
        {renderInput("Order Height", "order.height", selectedDelivery?.order?.height)}
        {renderInput("Order Length", "order.length", selectedDelivery?.order?.length)}
        {renderInput("Order Width", "order.width", selectedDelivery?.order?.width)}
        <div>
          <label>Select Payment Method</label>
          <select
            value={selectedDelivery?.order?.payment_method || ''}
            onChange={(e) =>
              setSelectedDelivery({
                ...selectedDelivery,
                order: {
                  ...selectedDelivery?.order,
                  payment_method: e.target.value
                }
              })
            }
          >
            {paymentMethods.map((method, index) => (
              <option key={index} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

      </div>
      <div className='delivery'>
        <div>
          <label>Select Delivery Type</label>
          <select
            value={selectedDelivery?.delivery_type || ''}
            onChange={(e) =>
              setSelectedDelivery({
                ...selectedDelivery,
                delivery_type: e.target.value
              })
            }
          >
            {deliveryTypes.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Delivery Status</label>
          <select
            value={selectedDelivery?.delivery_status || ''}
            onChange={(e) =>
              setSelectedDelivery({
                ...selectedDelivery,
                delivery_status: e.target.value
              })
            }
          >
            {deliveryStatuses.map((status, index) => (
              <option key={index} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        {renderInput("Delivery Cost", "delivery_cost", selectedDelivery?.delivery_cost)}
        <div>
          {renderDateTimeInput("Start Time", "startTime", selectedDelivery?.startTime)}
          {renderDateTimeInput("End Time", "endTime", selectedDelivery?.endTime)}
        </div>
        {renderInput("Desired Duration", "desired_duration", selectedDelivery?.desired_duration)}
      </div>
      {selectedDelivery?.Client && (
        <div className='client'>
          {renderInput("Client First Name", "Client.user.first_name", selectedDelivery?.Client?.user?.first_name)}
          {renderInput("Client Last Name", "Client.user.last_name", selectedDelivery?.Client?.user?.last_name)}
          {renderInput("Client Email", "Client.user.email", selectedDelivery?.Client?.user?.email)}
          {renderInput("Client Phone Number", "Client.user.phone_number", selectedDelivery?.Client?.user?.phone_number)}
        </div>
      )}
      {selectedDelivery?.courier && (
        <div className='courier'>
          {renderInput("Courier License Plate", "courier.license_plate", selectedDelivery?.courier?.license_plate)}
          {renderInput("Courier First Name", "courier.user.first_name", selectedDelivery?.courier?.user?.first_name)}
          {renderInput("Courier Last Name", "courier.user.last_name", selectedDelivery?.courier?.user?.last_name)}
          {renderInput("Courier Email", "courier.user.email", selectedDelivery?.courier?.user?.email)}
          {renderInput("Courier Phone Number", "courier.user.phone_number", selectedDelivery?.courier?.user?.phone_number)}
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;
