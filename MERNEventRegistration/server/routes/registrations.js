const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { eventId } = req.query;
    const filter = {};
    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
      filter.event = eventId;
    }
    const list = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("event", "title date location");
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch registrations." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).populate(
      "event",
      "title description date location maxAttendees"
    );
    if (!reg) {
      return res.status(404).json({ message: "Registration not found." });
    }
    return res.json(reg);
  } catch (error) {
    return res.status(400).json({ message: "Invalid registration id." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { eventId, fullName, email, phone } = req.body;
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "A valid eventId is required." });
    }
    if (!fullName || !email) {
      return res.status(400).json({ message: "Full name and email are required." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (typeof event.maxAttendees === "number" && event.maxAttendees >= 1) {
      const count = await Registration.countDocuments({ event: eventId });
      if (count >= event.maxAttendees) {
        return res.status(409).json({ message: "This event is full." });
      }
    }

    const registration = await Registration.create({
      event: eventId,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone != null ? String(phone).trim() : "",
    });

    const populated = await registration.populate("event", "title date location");
    return res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "You are already registered for this event with that email." });
    }
    return res.status(400).json({ message: "Could not complete registration." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const reg = await Registration.findByIdAndDelete(req.params.id);
    if (!reg) {
      return res.status(404).json({ message: "Registration not found." });
    }
    return res.json({ message: "Registration removed." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid registration id." });
  }
});

module.exports = router;
