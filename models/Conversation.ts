import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant', 'system', 'data', 'tool'], required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const ConversationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    messages: [ChatMessageSchema],
}, { timestamps: true });

if (mongoose.models.Conversation) {
    delete mongoose.models.Conversation;
}

export default mongoose.model('Conversation', ConversationSchema);
