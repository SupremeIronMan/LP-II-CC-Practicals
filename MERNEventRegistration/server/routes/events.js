const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch events." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    return res.json(event);
  } catch (error) {
    return res.status(400).json({ message: "Invalid event id." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, date, location, maxAttendees } = req.body;
    const payload = {
      title,
      description,
      date: new Date(date),
      location,
    };
    const cap = Number(maxAttendees);
    if (Number.isFinite(cap) && cap >= 1) {
      payload.maxAttendees = cap;
    }
    const event = await Event.create(payload);
    return res.status(201).json(event);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create event." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, date, location, maxAttendees } = req.body;
    const set = {};
    if (title !== undefined) set.title = title;
    if (description !== undefined) set.description = description;
    if (date !== undefined) set.date = new Date(date);
    if (location !== undefined) set.location = location;

    const mongoUpdate = {};
    if (Object.keys(set).length) {
      mongoUpdate.$set = set;
    }
    if (maxAttendees === null || maxAttendees === "") {
      mongoUpdate.$unset = { maxAttendees: "" };
    } else if (maxAttendees !== undefined) {
      const cap = Number(maxAttendees);
      if (!Number.isFinite(cap) || cap < 1) {
        return res.status(400).json({ message: "maxAttendees must be at least 1 or left blank for no limit." });
      }
      mongoUpdate.$set = { ...mongoUpdate.$set, maxAttendees: cap };
    }

    if (!mongoUpdate.$set && !mongoUpdate.$unset) {
      return res.status(400).json({ message: "No fields to update." });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, mongoUpdate, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    return res.json(event);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update event." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    await Registration.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(event._id);
    return res.json({ message: "Event deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid event id." });
  }
});

module.exports = router;
