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

  return (
    <div>
      <h2>Edit Order</h2>
      <div className='section'>
        <div className='row'>
          {renderInput("Order Type", "order_type", selectedOrder?.order_type)}
          {renderInput("Order Description", "description", selectedOrder?.description)}
        </div>
        <div className='row'>
          {renderInput("Order Weight", "weight", selectedOrder?.weight, "number")}
          <div className="input-spacing"></div>
          {renderInput("Order Height", "height", selectedOrder?.height, "number")}
          {renderInput("Order Length", "length", selectedOrder?.length, "number")}
          {renderInput("Order Width", "width", selectedOrder?.width, "number")}
        </div>
        <div className='row'>
          <div className='input-field'>
            <label>Payment Method</label>
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
          {renderInput("Order Cost", "cost", selectedOrder?.cost, "number")}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
