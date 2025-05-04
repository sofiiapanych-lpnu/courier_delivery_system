import React, { useEffect, useState } from 'react';
import Table from './Table';
import { useFilters } from '../hooks/useFilters';
import { courierService } from '../api/courierService';
import { formatSchedule } from '../utils/formatters';

const UserScheduleSection = ({ userInfo }) => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [schedules, setSchedules] = useState([]);

  const {
    formState,
    handleFilterChange,
    handleClearFilters,
  } = useFilters(setPage);

  useEffect(() => {
    if (userInfo) fetchSchedules();
  }, [userInfo, formState, page]);

  const fetchSchedules = () => {
    if (!userInfo) return;

    const id = userInfo.Courier?.courier_id;
    if (!id) return;

    courierService.getSchedule(id, { ...formState, page, limit })
      .then(res => {
        setSchedules(res.data.items);
        setTotalPages(res.data.meta.totalPages);
      })
      .catch(err => console.error("Failed to fetch schedules", err));
  };

  const columns = [
    { header: 'Status', accessor: 'schedule_status' },
    { header: 'Monday', accessor: 'monday' },
    { header: 'Tuesday', accessor: 'tuesday' },
    { header: 'Wednesday', accessor: 'wednesday' },
    { header: 'Thursday', accessor: 'thursday' },
    { header: 'Friday', accessor: 'friday' },
    { header: 'Saturday', accessor: 'saturday' },
    { header: 'Sunday', accessor: 'sunday' },
  ];

  const scheduleData = schedules.map(schedule => {
    const formatted = formatSchedule(schedule);
    return {
      ...schedule,
      monday: formatted.Monday,
      tuesday: formatted.Tuesday,
      wednesday: formatted.Wednesday,
      thursday: formatted.Thursday,
      friday: formatted.Friday,
      saturday: formatted.Saturday,
      sunday: formatted.Sunday,
    };
  });

  return (
    <div>
      <h2>Your Schedule</h2>

      <Table data={scheduleData} columns={columns} />
    </div>
  );
};

export default UserScheduleSection;
