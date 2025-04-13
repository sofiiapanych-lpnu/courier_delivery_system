import { useState, useEffect } from "react"
import axios from 'axios'
import { format } from 'date-fns';
import Table from "../components/Table"

const CourierInfo = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/courier')
      .then((response) => {
        const formattedData = response.data.map((courier) => ({
          email: courier.user.email,
          first_name: courier.user.first_name,
          last_name: courier.user.last_name,
          phone_number: courier.user.phone_number,
          license_plate: courier.license_plate,
          created_at: format(new Date(courier.created_at), 'MMMM dd, yyyy HH:mm:ss'),
          updated_at: format(new Date(courier.updated_at), 'MMMM dd, yyyy HH:mm:ss'),
        }));
        setData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const columns = [
    { header: "License Plate", accessor: "license_plate" },
    { header: "Email", accessor: "email" },
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Phone Number", accessor: "phone_number" },
    { header: "Created At", accessor: "created_at" },
    { header: "Updated At", accessor: "updated_at" },
  ];

  return <>
    <Table data={data} columns={columns} />
  </>
}

export default CourierInfo;