import mongoose from "mongoose";

const processedItemSchema = new mongoose.Schema({
  url: {
    type: String,
    unique: true,
  },
  subheading: String, 
  body: String,
  title: String
});

const ProcessedItem = mongoose.model("ProcessedItem", processedItemSchema);


export default ProcessedItem;
