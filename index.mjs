import axios from "axios";
import mongoose from "mongoose";
import * as cheerio from "cheerio";
import ProcessedItem from "./processedItem.mjs";

mongoose.connect("mongodb://localhost:27017/sec", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const homePageUrl =
  "https://www.sec.gov/edgar/filer-information/current-edgar-technical-specifications";

(async function getHtml() {
  try {
    let res = await axios.get(homePageUrl);
    checkForUpdates(res.data);
  } catch (err) {
    console.log(err);
  }
})();

async function checkForUpdates(html) {
  let $ = cheerio.load(html);
  const ulElement = $(".field_left_1_box ul").first();
  const anchorTags = ulElement.find("li a");
  let count = 0;
  for (const element of anchorTags) {
    const href = $(element).attr("href");
    const existingItem = await ProcessedItem.findOne({ url: href });
    if (!existingItem) {
      try {
        const normalizedUrl = normalizeUrl(href);
        const { pText, liElements } = await extractChangesFromURL(
          normalizedUrl
        );
        if (pText.length !== 0 && liElements.length !== 0) {
          console.log("Title: " + pText);
          for (const element of liElements) {
            console.log($(element).text());
          }
          console.log(
            count++,
            "----------------------------------------------------------------------"
          );
          const processedItem = new ProcessedItem({
            url: href,
            pText: pText,
            liHtml: $(liElements).text(),
          });
          await processedItem.save();
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

function normalizeUrl(inputURL) {
  if (inputURL.startsWith("/")) {
    return `https://www.sec.gov${inputURL}`;
  }
  return inputURL;
}

async function extractChangesFromURL(href) {
  try {
    const res = await axios.get(href);
    const $ = cheerio.load(res.data);
    const parentElement = $("div.field_left_1_box");
    const pText = parentElement
      .find('p:contains("will introduce the following changes:")')
      .text();
    const liElements = parentElement.find("ul li");
    const liHtml = liElements
      .map((index, element) => $.html(element))
      .get()
      .join("");

    return { pText, liElements };
  } catch (err) {
    console.log(err);
  }
}

// extractChangesFromURL(
//   "https://www.sec.gov/info/edgar/specifications/form13fxmltechspec"
// );
