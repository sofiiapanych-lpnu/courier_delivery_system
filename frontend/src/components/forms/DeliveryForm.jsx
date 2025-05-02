import './Form.css';

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

  const renderInput = (label, path, value, type = "text") => (
    <div className={`input-field input-field-${type}`}>
      <label>{label}</label>
      <input
        type={type}
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

      <div className='section'>
        <h3>Warehouse Information</h3>
        <div className='warehouse'>
          <div className='row'>
            {renderInput("Name", "warehouse.name", selectedDelivery?.warehouse?.name)}
          </div>
          <div className='row'>
            {renderInput("Country", "warehouse.address.country", selectedDelivery?.warehouse?.address?.country)}
            {renderInput("City", "warehouse.address.city", selectedDelivery?.warehouse?.address?.city)}
          </div>
          <div className='row'>
            {renderInput("Street Name", "warehouse.address.street_name", selectedDelivery?.warehouse?.address?.street_name)}
            {renderInput("Building Number", "warehouse.address.building_number", selectedDelivery?.warehouse?.address?.building_number, "number")}
            {renderInput("Apartment Number", "warehouse.address.apartment_number", selectedDelivery?.warehouse?.address?.apartment_number, "number")}
          </div>
        </div>
      </div>

      <div className='section'>
        <h3>Delivery Address</h3>
        <div className='address'>
          <div className='row'>
            {renderInput("Country", "Address.country", selectedDelivery?.Address?.country)}
            {renderInput("City", "Address.city", selectedDelivery?.Address?.city)}
          </div>
          <div className='row'>
            {renderInput("Street Name", "Address.street_name", selectedDelivery?.Address?.street_name)}
            {renderInput("Building Number", "Address.building_number", selectedDelivery?.Address?.building_number, "number")}
            {renderInput("Apartment Number", "Address.apartment_number", selectedDelivery?.Address?.apartment_number, "number")}
          </div>
        </div>
      </div>

      <div className='section'>
        <h3>Order Information</h3>
        <div className='order'>
          <div className='row'>
            {renderInput("Order Type", "order.order_type", selectedDelivery?.order?.order_type)}
            {renderInput("Order Description", "order.description", selectedDelivery?.order?.description)}
          </div>
          <div className='row'>
            {renderInput("Order Weight", "order.weight", selectedDelivery?.order?.weight, "number")}
            <div className="input-spacing"></div>
            {renderInput("Order Height", "order.height", selectedDelivery?.order?.height, "number")}
            {renderInput("Order Length", "order.length", selectedDelivery?.order?.length, "number")}
            {renderInput("Order Width", "order.width", selectedDelivery?.order?.width, "number")}
          </div>
          <div className='row'>
            <div className='input-field'>
              <label>Payment Method</label>
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
            {renderInput("Order Cost", "order.cost", selectedDelivery?.order?.cost, "number")}
          </div>
        </div>
      </div>

      <div className='section'>
        <h3>Delivery Details</h3>
        <div className='delivery'>
          <div className='row'>
            <div className='input-field'>
              <label>Delivery Type</label>
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
            <div className='input-field'>
              <label>Delivery Status</label>
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
          </div>

          <div className='row'>
            <div className='input-field'>
              <label>Payment Method</label>
              <select
                value={selectedDelivery?.payment_method || ''}
                onChange={(e) =>
                  setSelectedDelivery({
                    ...selectedDelivery,
                    payment_method: e.target.value
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
            {renderInput("Delivery Cost", "delivery_cost", selectedDelivery?.delivery_cost, "number")}
          </div>

          <div className='row'>
            {renderDateTimeInput("Start Time", "startTime", selectedDelivery?.startTime)}
            {renderDateTimeInput("End Time", "endTime", selectedDelivery?.endTime)}
            {renderInput("Desired Duration", "desired_duration", selectedDelivery?.desired_duration)}
          </div>
        </div>
      </div>

      <div className='section'>
        {selectedDelivery?.Client && (
          <div className='client'>
            <h3>Client Information</h3>
            <div className='row'>
              {renderInput("First Name", "Client.user.first_name", selectedDelivery?.Client?.user?.first_name)}
              {renderInput("Last Name", "Client.user.last_name", selectedDelivery?.Client?.user?.last_name)}
            </div>
            <div className='row'>
              {renderInput("Email", "Client.user.email", selectedDelivery?.Client?.user?.email)}
              {renderInput("Phone Number", "Client.user.phone_number", selectedDelivery?.Client?.user?.phone_number)}
            </div>
          </div>
        )}
      </div>

      <div className='section'>
        {selectedDelivery?.courier && (
          <div className='courier'>
            <h3>Courier Information</h3>
            <div className='row'>
              {renderInput("First Name", "courier.user.first_name", selectedDelivery?.courier?.user?.first_name)}
              {renderInput("Last Name", "courier.user.last_name", selectedDelivery?.courier?.user?.last_name)}
            </div>
            <div className='row'>
              {renderInput("Email", "courier.user.email", selectedDelivery?.courier?.user?.email)}
              {renderInput("Phone Number", "courier.user.phone_number", selectedDelivery?.courier?.user?.phone_number)}
            </div>
            {renderInput("License Plate", "courier.license_plate", selectedDelivery?.courier?.license_plate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryForm;
