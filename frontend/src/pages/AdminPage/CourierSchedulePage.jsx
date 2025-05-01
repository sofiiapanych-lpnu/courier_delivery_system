import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useFilters } from '../../hooks/useFilters';
import { courierScheduleService } from '../../api/courierScheduleService';
import { courierWeeklyScheduleService } from '../../api/courierWeeklyScheduleService'
import { formatSchedule } from '../../utils/formatters'
import { normalizeCourierWeeklyScheduleData, normalizeCourierScheduleData } from '../../utils/dataNormalizers'
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import CourierScheduleForm from '../../components/forms/CourierScheduleForm';
import Pagination from '../../components/Pagination'
import './filters.css';

const CourierSchedulePage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const initialFormState = {
    courierName: '',
    scheduleStatus: '',
    mondayHours: '',
    mondayStart: '',
    mondayEnd: '',
    tuesdayHours: '',
    tuesdayStart: '',
    tuesdayEnd: '',
    wednesdayHours: '',
    wednesdayStart: '',
    wednesdayEnd: '',
    thursdayHours: '',
    thursdayStart: '',
    thursdayEnd: '',
    fridayHours: '',
    fridayStart: '',
    fridayEnd: '',
    saturdayHours: '',
    saturdayStart: '',
    saturdayEnd: '',
    sundayHours: '',
    sundayStart: '',
    sundayEnd: '',
  };

  const {
    filters,
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(initialFormState, setPage);

  const { data: schedules, setData: setSchedules, totalPages } = useData(courierScheduleService, filters, page, limit, refreshKey);

  const handleEditSchedule = (id) => {
    courierScheduleService.getById(id)
      .then(res => {
        setSelectedSchedule(res.data);
        setModalMode('edit');
        setModalOpen(true);
      });
  };

  const handleDeleteSchedule = (id) => {
    setSelectedSchedule(id);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleModalOK = async () => {
    if (modalMode === 'edit') {
      try {
        const modifiedWeekly = selectedSchedule.CourierWeeklySchedule.filter(ws => ws.isModified);

        await Promise.all(
          modifiedWeekly.map(ws =>
            ws.weekly_id
              ? courierWeeklyScheduleService.update(ws.weekly_id, normalizeCourierWeeklyScheduleData(selectedSchedule, ws))
              : courierWeeklyScheduleService.create(normalizeCourierWeeklyScheduleData(selectedSchedule, ws))
          )
        );

        const normalizedSchedule = normalizeCourierScheduleData(selectedSchedule)

        const { data } = await courierScheduleService.update(
          selectedSchedule.schedule_id,
          normalizedSchedule
        );

        setSchedules(prev =>
          prev.map(s =>
            s.schedule_id === selectedSchedule.schedule_id ? data : s
          )
        );
        setRefreshKey(prevKey => prevKey + 1);

      } catch (e) {
        console.error(e);
      } finally {
        setModalOpen(false);
      }
    }

    if (modalMode === 'delete') {
      try {
        await courierScheduleService.delete(selectedSchedule);
        setSchedules(prev =>
          prev.filter(s => s.schedule_id !== selectedSchedule)
        );
        if (schedules.length === 1 && page > 1) setPage(p => p - 1);
        else setRefreshKey(k => k + 1);
      } catch (e) {
        console.error(e);
      } finally {
        setModalOpen(false);
      }
    }

    if (modalMode === 'create') {
      console.log('selectedSchedule', selectedSchedule)

      try {
        const normalizedSchedule = normalizeCourierScheduleData(selectedSchedule);

        const { data: createdSchedule } = await courierScheduleService.create(normalizedSchedule);

        // setSchedules(prev => [...prev, newSchedule]);
        setRefreshKey(prev => prev + 1);
      } catch (e) {
        console.error(e);
      } finally {
        setModalOpen(false);
      }
    }

  };

  const columns = [
    { header: 'Courier', accessor: 'courier' },
    { header: 'Status', accessor: 'schedule_status' },
    { header: 'Monday', accessor: 'monday' },
    { header: 'Tuesday', accessor: 'tuesday' },
    { header: 'Wednesday', accessor: 'wednesday' },
    { header: 'Thursday', accessor: 'thursday' },
    { header: 'Friday', accessor: 'friday' },
    { header: 'Saturday', accessor: 'saturday' },
    { header: 'Sunday', accessor: 'sunday' },
    // { header: 'Created At', accessor: 'created_at' },
    // { header: 'Updated At', accessor: 'updated_at' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <>
          <button onClick={() => handleEditSchedule(row.schedule_id)}>Edit</button>
          <button onClick={() => handleDeleteSchedule(row.schedule_id)} style={{ marginLeft: '10px' }}>Delete</button>
        </>
      )
    }
  ];

  console.log(schedules)

  const scheduleData = schedules.map(schedule => {
    const formattedSchedule = formatSchedule(schedule);
    return {
      ...schedule,
      courier: formattedSchedule.courier,
      monday: formattedSchedule.Monday,
      tuesday: formattedSchedule.Tuesday,
      wednesday: formattedSchedule.Wednesday,
      thursday: formattedSchedule.Thursday,
      friday: formattedSchedule.Friday,
      saturday: formattedSchedule.Saturday,
      sunday: formattedSchedule.Sunday,
    };
  });

  return (
    <div>
      <h1>Courier Schedules</h1>

      <div className="filters">
        <div className='filter-section'>
          <div>
            <div className="filter-group">
              <label>Courier Name</label>
              <input
                name="courierName"
                onChange={handleFilterChange}
                value={formState.courierName}
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="filter-group">
              <label>Schedule Status</label>
              <select
                name="scheduleStatus"
                onChange={handleFilterChange}
                value={formState.scheduleStatus}
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
        <div className="filter-section">
          <div className="filter-group">
            <div style={{ display: 'flex', gap: '10px' }}>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <div key={day}>
                  <strong>{day.charAt(0).toUpperCase() + day.slice(1)}</strong>
                  <div>
                    <input
                      name={`${day}Start`}
                      onChange={handleFilterChange}
                      value={formState[`${day}Start`]}
                      type="time"
                    />
                  </div>
                  <div>
                    <input
                      name={`${day}End`}
                      onChange={handleFilterChange}
                      value={formState[`${day}End`]}
                      type="time"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-section">
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>



      <button
        className="create-btn"
        style={{ marginBottom: '10px' }}
        onClick={() => {
          const defaultWeekSchedule = Array.from({ length: 7 }, (_, i) => ({
            day_of_week: i + 1,
            is_working_day: false,
            start_time: '',
            end_time: '',
          }));

          setSelectedSchedule({
            courier_id: '',
            courier: undefined,
            schedule_status: 'active',
            CourierWeeklySchedule: defaultWeekSchedule,
          });

          setModalMode('create');
          setModalOpen(true);
        }}
      >
        Create Schedule
      </button>

      <Table data={scheduleData} columns={columns} />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />


      {modalOpen && (
        <Modal open={modalOpen} onClose={handleModalClose} onOK={handleModalOK}>
          {modalMode === 'edit' || modalMode === 'create' ? (
            <CourierScheduleForm selectedSchedule={selectedSchedule} setSelectedSchedule={setSelectedSchedule} mode={modalMode} />
          ) : (
            <div>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this schedule?</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CourierSchedulePage;
