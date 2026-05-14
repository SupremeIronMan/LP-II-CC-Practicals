import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const apiOrigin = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const EVENTS_URL = `${apiOrigin}/api/events`;
const REG_URL = `${apiOrigin}/api/registrations`;

function toDatetimeLocalValue(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

function App() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regForm, setRegForm] = useState({
    eventId: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxAttendees: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editEvent, setEditEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxAttendees: "",
  });

  const countsByEvent = useMemo(() => {
    const m = {};
    for (const r of registrations) {
      let idKey;
      if (r.event && typeof r.event === "object" && r.event._id != null) {
        idKey = String(r.event._id);
      } else if (r.event != null) {
        idKey = String(r.event);
      } else {
        continue;
      }
      m[idKey] = (m[idKey] || 0) + 1;
    }
    return m;
  }, [registrations]);

  const refresh = async () => {
    try {
      setLoading(true);
      setError("");
      const [ev, reg] = await Promise.all([
        axios.get(EVENTS_URL),
        axios.get(REG_URL),
      ]);
      setEvents(ev.data);
      setRegistrations(reg.data);
      setRegForm((f) => ({
        ...f,
        eventId: f.eventId || (ev.data[0]?._id ?? ""),
      }));
    } catch (e) {
      setError("Could not load events or registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const register = async (e) => {
    e.preventDefault();
    if (!regForm.eventId) {
      setError("Pick an event.");
      return;
    }
    try {
      setError("");
      await axios.post(REG_URL, {
        eventId: regForm.eventId,
        fullName: regForm.fullName.trim(),
        email: regForm.email.trim(),
        phone: regForm.phone.trim(),
      });
      setRegForm((f) => ({
        ...f,
        fullName: "",
        email: "",
        phone: "",
      }));
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try another email or event."
      );
    }
  };

  const removeRegistration = async (id) => {
    if (!window.confirm("Remove this registration?")) return;
    try {
      setError("");
      await axios.delete(`${REG_URL}/${id}`);
      setRegistrations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError("Could not remove registration.");
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await axios.post(EVENTS_URL, {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        location: newEvent.location,
        maxAttendees: newEvent.maxAttendees || undefined,
      });
      setNewEvent({
        title: "",
        description: "",
        date: "",
        location: "",
        maxAttendees: "",
      });
      await refresh();
    } catch (err) {
      setError("Could not create event.");
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev._id);
    setEditEvent({
      title: ev.title,
      description: ev.description,
      date: toDatetimeLocalValue(ev.date),
      location: ev.location,
      maxAttendees:
        typeof ev.maxAttendees === "number" && ev.maxAttendees >= 1
          ? String(ev.maxAttendees)
          : "",
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEvent = async (id) => {
    try {
      setError("");
      const payload = {
        title: editEvent.title,
        description: editEvent.description,
        date: editEvent.date,
        location: editEvent.location,
      };
      if (editEvent.maxAttendees.trim() === "") {
        payload.maxAttendees = "";
      } else {
        payload.maxAttendees = Number(editEvent.maxAttendees);
      }
      const { data } = await axios.put(`${EVENTS_URL}/${id}`, payload);
      setEvents((prev) => prev.map((x) => (x._id === id ? data : x)));
      cancelEdit();
    } catch (err) {
      setError("Could not update event.");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event and its registrations?")) return;
    try {
      setError("");
      await axios.delete(`${EVENTS_URL}/${id}`);
      await refresh();
    } catch (err) {
      setError("Could not delete event.");
    }
  };

  const capLabel = (ev) => {
    const idKey = String(ev._id);
    const used = countsByEvent[idKey] || 0;
    if (typeof ev.maxAttendees === "number" && ev.maxAttendees >= 1) {
      return `${used} / ${ev.maxAttendees} registered`;
    }
    return `${used} registered (no cap)`;
  };

  return (
    <div className="container">
      <h1>Event registration</h1>
      <p className="subtitle">
        Pick an event, submit your details, and see the list update. Same stack as the
        other small MERN demos—no auth, no payments.
      </p>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section>
            <h2>Register</h2>
            <form onSubmit={register} className="form">
              <label htmlFor="eventId">Event</label>
              <select
                id="eventId"
                required
                value={regForm.eventId}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, eventId: e.target.value }))
                }
              >
                <option value="" disabled>
                  Select…
                </option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title} — {formatWhen(ev.date)}
                  </option>
                ))}
              </select>
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                required
                value={regForm.fullName}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, fullName: e.target.value }))
                }
              />
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={regForm.email}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <label htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                value={regForm.phone}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
              <button type="submit">Submit registration</button>
            </form>
          </section>

          <section>
            <h2>Events</h2>
            <div className="events">
              {events.map((ev) => (
                <div key={ev._id} className="event-card">
                  {editingId === ev._id ? (
                    <div className="edit-panel">
                      <input
                        value={editEvent.title}
                        onChange={(e) =>
                          setEditEvent((s) => ({ ...s, title: e.target.value }))
                        }
                      />
                      <textarea
                        value={editEvent.description}
                        onChange={(e) =>
                          setEditEvent((s) => ({
                            ...s,
                            description: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="datetime-local"
                        value={editEvent.date}
                        onChange={(e) =>
                          setEditEvent((s) => ({ ...s, date: e.target.value }))
                        }
                      />
                      <input
                        placeholder="Location"
                        value={editEvent.location}
                        onChange={(e) =>
                          setEditEvent((s) => ({
                            ...s,
                            location: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Max attendees (blank = no limit)"
                        value={editEvent.maxAttendees}
                        onChange={(e) =>
                          setEditEvent((s) => ({
                            ...s,
                            maxAttendees: e.target.value,
                          }))
                        }
                      />
                      <div className="row">
                        <button type="button" onClick={() => saveEvent(ev._id)}>
                          Save
                        </button>
                        <button
                          type="button"
                          className="secondary small"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{ev.title}</strong>
                      <p>{ev.description}</p>
                      <div className="meta">
                        {formatWhen(ev.date)} · {ev.location}
                        <br />
                        {capLabel(ev)}
                      </div>
                      <div className="row">
                        <button
                          type="button"
                          className="secondary small"
                          onClick={() => startEdit(ev)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger small"
                          onClick={() => deleteEvent(ev._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Registrations</h2>
            {registrations.length === 0 ? (
              <p>No registrations yet.</p>
            ) : (
              <ul className="reg-list">
                {registrations.map((r) => (
                  <li key={r._id}>
                    <div>
                      <strong>{r.fullName}</strong> ({r.email})
                      {r.phone ? ` · ${r.phone}` : ""}
                      <div className="meta">
                        {r.event?.title || "Event"} · {formatWhen(r.createdAt)}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="danger small"
                      onClick={() => removeRegistration(r._id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2>Add event</h2>
            <form onSubmit={createEvent} className="form">
              <input
                required
                placeholder="Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent((s) => ({ ...s, title: e.target.value }))
                }
              />
              <textarea
                required
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent((s) => ({ ...s, description: e.target.value }))
                }
              />
              <label htmlFor="newDate">Date and time</label>
              <input
                id="newDate"
                type="datetime-local"
                required
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent((s) => ({ ...s, date: e.target.value }))
                }
              />
              <input
                required
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent((s) => ({ ...s, location: e.target.value }))
                }
              />
              <input
                type="number"
                min="1"
                placeholder="Max attendees (optional)"
                value={newEvent.maxAttendees}
                onChange={(e) =>
                  setNewEvent((s) => ({ ...s, maxAttendees: e.target.value }))
                }
              />
              <button type="submit">Create event</button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
