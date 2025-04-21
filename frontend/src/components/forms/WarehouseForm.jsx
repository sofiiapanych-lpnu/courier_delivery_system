const WarehouseForm = ({ selectedWarehouse, setSelectedWarehouse }) => {

  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updatedWarehouse = { ...selectedWarehouse };
    let current = updatedWarehouse;

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

    setSelectedWarehouse(updatedWarehouse);
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
      <h2>Edit Warehouse</h2>
      <div className='warehouse'>
        {renderInput("Name", "name", selectedWarehouse?.name)}
        {renderInput("Contact Number", "contact_number", selectedWarehouse?.contact_number)}
        {renderInput("Country", "address.country", selectedWarehouse?.address?.country)}
        {renderInput("City", "address.city", selectedWarehouse?.address?.city)}
        {renderInput("Street", "address.street_name", selectedWarehouse?.address?.street_name)}
        {renderInput("Building Number", "address.building_number", selectedWarehouse?.address?.building_number)}
        {renderInput("Apartment Number", "address.apartment_number", selectedWarehouse?.address?.apartment_number)}
      </div>
    </div>
  );
};

export default WarehouseForm;
