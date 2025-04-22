const FeedbackForm = ({ selectedFeedback, setSelectedFeedback }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>Feedback Form</h2>
      <div className="text-field">
        <h3>Courier</h3>
        <p>{selectedFeedback.courier}</p>
      </div>
      <div className="text-field">
        <h3>Client</h3>
        <p>{selectedFeedback.client}</p>
      </div>

      <div className="input-field">
        <label>Rating</label>
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          value={selectedFeedback.rating}
          onChange={handleChange}
        />
      </div>

      <div className="input-field">
        <label>Comment</label>
        <textarea
          name="comment"
          value={selectedFeedback.comment ?? ''}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FeedbackForm;
