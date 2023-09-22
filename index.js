import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;
const d = new Date();

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthsName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const date = d.getDate();
const month = monthsName[d.getMonth()];
const day = weekday[d.getDay()];
const year = d.getFullYear();

const mongodbURL = process.env.mongodbURL;

await mongoose.connect(mongodbURL);

const itemSchema = new mongoose.Schema({
  description: String,
  isChecked: Boolean,
});
const HomeItem = mongoose.model("home", itemSchema);
const WorkItem = mongoose.model("work", itemSchema);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const homeData = await HomeItem.find();
  res.render("home.ejs", {
    tasks: homeData,
    day: day,
    date: date,
    month: month,
    year: year,
    numberOfTasks: homeData.length,
    page: "/",
  });
});
// add data to home
app.post("/", async (req, res) => {
  const { isChecked, id, task } = req.body;
  if (task) {
    const item = new HomeItem({ description: task, isChecked: false });
    await item.save();
  }
  if (isChecked !== undefined && id) {
    await HomeItem.updateOne({ _id: id }, { isChecked: isChecked });
  }
  res.redirect("/");
});

// Work page

app.get("/work", async (req, res) => {
    const workData = await WorkItem.find();
    res.render("home.ejs", {
        tasks: workData,
        numberOfTasks: workData.length,
        day: day,
        date: date,
        month: month,
        year: year,
        page: "/work",
    });
});

app.post("/work", async (req, res) => {
  const { isChecked, id, task } = req.body;
  if (task) {
    const item = new WorkItem({ description: task, isChecked: false });
    await item.save();
  }
  if (isChecked !== undefined && id) {
    await WorkItem.updateOne({ _id: id }, { isChecked: isChecked });
  }
  res.redirect("/work");
});

// Delete list item
app.post("/delete", async (req, res) => {
    const id = req.body.deleteIconID;
    await HomeItem.deleteOne({ _id: id });
    res.redirect("/");
})

app.post("/workdelete", async (req, res) => {
    const id = req.body.deleteIconID;
    await WorkItem.deleteOne({ _id: id });
    res.redirect("/work");
})


app.listen(port, (err) => {
  if (err) throw err;
});
