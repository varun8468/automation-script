import axios from "axios";
import * as cheerio from "cheerio";

const url =
  "https://www.sec.gov/edgar/filer-information/current-edgar-technical-specifications";

(async function getHtml() {
  try {
    let res = await axios.get(url);
    handleHtml(res.data);
  } catch (err) {
    console.log(err);
  }
})();

function handleHtml(html) {
  let $ = cheerio.load(html);
  const ulElement = $(".field_left_1_box ul").first();
  const anchorTags = ulElement.find("li a");
  anchorTags.each((index, element) => {
    const href = $(element).attr("href");
    if(!href.includes("www")){
        console.log(`Items ${index + 1}: ${href}`)
    }
  });
}


