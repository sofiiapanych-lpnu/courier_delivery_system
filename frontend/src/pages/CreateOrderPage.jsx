import { useParams } from "react-router-dom";
import { useState } from "react";
import { orderService } from "../api/orderService";
import { deliveryService } from '../api/deliveryService';
import { useClientId } from "../hooks/useClientId";

const CreateOrderPage = () => {
  const { warehouseId } = useParams();
  const [orderData, setOrderData] = useState({
    order_type: "standard",
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

      const delivery = await deliveryService.create({
        orderId: orderId,
        warehouseId: Number(warehouseId),
        deliveryType: orderData.delivery_type,
        deliveryCost: Number(orderData.delivery_cost),
        paymentMethod: orderData.payment_method,
        addressId: Number(orderData.address_id),
        clientId: Number(clientId),
      });

      console.log('delivery', delivery);

      alert("Order and delivery successfully created!");
    } catch (err) {
      console.error("Error during creation:", err);
      alert("An error occurred during creation.");
    }
  };

  return (
    <div>
      <h1>Create Order for Warehouse #{warehouseId}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order Type:</label>
          <input
            type="text"
            name="order_type"
            value={orderData.order_type}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={orderData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Cost:</label>
          <input
            type="number"
            name="cost"
            value={orderData.cost}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Payment Method:</label>
          <input
            type="text"
            name="payment_method"
            value={orderData.payment_method}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={orderData.weight}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Dimensions (cm):</label>
          <input
            type="number"
            name="length"
            value={orderData.length}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="width"
            value={orderData.width}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="height"
            value={orderData.height}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Delivery</h3>
        <div>
          <label>Delivery Type:</label>
          <input
            type="text"
            name="delivery_type"
            value={orderData.delivery_type}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Delivery Cost:</label>
          <input
            type="number"
            name="delivery_cost"
            value={orderData.delivery_cost}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Delivery Address ID:</label>
          <input
            type="number"
            name="address_id"
            value={orderData.address_id}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Create Order</button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
