import React, { useState, useEffect } from 'react';
import { formatPerson } from '../../utils/formatters';
import { courierService } from '../../api/courierService'

const daysOfWeek = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
];

const CourierScheduleForm = ({ selectedSchedule, setSelectedSchedule, mode }) => {
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    courierService.getAll()
      .then(res => {
        setCouriers(res.data);
      });
  }, []);

  const handleCourierChange = (e) => {
    const courierId = e.target.value;
    const courier = couriers.find(c => c.courier_id === courierId);
    setSelectedSchedule(prev => ({
      ...prev,
      courier_id: courierId,
      courier,
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...selectedSchedule.CourierWeeklySchedule];
    updatedSchedule[index] = {
      ...updatedSchedule[index],
      [field]: value,
      isModified: true,
    };
    setSelectedSchedule({
      ...selectedSchedule,
      CourierWeeklySchedule: updatedSchedule,
    });
  };

  const handleStatusChange = (e) => {
    setSelectedSchedule({
      ...selectedSchedule,
      schedule_status: e.target.checked ? 'archived' : 'active',
    });
  };

  return (
    <div>
      <h2>Edit Courier Schedule</h2>

      {!selectedSchedule.schedule_id && (
        <div className='section'>
          <div className="input-field">
            <label>Courier</label>
            <select value={selectedSchedule.courier_id || ''} onChange={handleCourierChange}>
              <option value="">Select courier</option>
              {couriers.map(c => (
                <option key={c.courier_id} value={c.courier_id}>
                  {formatPerson(c)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {mode === 'edit' && (
        <div className='section'>
          <div className='row'>
            <div className="input-field">
              <h3>Courier</h3>
              <p style={{ margin: '0' }}>{formatPerson(selectedSchedule.courier)}</p>
            </div>

            <div className="input-field">
              <label>
                <input
                  type="checkbox"
                  checked={selectedSchedule.schedule_status === 'archived'}
                  onChange={handleStatusChange}
                />
                Archieve schedule
              </label>
            </div>
          </div>
        </div>
      )}

      <div className='section'>
        <h3>Courier Weekly Schedule</h3>

        <div className='schedule'>
          {daysOfWeek.map((day, index) => {
            const daySchedule = selectedSchedule?.CourierWeeklySchedule?.find(
              s => s.day_of_week === day.value
            ) || {
              day_of_week: day.value,
              is_working_day: false,
              start_time: '',
              end_time: ''
            };

            const dayIndex = selectedSchedule?.CourierWeeklySchedule?.findIndex(
              s => s.day_of_week === day.value
            );

            return (
              <div key={day.value} className='day-schedule'>
                <h4>{day.label}</h4>

                <div className='row'>
                  <label>Working Day</label>
                  <input
                    type="checkbox"
                    checked={daySchedule.is_working_day}
                    onChange={(e) =>
                      handleScheduleChange(dayIndex, 'is_working_day', e.target.checked)
                    }
                  />
                </div>

                <div className='row'>
                  <div className='input-field'>
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={daySchedule.start_time?.slice(11, 16) || ''}
                      onChange={(e) =>
                        handleScheduleChange(
                          dayIndex,
                          'start_time',
                          new Date(`1970-01-01T${e.target.value}:00Z`).toISOString()
                        )
                      }
                      disabled={!daySchedule.is_working_day}
                    />
                  </div>

                  <div className='input-field'>
                    <label>End Time</label>
                    <input
                      type="time"
                      value={daySchedule.end_time?.slice(11, 16) || ''}
                      onChange={(e) =>
                        handleScheduleChange(
                          dayIndex,
                          'end_time',
                          new Date(`1970-01-01T${e.target.value}:00Z`).toISOString()
                        )
                      }
                      disabled={!daySchedule.is_working_day}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CourierScheduleForm;
