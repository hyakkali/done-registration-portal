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
  const [successResponse, setSuccessResponse] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileInput = (e) => {
    setLicenseImage(e.target.files[0]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const s3_config = {
      bucketName: process.env.REACT_APP_AWS_BUCKET_NAME,
      region: process.env.REACT_APP_AWS_REGION,
      dirName: `licenses/${firstName}/${lastName}/${phoneNumber}/${Date.parse(appointmentTime)}`,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
    S3FileUpload.uploadFile(licenseImage, s3_config)
      .then(data => {
          const licensePhotoUrl = data.location;
              axios.post(
                "https://mighty-wave-59858.herokuapp.com/appointment",
                {
                  firstName,
                  lastName,
                  dateOfBirth: Date.parse(dateOfBirth),
                  phoneNumber,
                  email,
                  address,
                  appointmentTime: Date.parse(appointmentTime),
                  licensePhotoUrl
                }
              ).then(res => {
                setSuccessResponse(true);
              })
              .catch(error => {
                if (error.toJSON().status === 500) {
                  setMessage("An appointment already exists at this time for " + firstName);
                } else {
                  setMessage("An unexpected error has occurred. Try again.");
                }
              });
        }
      )
      .catch(err => console.error(err));
  }

  if (successResponse) {
    return (
      <div className="success-container">
        <h2>{"Success! You have been registered for an appointment on "} {appointmentTime.toLocaleDateString()} {appointmentTime.toLocaleTimeString()}</h2>
      </div>
    )
  }
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Register for an appointment</h2>
        <input
          type="text"
          value={firstName}
          placeholder="First name"
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          value={lastName}
          placeholder="Last name"
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <p className="label">Date of Birth</p>
        <DatePicker 
          selected={dateOfBirth} 
          onChange={setDateOfBirth}
          required
        />
        <input
          type="text"
          value={phoneNumber}
          placeholder="Phone number"
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          value={address}
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <p className="label">Upload Your License</p>
        <input
          type="file"
          onChange={handleFileInput}
          required
        />
        <p className="label">Appointment Time</p>
        <DatePicker 
          selected={appointmentTime} 
          onChange={setAppointmentTime} 
          showTimeSelect
          dateFormat="Pp"
          required
        />

        <button type="submit" disabled={submitted}>Register</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

export default RegistrationForm;