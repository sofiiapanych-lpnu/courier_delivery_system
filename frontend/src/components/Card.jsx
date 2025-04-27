const Card = ({ title, description, details, buttonText, onButtonClick }) => {
  return (
    <div>
      <div>
        <h2 >{title}</h2>
        {description && <p >{description}</p>}

        {details && (
          <div>
            {Object.entries(details).map(([label, value]) => (
              <p key={label}><strong>{label}:</strong> {value}</p>
            ))}
          </div>
        )}
      </div>

      {buttonText && (
        <button
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;
