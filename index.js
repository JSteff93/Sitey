import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const API_URL = "https://api.todoist.com/rest/v2"

const yourBearerToken = "d67ee2fb5eac469f33342ff57c89d46212487ad7";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.get("/", async (req, res) => {
    const projects = await axios.get(API_URL + "/projects", config);
    const sections = await axios.get(API_URL + "/sections", config);
    const tasks = await axios.get(API_URL + "/tasks", config);

    res.render("index.ejs", { projects: projects.data, sections: sections.data, tasks: tasks.data });
  });

app.post("/post", async (req, res) => {
  // console.log(req.body);
  const pId = req.body.projId;
  // console.log(pId);
  const postTask = req.body.content;
  try {
    const tasks = await axios.post(API_URL + "/tasks", {
      project_id: pId,
      content: postTask
    }, config);
    res.redirect("/");
} catch (error) {
  res.render("index.ejs", "error");
}
})

app.post("/postsect", async (req, res) => {
  // console.log(req.body);
  const sId = req.body.sectId;
  // console.log(pId);
  const postTask = req.body.content;
  try {
    const tasks = await axios.post(API_URL + "/tasks", {
      section_id: sId,
      content: postTask
    }, config);
    res.redirect("/");
} catch (error) {
  res.render("index.ejs", "error");
}
})

app.post("/complete", async (req, res) => {
  const ptId = req.body.taskId;
  console.log(ptId);
try {
    const tasks = await axios.post(API_URL + "/tasks/" + ptId + "/close", config);
    res.redirect("/");
  } catch (error) {
    res.render("index.ejs", "error");
  }
})

app.post("/delete", async (req, res) => {
  console.log(req.body)
  const pId = req.body.taskId;
  console.log(pId);
try {
    const tasks = await axios.delete(API_URL + "/tasks/" + pId, config);
    res.redirect("/");
  } catch (error) {
    res.render("index.ejs", "error");
  }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });