const mongoose= require("mongoose")

const chatSchema = new mongoose.Schema({
  role: { type: String, required: true }, // user | assistant
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports= mongoose.model("Chat", chatSchema);
