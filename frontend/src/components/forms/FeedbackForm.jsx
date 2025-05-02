import { formatPerson } from '../../utils/formatters'

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
      <div className='section'>
        <div className='row'>
          <div className="text-field">
            <h3>Courier</h3>
            <p>{formatPerson(selectedFeedback.courier)}</p>
          </div>
          <div className="input-spacing-large"></div>
          <div className="text-field">
            <h3>Client</h3>
            <p>{formatPerson(selectedFeedback.client)}</p>
          </div>
        </div>
      </div>

      <div className='section'>
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

    </div>
  );
};

export default FeedbackForm;
