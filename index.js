const fs = require("fs");

const apptTracking = />\s\d{5,}/g;
const apptReference = /[A-Z]{2}\d{8}-\d{5}/g;
const patMobileNo = /\(\d{3}\)\s\d{3}-\d{4}/g;
const apptDate = /\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}\s[A-Z]{2}/g;
const Name = /\">[A-Za-z]{3,}\s[\s]?[A-Za-z]{3,}/g;
const patAddress =
  /(\w{1,}\s*\w{1,}\s\w{1,},\s)?(\w{1,}\s)?(\w{1,},\s)?(\w(1,)\s)?(\w{1,}\s)?(\w{1,}\s)?(\w{1,}\s\w{1,},\s)?\w{1,},\s*(\s*|\w{1,})\s\w{1,},\s\w{1,},.\d{5}/g;
const apptStatus = /[A-Z]{9}/g;
const htmlData =
  /<tr>(\s*<td.{1,}\s*.{1,}\s*.{1,}\s*<td.{1,}\s*<td.{1,}\s*.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*)\s*<\/tr>/g;

const trackingData = [];
const referenceData = [];
const mobileNoData = [];
const dateData = [];
const addressData = [];
const statusData = [];
const agentName = [];
const patientName = [];

let regexData = " ";

fs.readFile(
  "/home/savera/scaleReal/Regex/sample-example.html",
  "utf8",
  (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const trData = data.match(htmlData);
    trData.map((item) => {
      const name1 = item.match(Name);
      const reference = item.match(apptReference);
      const mobile = item.match(patMobileNo);
      const date = item.match(apptDate);
      const address = item.match(patAddress);
      const status = item.match(apptStatus);
      const tracking = item.match(apptTracking);
      patientName.push(name1[0].substring(2));
      if (name1.length === 1) {
        agentName.push("N/A");
      } else {
        agentName.push(name1[1].substring(2));
      }
      // console.log(patientName[0], agentName[0]);
      reference.map((ref) => {
        referenceData.push(ref);
      });
      mobile.map((mob) => {
        mobileNoData.push(mob);
      });
      // console.log(JSON.stringify(tracking).substring(4))
      let value = JSON.stringify(tracking);
      let temp = "";
      temp = value.substring(4, value.length - 4);
      if (temp === "null") {
        trackingData.push("n/a");
      } else {
        trackingData.push(temp);
      }
      status.map((stat) => statusData.push(stat));
      address.map((addr) => addressData.push(addr));
      date.map((date) => dateData.push(date));
      return;
    });
    for (let i = 0; i < 33; i++) {
      regexData +=
        referenceData[i] +
        " " +
        patientName[i] +
        " " +
        addressData[i] +
        " " +
        mobileNoData[i] +
        " " +
        agentName[i] +
        " " +
        statusData[i] +
        " " +
        trackingData[i] +
        " " +
        dateData[i] +
        "\n";
    }
    fs.writeFile("index.txt", regexData, (err) => {
      if (err) throw err;
    });
  }
);
