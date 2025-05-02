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
      <h2>Edit Warehouse</h2>
      <div className='section'>
        <div className='row'>
          {renderInput("Name", "name", selectedWarehouse?.name)}
          {renderInput("Contact Number", "contact_number", selectedWarehouse?.contact_number)}
        </div>
        <div className='row'>
          {renderInput("Country", "address.country", selectedWarehouse?.address?.country)}
          {renderInput("City", "address.city", selectedWarehouse?.address?.city)}
        </div>
        <div className='row'>
          {renderInput("Street", "address.street_name", selectedWarehouse?.address?.street_name)}
          {renderInput("Building Number", "address.building_number", selectedWarehouse?.address?.building_number, "number")}
          {renderInput("Apartment Number", "address.apartment_number", selectedWarehouse?.address?.apartment_number, "number")}
        </div>
      </div>
    </div>
  );
};

export default WarehouseForm;
