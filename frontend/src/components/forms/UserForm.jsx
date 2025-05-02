import VehicleSection from "../form-sections/VehicleSection";

const UserForm = ({ selectedUser, setSelectedUser }) => {
  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updatedUser = { ...selectedUser };
    let current = updatedUser;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    });

    setSelectedUser(updatedUser);
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

  const renderSelect = (label, path, value, options) => (
    <div className="input-field">
      <label>{label}</label>
      <select value={value || ''} onChange={(e) => handleChange(path, e.target.value)}>
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <h2>Edit User</h2>
      <div className="section">
        <div className='row'>
          {renderInput("First Name", "first_name", selectedUser?.first_name)}
          {renderInput("Last Name", "last_name", selectedUser?.last_name)}
        </div>
        <div className='row'>
          {renderInput("Email", "email", selectedUser?.email)}
          {renderInput("Phone Number", "phone_number", selectedUser?.phone_number)}
        </div>
      </div>

      {selectedUser?.role === 'client' ? (
        <div className="section">
          <h3>Address</h3>
          <div className='row'>
            {renderInput("Country", "Client.address.country", selectedUser?.Client?.address?.country)}
            {renderInput("City", "Client.address.city", selectedUser?.Client?.address?.city)}
          </div>
          <div className='row'>
            {renderInput("Street", "Client.address.street_name", selectedUser?.Client?.address?.street_name)}
            {renderInput("Building", "Client.address.building_number", selectedUser?.Client?.address?.building_number, "number")}
            {renderInput("Apartment", "Client.address.apartment_number", selectedUser?.Client?.address?.apartment_number, "number")}
          </div>
        </div>
      ) : selectedUser?.role === 'courier' ? (
        <div className="vehicle-section">
          <VehicleSection
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            renderInput={renderInput}
            renderSelect={renderSelect}
          />
        </div>
      ) : null}


    </div>
  );
};

export default UserForm;
