const {Schema} = require("mongoose");
module.exports = mongoose => {
    const appointmentSchema = new mongoose.Schema(
        {
            userId: Number,
            patientName: String,
            dentalId: String,
            dentalName: String,
            doctorId: Number,
            doctorName: String,
            timeSlot: String,
            confirmed: Boolean
        },
        {
            timestamps: true
        }
    );

    appointmentSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("Appointment", appointmentSchema);
}
