const OrderForm = ({ selectedOrder, setSelectedOrder }) => {
  const paymentMethods = ['Credit Card', 'Cash', 'Online'];

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
      <h2>Edit Order</h2>
      <div className='order'>
        {renderInput("Order Type", "order.order_type", selectedOrder?.order_type)}
        {renderInput("Order Description", "order.description", selectedOrder?.description)}
        {renderInput("Order Cost", "order.cost", selectedOrder?.cost)}
        {renderInput("Order Weight", "order.weight", selectedOrder?.weight)}
        {renderInput("Order Height", "order.height", selectedOrder?.height)}
        {renderInput("Order Length", "order.length", selectedOrder?.length)}
        {renderInput("Order Width", "order.width", selectedOrder?.width)}
        <div>
          <label>Select Payment Method</label>
          <select
            value={selectedOrder?.payment_method || ''}
            onChange={(e) => setSelectedOrder({
              ...selectedOrder,
              payment_method: e.target.value
            })}
          >
            {paymentMethods.map((method, index) => (
              <option key={index} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
