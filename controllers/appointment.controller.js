const db = require("../models")
const Appointment = db.appointment;

//CREATE
exports.create = async (req, res) => {
    Appointment.find(
        {
            dentalId: req.body.dentalId,
            timeSlot: req.body.timeSlot,
            doctorId: req.body.doctorId
        }
    )
        .then(data => {
            if (data.length > 0) {
                res.status(409).send({message: "Timeslot is already booked."});
            } else {
                const appointment = new Appointment(
                    {
                        userId: req.body.userId,
                        patientName: req.body.patientName,
                        dentalId: req.body.dentalId,
                        dentalName: req.body.dentalName,
                        doctorId: req.body.doctorId,
                        doctorName: req.body.doctorName,
                        timeSlot: req.body.timeSlot,
                        confirmed: true
                    }
                );

                appointment
                    .save(appointment)
                    .then(newAppointment => {
                        res.status(201).send(newAppointment);
                    })
                    .catch(err => {
                        res.status(500).send({
                            err: err,
                            message:
                                "Some error occurred while creating a new appointment."
                        });
                    });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving appointment" });
        });
};

// Find all appointments
exports.findAll = (req, res) => {
    Appointment.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving appointments."
            });
        });
};

// Find a single appointment with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Appointment.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Appointment with id " + id + " not found." });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving appointment with id=" + id });
        });
};

// Find all appointments for a user
exports.findAllByUserId = (req, res) => {
    const id = req.params.id;
    Appointment.find({ userId: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No appointment found for a user with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving for an appointment with id = " + id });
        });
};

// Find all appointments for a Dental office
exports.findAllByDentalId = (req, res) => {
    const id = req.params.id;
    Appointment.find({ dentalId: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No appointment found for a Dental office with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving appointment for a Dental office with id = " + id });
        });
};

// Find all appointments for a Doctor
exports.findAllByDoctorId = (req, res) => {
    const id = req.params.id;
    Appointment.find({ doctorId: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No appointment found for a Doctor with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving appointment for a Doctor with id = " + id });
        });
};

// Update an appointment state by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Appointment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update appointment with id=${id}.`
                });
            } else res.send({ message: "Appointment was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Appointment with id=" + id
            });
        });
};

// Update an Appointment by the id in the request
exports.patch = async (req, res) => {
    const id = req.params.id;
    const appointment = await Appointment.findById(id).exec();
    if (!appointment) return res.status(404).send(`Cannot patch an appointment with id=${id}.`);

    let query = {
        userId: req.body.userId,
        dentalId: req.body.dentalId,
        doctorId: req.body.doctorId,
        timeSlot: req.body.timeSlot,
        confirmed: true
    };
    let isFound = false;

    for (let key in req.body) {
        if (appointment[key] !== req.body[key]) { // Check if field exists
            isFound = true;
            query[key] = req.body[key];
        }
    }

    if (isFound) {
        const updatedAppointment = await Appointment.updateOne({_id: id}, query).exec();
        res.send('Appointment was updated successfully!');
    } else
        res.status(404).send(`Cannot patch appointment with id=${id}. All values are same.`);
};

// Delete an appointment with the specified id in the request
exports.delete = (req, res) => {
    const id = req.body.id;
    Appointment.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete appointment with id=${id}. Maybe appointment does not exist!`
                });
            } else {
                res.send({
                    message: "Appointment was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete appointment with id=" + id
            });
        });
};

// Delete one appointment with the specified userid in the request
exports.deleteByIdAndByUserId = (req, res) => {
    const id = req.body.id;
    const userId = req.body.userId;
    Appointment.findByIdAndDelete({ id: id, userId: userId }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete appointment with id=${id} for a User. Maybe appointment does not exist!`
                });
            } else {
                res.send({
                    message: "Appointments was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete appointment with id=" + id
            });
        });
};

// Delete all appointments with the specified userid in the request
exports.deleteAllByUserId = (req, res) => {
    const userId = req.body.userId;
    Appointment.deleteMany({ userId: userId }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete appointments for a User. Maybe appointment does not exist!`
                });
            } else {
                res.send({
                    message: "Appointments deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete appointments"
            });
        });
};

// Delete all appointments from the database.
exports.deleteAll = (req, res) => {
    Appointment.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} appointments were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all appointments."
            });
        });
};
