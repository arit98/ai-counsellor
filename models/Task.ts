import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    universityName: { type: String, required: true },
    task: { type: String, required: true },
    deadline: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    category: { type: String, enum: ['essay', 'documents', 'exam', 'other'], default: 'other' },
}, { timestamps: true });

if (mongoose.models.Task) {
    delete mongoose.models.Task;
}

export default mongoose.model('Task', TaskSchema);
