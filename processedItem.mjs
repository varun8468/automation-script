import mongoose from "mongoose";

const processedItemSchema = new mongoose.Schema({
  url: {
    type: String,
    unique: true,
  },
  pText: String, 
  liHtml: String,
});

const ProcessedItem = mongoose.model("ProcessedItem", processedItemSchema);


export default ProcessedItem;
