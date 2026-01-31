import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    citizenship: { type: String, required: true },
    currentLevel: { type: String, required: true },
    gpa: { type: String, required: true },
    gmatScore: { type: String },
    ieltsScore: { type: String },
    toeflScore: { type: String },
    studyField: { type: String, required: true },
    degreeLevel: { type: String, required: true },
    careerGoals: { type: String, required: true },
    countryPreferences: [{ type: String }],
    budgetRange: { type: String, required: true },
    intendedYear: { type: String, required: true },
}, { timestamps: true });

if (mongoose.models.Profile) {
    delete mongoose.models.Profile;
}

export default mongoose.model('Profile', ProfileSchema);
