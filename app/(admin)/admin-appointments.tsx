import React, { useState } from "react";

// Mock data for demonstration
type Appointment = {
    id: number;
    petName: string;
    owner: string;
    date: string;
    time: string;
    reason: string;
};

const initialAppointments: Appointment[] = [
    {
        id: 1,
        petName: "Max",
        owner: "John Doe",
        date: "2024-06-10",
        time: "10:00",
        reason: "Vaccination",
    },
    {
        id: 2,
        petName: "Bella",
        owner: "Jane Smith",
        date: "2024-06-11",
        time: "14:00",
        reason: "Checkup",
    },
];

const AdminAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<Partial<Appointment>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = () => {
        if (form.petName && form.owner && form.date && form.time && form.reason) {
            setAppointments([
                ...appointments,
                {
                    id: Date.now(),
                    petName: form.petName,
                    owner: form.owner,
                    date: form.date,
                    time: form.time,
                    reason: form.reason,
                } as Appointment,
            ]);
            setForm({});
        }
    };

    const handleEdit = (id: number) => {
        const appt = appointments.find((a) => a.id === id);
        if (appt) {
            setEditingId(id);
            setForm(appt);
        }
    };

    const handleUpdate = () => {
        if (
            editingId !== null &&
            form.petName &&
            form.owner &&
            form.date &&
            form.time &&
            form.reason
        ) {
            setAppointments(
                appointments.map((a) =>
                    a.id === editingId ? { ...a, ...form } as Appointment : a
                )
            );
            setEditingId(null);
            setForm({});
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({});
    };

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
            <h1>Administrator - Appointments</h1>
            <h2>{editingId ? "Edit Appointment" : "Create Appointment"}</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                    name="petName"
                    placeholder="Pet Name"
                    value={form.petName || ""}
                    onChange={handleInputChange}
                />
                <input
                    name="owner"
                    placeholder="Owner"
                    value={form.owner || ""}
                    onChange={handleInputChange}
                />
                <input
                    name="date"
                    type="date"
                    value={form.date || ""}
                    onChange={handleInputChange}
                />
                <input
                    name="time"
                    type="time"
                    value={form.time || ""}
                    onChange={handleInputChange}
                />
                <input
                    name="reason"
                    placeholder="Reason"
                    value={form.reason || ""}
                    onChange={handleInputChange}
                />
                {editingId ? (
                    <>
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </>
                ) : (
                    <button onClick={handleCreate}>Create</button>
                )}
            </div>
            <h2>All Appointments</h2>
            <table border={1} cellPadding={8} style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>Pet Name</th>
                        <th>Owner</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appt) => (
                        <tr key={appt.id}>
                            <td>{appt.petName}</td>
                            <td>{appt.owner}</td>
                            <td>{appt.date}</td>
                            <td>{appt.time}</td>
                            <td>{appt.reason}</td>
                            <td>
                                <button onClick={() => handleEdit(appt.id)}>Edit</button>
                                {/* You can add a delete button here if needed */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminAppointments;