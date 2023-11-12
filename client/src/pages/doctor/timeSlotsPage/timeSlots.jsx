import React, { useState } from 'react';

const AddTimeSlots = () => {
  const [formData, setFormData] = useState({
    availableTimeSlots: [],
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(',').map((slot) => slot.trim()), // Convert comma-separated string to an array
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the formData object to your backend API for registration
      const response = await fetch('http://localhost:5000/doctor/addTimeSlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (response.status==200) {
        // Registration was successful, handle success scenario
        console.log('Time Slots added!');
        alert('Time Slots added!');
        e.target.reset(); // This will clear all form input fields
        setFormData({
          availableTimeSlots: [],
        });
      } else {
        // Registration failed, handle error scenario
        console.error('Can not add time slots');
        alert('Can not add time slots');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred:', error);
    }
  };

  return (
    <div className="timeSlots">
      <h2>Add Time Slots</h2>
      <form onSubmit={handleSubmit}>
        {/* Add form fields for each data attribute */}
        <div>
          <label>Time slots (comma-separated):</label>
          <input
            type="text"
            name="availableTimeSlots"
            value={formData.availableTimeSlots.join(', ')} // Convert array to comma-separated string
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Add similar fields for other attributes */}

        {/* Submit button */}
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTimeSlots;