const Event = require("./models/Event");

function daysFromNow(n) {
  return new Date(Date.now() + n * 86400000);
}

const demoEvents = [
  {
    title: "Neighborhood clean-up day",
    description: "Meet at the park pavilion; supplies provided.",
    date: daysFromNow(10),
    location: "Riverside Park, Main Pavilion",
    maxAttendees: 40,
  },
  {
    title: "Intro to web APIs (workshop)",
    description: "Hands-on session covering REST basics. Bring a laptop.",
    date: daysFromNow(24),
    location: "Public Library, Room B",
    maxAttendees: 18,
  },
  {
    title: "Open town hall",
    description: "Q&A with local organizers. All welcome.",
    date: daysFromNow(5),
    location: "City Community Center",
  },
];

async function seedIfEmpty() {
  const count = await Event.countDocuments();
  if (count > 0) return;
  await Event.insertMany(demoEvents);
  console.log("Seeded demo events.");
}

module.exports = { seedIfEmpty };
