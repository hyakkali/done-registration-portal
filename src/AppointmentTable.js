import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Table from "./Table";
import "./AppointmentTable.css";
import moment from "moment";

function AppointmentTable() {
  const [data, setData] = useState([]);

  const columns = useMemo(() => [
    {
        Header: "First Name",
        accessor: "firstName",
    },
    {
        Header: "Last Name",
        accessor: "lastName",
    },
    {
        Header: "DOB",
        accessor: (row) => moment(new Date(row.dateOfBirth)).format("MM/DD/YYYY")
    },
    {
        Header: "Email",
        accessor: "email",
    },
    {
        Header: "Phone Number",
        accessor: "phoneNumber",
    },
    {
        Header: "Address",
        accessor: "address",
    },
    {
        Header: "License",
        accessor: "licensePhotoUrl",
        Cell: e => {
            return (
                <a href={e.value} target="_blank" rel="noreferrer"> 
                    <img 
                        src={e.value}
                        height="100"
                        width="100"
                    />
                </a>
            )
        }
    },
    {
        Header: "Appt Time",
        accessor: (row) => new Date(row.appointmentTime).toLocaleString()
    },
  ]);

  useEffect(() => {
    (async () => {
      const result = await axios("https://mighty-wave-59858.herokuapp.com/appointment?limit=1000");
      setData(result.data.list);
      console.log("success: ", result.data);
    })();
  }, []);

  return (
    <div className="container">
      <Table columns={columns} data={data} />
    </div>
  );
}

export default AppointmentTable;