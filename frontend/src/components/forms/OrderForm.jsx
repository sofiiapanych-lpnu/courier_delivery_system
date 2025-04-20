const OrderForm = ({ selectedOrder, setSelectedOrder }) => {
  const paymentMethods = [
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Cash', value: 'cash' },
    { label: 'Online', value: 'online' }
  ];

  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updatedOrder = { ...selectedOrder };
    let current = updatedOrder;

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

    setSelectedOrder(updatedOrder);
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

  return (
    <div>
      <h2>Edit Order</h2>
      <div className='order'>
        {renderInput("Order Type", "order_type", selectedOrder?.order_type)}
        {renderInput("Order Description", "description", selectedOrder?.description)}
        {renderInput("Order Cost", "cost", selectedOrder?.cost)}
        {renderInput("Order Weight", "weight", selectedOrder?.weight)}
        {renderInput("Order Height", "height", selectedOrder?.height)}
        {renderInput("Order Length", "length", selectedOrder?.length)}
        {renderInput("Order Width", "width", selectedOrder?.width)}
        <div>
          <label>Select Payment Method</label>
          <select
            value={selectedOrder?.payment_method || ''}
            onChange={(e) =>
              setSelectedOrder({
                ...selectedOrder,
                payment_method: e.target.value,
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
    </div>
  );
};

export default OrderForm;
