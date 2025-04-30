import styles from './Home.module.css';

const Home = () => {
  return (
    <main className={styles.mainHome}>
      <h1>Welcome to CourierExpress</h1>
      <p>
        Fast and reliable courier deliveries across the country. Manage deliveries, couriers, vehicles, warehouses, and more — all from one place.
      </p>

      <div className={styles.gridCards}>
        <div className={styles.card}>
          <h2>Manage Orders</h2>
          <p>Create, view and manage delivery orders with ease.</p>
        </div>
        <div className={styles.card}>
          <h2>Warehouse Network</h2>
          <p>Oversee warehouse storage and shipments efficiently.</p>
        </div>
        <div className={styles.card}>
          <h2>Courier Management</h2>
          <p>Track courier schedules and optimize routes.</p>
        </div>
        <div className={styles.card}>
          <h2>Feedback & Reports</h2>
          <p>Analyze performance and improve service quality.</p>
        </div>
      </div>
    </main>
  );
};

export default Home;
