import React, { useState } from 'react';

const FollowUpAppointmentForm = ({ patientUsername, doctorUsername, onFollowUpScheduled }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleScheduleFollowUp = () => {
    // Validate selectedDate and selectedTime
    if (selectedDate && selectedTime) {
      // Call API to schedule follow-up appointment
      // Assuming you have an API endpoint to handle this
      fetch('http://localhost:5000/doctor/appointment/scheduleFollowUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientUsername,
          doctorUsername,
          date: selectedDate,
          time: selectedTime,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Follow-up appointment scheduled successfully:', data);
          // Optionally, update the UI or trigger a callback
          onFollowUpScheduled();
        })
        .catch((error) => {
          // Handle error
          console.error('Error scheduling follow-up appointment:', error);
        });
    } else {
      // Handle validation error
      console.error('Please select a date and time for the follow-up appointment.');
    }
  };

  return (
    <div>
      <h2>Schedule Follow-Up Appointment</h2>
      <label>
        Date:
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </label>
      <label>
        Time:
        <input type="time" value={selectedTime} onChange={handleTimeChange} />
      </label>
      <button onClick={handleScheduleFollowUp}>Schedule Follow-Up</button>
    </div>
  );
};

export default FollowUpAppointmentForm;
