import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { courierService } from '../../api/courierService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Line, LineChart, ComposedChart } from 'recharts';
import Modal from '../../components/Modal'
import { formatDelivery } from '../../utils/formatters'
import Pagination from '../../components/Pagination'
import ActionButton from '../../components/ActionButton'
import './filters.css';

const ReportPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);

  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    courierId: '',
    groupBy: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourierDeliveries, setSelectedCourierDeliveries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [filters, page]);

  const fetchCouriers = async () => {
    try {
      const res = await courierService.getAll();
      setCouriers(res.data);
    } catch (err) {
      console.error('Failed to fetch couriers', err);
    }
  };

  const fetchReportData = () => {
    setLoading(true);

    courierService.getStatistics({
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      courierId: filters.courierId ? Number(filters.courierId) : undefined,
      groupBy: filters.groupBy,
      page,
      limit,
    })
      .then((res) => {
        console.log(res)
        setReportData(res.data.items);
        setTotalPages(res.data.meta.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch report", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  useEffect(() => {
    fetchCouriers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      courierId: '',
      groupBy: 'all',
    });
  };
  console.log(reportData)
  const handleOpenModal = (deliveries) => {
    setSelectedCourierDeliveries(deliveries);
    setIsModalOpen(true);
  };

  const flattenedReportData = reportData.flatMap(groupItem =>
    groupItem.couriers.map(courier => ({
      ...courier,
      group: groupItem.group
    }))
  );

  const columns = [
    { header: 'Group', accessor: 'group' },
    { header: 'Courier', accessor: 'courierName' },
    { header: 'Total Deliveries', accessor: 'totalDeliveries' },
    { header: 'In Progress Deliveries', accessor: 'inProgressDeliveries' },
    { header: 'Completed Deliveries', accessor: 'completedDeliveries' },
    { header: 'Total Delivery Cost', accessor: 'totalCost' },
    { header: 'Average Delivery Cost', accessor: 'avgDeliveryCost' },
    { header: 'Average Delivery Time (minutes)', accessor: 'averageDeliveryTimeMinutes' },
    {
      header: 'Details',
      accessor: 'courierId',
      cell: ({ row }) => (
        <ActionButton
          onClick={() => { console.log(row); handleOpenModal(row.deliveries) }}
        >
          Deliveries
        </ActionButton>
      )
    }
  ];

  const formattedDeliveries = selectedCourierDeliveries.map(formatDelivery);

  const deliveryColumns = [
    { header: 'Delivery ID', accessor: 'delivery_id' },
    { header: 'Warehouse', accessor: 'warehouse' },
    { header: 'Address', accessor: 'address' },
    { header: 'Order Type', accessor: 'order' },
    { header: 'Start Time', accessor: 'start_time' },
    { header: 'End Time', accessor: 'end_time' },
    { header: 'Desired Duration', accessor: 'desired_duration' },
    { header: 'Status', accessor: 'delivery_status' },
    { header: 'Delivery Type', accessor: 'delivery_type' },
    { header: 'Cost', accessor: 'delivery_cost' },
    { header: 'Payment Method', accessor: 'payment_method' },
    { header: 'Client', accessor: 'client' },
    { header: 'Courier', accessor: 'courier' },
  ];

  return (
    <div className="report-page">
      <h1>Courier Deliveries Report</h1>
      <div className="filters">
        <label>Start Time</label>
        <input
          type="datetime-local"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <label>End Time</label>
        <input
          type="datetime-local"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <label>Courier</label>
        <select name="courierId" value={filters.courierId} onChange={handleFilterChange}>
          <option value="">All</option>
          {couriers.map(courier => (
            <option key={courier.courier_id} value={courier.courier_id}>
              ID: {courier.courier_id} | {courier.user.first_name} {courier.user.last_name}
            </option>
          ))}
        </select>
        <label>Group By</label>
        <select name="groupBy" value={filters.groupBy} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="day">Day</option>
        </select>

        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table data={flattenedReportData} columns={columns} />
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />

          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart
              data={reportData.map(groupItem => {
                const couriers = groupItem.couriers || [];

                const totalDeliveries = couriers.reduce((sum, courier) => sum + (courier.totalDeliveries || 0), 0);
                const totalCost = couriers.reduce((sum, courier) => sum + (courier.totalCost || 0), 0);
                const avgDeliveryCost = couriers.length
                  ? couriers.reduce((sum, courier) => sum + (courier.avgDeliveryCost || 0), 0) / couriers.length
                  : 0;
                const averageDeliveryTimeMinutes = couriers.length
                  ? couriers.reduce((sum, courier) => sum + (courier.averageDeliveryTimeMinutes || 0), 0) / couriers.length
                  : 0;

                return {
                  group: groupItem.group,
                  totalDeliveries,
                  totalCost,
                  avgDeliveryCost,
                  averageDeliveryTimeMinutes,
                };
              })}
              margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="group" />
              <YAxis yAxisId="left" label={{ value: 'Count / Sum', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Average time/cost', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />

              <Bar yAxisId="left" dataKey="totalDeliveries" barSize={20} fill="#413ea0" name="Delivery count" />
              <Bar yAxisId="left" dataKey="totalCost" barSize={20} fill="#82ca9d" name="Delivery sum" />

              <Line yAxisId="right" type="monotone" dataKey="averageDeliveryTimeMinutes" stroke="#ff7300" name="Average delivery time (min)" />
              <Line yAxisId="right" type="monotone" dataKey="avgDeliveryCost" stroke="#8884d8" name="Average delivery cost" />
            </ComposedChart>
          </ResponsiveContainer>

        </>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOK={() => setIsModalOpen(false)}
        okText="OK"
        closeText="Close"
      >
        <h2>Courier Deliveries</h2>
        <Table data={formattedDeliveries} columns={deliveryColumns} />
      </Modal>

    </div>
  );
};

export default ReportPage;
