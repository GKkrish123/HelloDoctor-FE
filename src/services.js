const URL = "http://localhost:5000";

const transcribeData = async (audioBlob, sessionData) => {
  try {
    const formData = new FormData();
    if (audioBlob) {
      formData.append("audio_file", audioBlob, "audio.wav");
    }
    formData.append("session_data", JSON.stringify(sessionData));

    const response = await fetch(`${URL}/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};

const scheduleAppointment = async (appointmentDetails) => {
  try {
    const response = await fetch(`${URL}/appointment/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentDetails),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    throw error;
  }
};

const rescheduleAppointment = async (appointmentId, newAppointmentDetails) => {
  try {
    const response = await fetch(
      `${URL}/appointment/reschedule/${appointmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppointmentDetails),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw error;
  }
};

const cancelAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${URL}/appointment/cancel/${appointmentId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error canceling appointment:", error);
    throw error;
  }
};

const getAvailableSlots = async (doctorId) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("doctorids", doctorId);
    queryParams.append("booked", false);

    const url = `${URL}/slot?${queryParams.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
};

export {
  transcribeData,
  scheduleAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getAvailableSlots,
};
