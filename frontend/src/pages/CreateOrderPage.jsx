import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { orderService } from "../api/orderService";
import { deliveryService } from '../api/deliveryService';
import { addressService } from "../api/addressService";
import { clientService } from "../api/clientService";
import { useClientId } from "../hooks/useClientId";
import styles from './CreateOrderPage.module.css';
import { normalizeAddressData } from "../utils/dataNormalizers";

const CreateOrderPage = () => {
  const { warehouseId, warehouseName } = useParams();
  const [orderData, setOrderData] = useState({
    order_type: "",
    description: "",
    cost: 0,
    payment_method: "cash",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    delivery_type: "standard",
    delivery_cost: 0,
    address_id: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState({
    country: "",
    city: "",
    street_name: "",
    building_number: "",
    apartment_number: ""
  });
  const [useMyAddress, setUseMyAddress] = useState(false);
  const [myAddress, setMyAddress] = useState(null);
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
  const clientId = useClientId();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderRes = await orderService.create({
        orderType: orderData.order_type,
        description: orderData.description,
        cost: Number(orderData.cost),
        paymentMethod: orderData.payment_method,
        weight: Number(orderData.weight),
        length: Number(orderData.length),
        width: Number(orderData.width),
        height: Number(orderData.height),
      });

      const orderId = orderRes.data.order_id;

      let addressId;

      if (useMyAddress) {
        addressId = myAddress.address_id;
      } else {
        const normalizedAddress = normalizeAddressData(deliveryAddress);
        const addressRes = await addressService.create(normalizedAddress);
        addressId = addressRes.data.address_id;
      }

      const delivery = await deliveryService.create({
        orderId: orderId,
        warehouseId: Number(warehouseId),
        deliveryType: orderData.delivery_type,
        deliveryCost: Number(orderData.delivery_cost),
        paymentMethod: orderData.payment_method,
        addressId: Number(addressId),
        clientId: Number(clientId),
      });


      alert("Order and delivery successfully created!");
    } catch (err) {
      console.error("Error during creation:", err);
      alert("An error occurred during creation.");
    }
  };

  const fetchMyAddress = async () => {
    console.log(clientId)

    if (!clientId) {
      return;
    }
    try {
      const response = await clientService.getById(clientId);
      console.log(response.data)
      setMyAddress(response.data.address);
    } catch (error) {
      console.error('Failed to load client address:', error);
    }
  }

  useEffect(() => {
    fetchMyAddress();
    console.log('myAddress', myAddress)
  }, [clientId]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Order from {warehouseName}</h1>

        <div>
          <h3 className={styles.sectionTitle}>Order Description</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>Order Type:</label>
            <input
              className={styles.input}
              type="text"
              name="order_type"
              value={orderData.order_type}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description:</label>
            <textarea
              className={styles.textarea}
              name="description"
              value={orderData.description}
              onChange={handleChange}
              required
            />
          </div>

          <h3 className={styles.sectionTitle}>Price</h3>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cost:</label>
              <input
                className={styles.input}
                type="number"
                name="cost"
                value={orderData.cost}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Method:</label>
              <select
                className={styles.input}
                name="payment_method"
                value={orderData.payment_method}
                onChange={handleChange}
                required
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


        <div>
          <h3 className={styles.sectionTitle}>Parameters</h3>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Weight (kg):</label>
              <input
                className={`${styles.input} ${styles.inputNumber}`}
                type="number"
                name="weight"
                value={orderData.weight}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Dimensions (cm):</label>
              <div className={styles.dimensions}>
                <input
                  className={`${styles.input} ${styles.inputNumber}`}
                  type="number"
                  name="length"
                  value={orderData.length}
                  onChange={handleChange}
                  required
                />
                <input
                  className={`${styles.input} ${styles.inputNumber}`}
                  type="number"
                  name="width"
                  value={orderData.width}
                  onChange={handleChange}
                  required
                />
                <input
                  className={`${styles.input} ${styles.inputNumber}`}
                  type="number"
                  name="height"
                  value={orderData.height}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <h3 className={styles.sectionTitle}>Delivery</h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>Delivery Type:</label>
            <select
              className={styles.input}
              name="delivery_type"
              value={orderData.delivery_type}
              onChange={handleChange}
              required
            >
              {deliveryTypes.map((type, index) => (
                <option key={index} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

          </div>

          {/* <div className={styles.formGroup}>
            <label className={styles.label}>Delivery Cost:</label>
            <input
              className={styles.input}
              type="number"
              name="delivery_cost"
              value={orderData.delivery_cost}
              onChange={handleChange}
              required
            />
          </div> */}

          <h3 className={styles.sectionTitle}>Delivery Address</h3>
          {myAddress ? (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={useMyAddress}
                  onChange={() => setUseMyAddress(!useMyAddress)}
                />
                &nbsp; Use My Address
              </label>
            </div>
          ) : (
            <p>You do not have a saved address. Please enter a new address below.</p>
          )}

          {myAddress && useMyAddress ? (
            <div>
              <p className={styles.label}>{`Address: ${myAddress.country}, ${myAddress.city}, ${myAddress.street_name} St., ${myAddress.building_number}, Apt. ${myAddress.apartment_number || "N/A"}`}</p>
            </div>
          ) : (
            <div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Country:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="country"
                    value={deliveryAddress.country}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, country: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>City:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="city"
                    value={deliveryAddress.city}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Street Name:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="street_name"
                    value={deliveryAddress.street_name}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, street_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Building Number:</label>
                  <input
                    className={`${styles.input} ${styles.inputNumber}`}
                    type="text"
                    name="building_number"
                    value={deliveryAddress.building_number}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, building_number: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Apt. Number:</label>
                  <input
                    className={`${styles.input} ${styles.inputNumber}`}
                    type="text"
                    name="apartment_number"
                    value={deliveryAddress.apartment_number}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, apartment_number: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}



        </div>

        <button type="submit" className={styles.button}>Create Order</button>
      </form>
    </div>

  );
};

export default CreateOrderPage;
