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
      <div className="user-section">
        {renderInput("First Name", "first_name", selectedUser?.first_name)}
        {renderInput("Last Name", "last_name", selectedUser?.last_name)}
        {renderInput("Email", "email", selectedUser?.email)}
        {renderInput("Phone Number", "phone_number", selectedUser?.phone_number)}
      </div>

      {selectedUser?.role === 'client' ? (
        <div className="address-section">
          <h3>Address</h3>
          {renderInput("Country", "Client.address.country", selectedUser?.Client?.address?.country)}
          {renderInput("City", "Client.address.city", selectedUser?.Client?.address?.city)}
          {renderInput("Street", "Client.address.street_name", selectedUser?.Client?.address?.street_name)}
          {renderInput("Building", "Client.address.building_number", selectedUser?.Client?.address?.building_number)}
          {renderInput("Apartment", "Client.address.apartment_number", selectedUser?.Client?.address?.apartment_number)}
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
