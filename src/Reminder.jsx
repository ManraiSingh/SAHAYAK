import React, { useState } from 'react';
import './Reminder.css';

const Reminder = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const [medications, setMedications] = useState([
    { medicine: '', time: '', dosage: '', notes: '' }
  ]);
  const [currentPage, setCurrentPage] = useState(0);

  const handleChange = (e) => {
    const updated = [...medications];
    updated[currentPage][e.target.name] = e.target.value;
    setMedications(updated);
  };

  const addNewPage = () => {
    setMedications([
      ...medications,
      { medicine: '', time: '', dosage: '', notes: '' }
    ]);
    setCurrentPage(medications.length); // go to next page
  };

  const goBack = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < medications.length - 1) setCurrentPage(currentPage + 1);
  };

  // ✅ Full working form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicines: medications }),
      });

      const result = await response.json();
      console.log("📬 Backend Response:", result);

      if (response.ok) {
        setShowForm(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
        setMedications([{ medicine: '', time: '', dosage: '', notes: '' }]);
        setCurrentPage(0);
      } else {
        alert("❌ Error from server: " + (result.error || "Unknown error"));
      }

    } catch (error) {
      console.error("❌ Network error:", error);
      alert("🚨 Failed to send reminder. Is Flask running?");
    }
  };

  return (
    <>
      <div className="reminder">
        <h1>MEDICATION <span>REMINDER</span></h1>
        <h2>
          The medication reminder feature ensures users never miss a dose by sending timely alerts
          for scheduled medications. It supports custom timings, repeat intervals, and smart
          notifications. Designed for ease and reliability, this feature promotes consistency in
          medication intake, improving health outcomes and supporting users in their wellness journey.
        </h2>
        <div className="reminder-btn">
          <button onClick={() => setShowForm(true)}>REMINDER</button>
        </div>
      </div>

      {showForm && (
        <div className="popup-form">
          <form onSubmit={handleSubmit}>
            <h3>Medication #{currentPage + 1}</h3>

            <input
              type="text"
              name="medicine"
              placeholder="Medicine Name"
              value={medications[currentPage].medicine}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="time"
              value={medications[currentPage].time}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="dosage"
              placeholder="Dosage (e.g., 1 tablet)"
              value={medications[currentPage].dosage}
              onChange={handleChange}
            />
            <textarea
              name="notes"
              placeholder="Additional Notes"
              value={medications[currentPage].notes}
              onChange={handleChange}
              rows={2}
            />

            <div className="form-buttons multi-step">
              <div className="nav-buttons">
                {currentPage > 0 && (
                  <button type="button" onClick={goBack}>← Back</button>
                )}
                {currentPage < medications.length - 1 && (
                  <button type="button" onClick={goNext}>Next →</button>
                )}
              </div>

              <div className="action-buttons">
                <button type="button" onClick={addNewPage}>+ Add Another</button>
                <button type="submit">Save All</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showSaved && (
        <div className="popup-saved">
          ✅ All Reminders Saved!
        </div>
      )}
    </>
  );
};

export default Reminder;
