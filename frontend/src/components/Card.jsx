import styles from './Card.module.css'

const Card = ({ title, details, buttonText, onButtonClick }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <h2 className={styles.cardTitle}>{title}</h2>
        {details && (
          <div className={styles.cardDetails}>
            {Object.entries(details).map(([label, value]) => (
              <p key={label}><strong>{label}:</strong> {value}</p>
            ))}
          </div>
        )}
      </div>

      <div className={styles.cardRight}>
        {buttonText && (
          <button onClick={onButtonClick} className={styles.cardButton}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
