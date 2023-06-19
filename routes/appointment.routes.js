const appointment = require("../controllers/appointment.controller");
const router = require("express").Router();

module.exports = app => {
    // Create a new appointment
    router.post("/", appointment.create);

    // Retrieve all appointments
    router.get("/", appointment.findAll);

    // Retrieve a single appointment with id
    router.get("/:id", appointment.findOne);

    // Retrieve all appointments with userId
    router.get("/users/:id", appointment.findAllByUserId);

    // Retrieve all appointments for a Dental office
    router.get("/dentals/:id", appointment.findAllByDentalId);

    // Retrieve all appointments with a Doctor
    router.get("/doctors/:id", appointment.findAllByDoctorId);

    // Update an appointment with id
    router.put("/:id", appointment.update);

    // Update an appointment with id and patch only included fields
    router.patch("/:id", appointment.patch);

    // Delete an appointment with id
    router.delete("/:id", appointment.delete);

    // Delete an appointment with id and userId
    router.delete("/:id/users/:userId", appointment.deleteByIdAndByUserId);

    // Delete all appointments for userId
    router.delete("/users/:id", appointment.deleteAllByUserId);

    // Delete all appointments - Oh no!
    router.delete("/", appointment.deleteAll);

    app.use("/appointments", router);
};
