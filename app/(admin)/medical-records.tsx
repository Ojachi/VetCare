import React, { useEffect, useState } from "react";

type MedicalRecord = {
    id: string;
    patientName: string;
    diagnosis: string;
    date: string;
};

const mockFetchMedicalRecords = async (): Promise<MedicalRecord[]> => [
    { id: "1", patientName: "Max", diagnosis: "Otitis", date: "2024-06-01" },
    { id: "2", patientName: "Luna", diagnosis: "Parvovirus", date: "2024-05-20" },
];

const MedicalRecordsAdmin: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [editing, setEditing] = useState<MedicalRecord | null>(null);
    const [form, setForm] = useState<Omit<MedicalRecord, "id">>({
        patientName: "",
        diagnosis: "",
        date: "",
    });

    useEffect(() => {
        mockFetchMedicalRecords().then(setRecords);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            setRecords((prev) =>
                prev.map((r) =>
                    r.id === editing.id ? { ...editing, ...form } : r
                )
            );
            setEditing(null);
        } else {
            setRecords((prev) => [
                ...prev,
                { id: Date.now().toString(), ...form },
            ]);
        }
        setForm({ patientName: "", diagnosis: "", date: "" });
    };

    const handleEdit = (record: MedicalRecord) => {
        setEditing(record);
        setForm({
            patientName: record.patientName,
            diagnosis: record.diagnosis,
            date: record.date,
        });
    };

    const handleDelete = (id: string) => {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        if (editing && editing.id === id) {
            setEditing(null);
            setForm({ patientName: "", diagnosis: "", date: "" });
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <h1>Historiales Médicos (Admin)</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                <input
                    name="patientName"
                    placeholder="Nombre del paciente"
                    value={form.patientName}
                    onChange={handleChange}
                    required
                />
                <input
                    name="diagnosis"
                    placeholder="Diagnóstico"
                    value={form.diagnosis}
                    onChange={handleChange}
                    required
                />
                <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setForm({ patientName: "", diagnosis: "", date: "" });
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </form>
            <table width="100%" border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>Paciente</th>
                        <th>Diagnóstico</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.id}>
                            <td>{record.patientName}</td>
                            <td>{record.diagnosis}</td>
                            <td>{record.date}</td>
                            <td>
                                <button onClick={() => handleEdit(record)}>Editar</button>
                                <button onClick={() => handleDelete(record.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    {records.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center" }}>
                                No hay historiales médicos.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MedicalRecordsAdmin;