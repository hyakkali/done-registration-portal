import "./RegistrationForm.css";
import "react-datepicker/dist/react-datepicker.css";
import React ,{ useState } from "react";
import DatePicker from "react-datepicker";
import S3FileUpload from 'react-s3';
import axios from "axios";
 
function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [message, setMessage] = useState("");

  var s3_config = {
    bucketName: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }

  const handleFileInput = (e) => {
    setLicenseImage(e.target.files[0]);
    console.log(e.target.files[0]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    s3_config.dirName = `licenses/${firstName}/${lastName}/${phoneNumber}/${Date.parse(appointmentTime)}`
    S3FileUpload.uploadFile(licenseImage, s3_config)
      .then(data => {
          console.log(data.location);
              axios.post(
                "postUrl",
                {
                  firstName,
                  lastName,
                  dateOfBirth: Date.parse(dateOfBirth),
                  phoneNumber,
                  email,
                  address,
                  appointmentTime: Date.parse(appointmentTime),
                  licenseImageUrl: data.location
                }
              ).then(res => {
                console.log(res);
                console.log(res.data);
              });
        }
      )
      .catch(err => console.error(err));

  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          placeholder="First name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          value={lastName}
          placeholder="Last name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <DatePicker 
          selected={dateOfBirth} 
          onChange={setDateOfBirth}
        />
        <input
          type="text"
          value={phoneNumber}
          placeholder="Phone number"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          value={address}
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="file"
          onChange={handleFileInput}
        />
        <DatePicker 
          selected={appointmentTime} 
          onChange={setAppointmentTime} 
          showTimeSelect
          dateFormat="Pp"
        />

        <button type="submit">Create</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

export default RegistrationForm;