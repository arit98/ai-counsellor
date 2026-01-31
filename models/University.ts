import mongoose from 'mongoose';

const UniversitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    ranking: { type: Number, required: true },
    tuition: { type: Number, required: true },
    admissionRate: { type: Number, required: true },
    studentsCount: { type: Number, required: true },
    programs: [{ type: String }],
    scholarships: { type: Number, required: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
    image: { type: String },
}, { timestamps: true });

export default mongoose.models.University || mongoose.model('University', UniversitySchema);
