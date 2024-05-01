import express from "express";
import { dirname } from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";
import puppeteer from "puppeteer";
import cors from "cors";
import fs from "fs";
const app = express();
//setting view engine to ejs
app.set("view engine", "ejs");
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDirectory = path.join(__dirname, "./");

//setting CORS
app.use(cors({
  origin:['http://localhost:5173','https://resumebuilderrohit.netlify.app/']
}))
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const dummyEducation = [
  {
    qualification: "Graduation",
    university: "Graphic era hill university, Dehradun",
    year: "2021-2025",
    grade: "8.28 CGPA",
  },
  {
    qualification: "Intermediate",
    university: "G.S.Convent",
    year: "2020",
    grade: "89%",
  },
  {
    qualification: "Matriculation",
    university: "Shelley School",
    year: "2018",
    grade: "89%",
  },
];
const dummyInternships = [
  {
    title: "Software Engineering Intern at ABC Tech Solutions:",
    duration: "summer 2024",
    desc: [
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae in cum aliquid ratione a velit repudiandae perspiciatis voluptatem perferendis facere.",
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos, ratione. Fugit aliquam aperiam numquam illo totam, ad sint molestiae consequuntur?",
      "Duration: 4 months",
    ],
  },
  {
    title: "Software Engineering Intern at ABC Tech Solutions:",
    duration: "summer 2023",
    desc: [
      "Software Engineering Intern at ABC Tech Solutions:",
      "Collaborated with senior engineers to design and implement new features.",
      "Conducted code reviews and debugging sessions.",
      "Duration: 4 months",
    ],
  },
];

async function pdfGenerator(req, res) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const ejsTemplatePath = path.join(__dirname, "views", "resume.ejs");
  // const webURL = `${req.protocol}://${req.get("host")}/preview`;
  const html = await ejs.renderFile(ejsTemplatePath, req.body.resumeData);
  const cssFilePath = path.join(__dirname, "public", "css", "sample1.css");
  const css = fs.readFileSync(cssFilePath, "utf8");
  const htmlWithCSS = `
    <html>
      <head>
        <style>${css}</style>
        <link rel="stylesheet" type="text/css" href="path/to/your/external.css">
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
  await page.emulateMediaType("screen");
  await page.emulateMediaFeatures([{ name: "color-gamut", value: "srgb" }]);

  await page.setContent(htmlWithCSS, { waitUntil: "networkidle2" });

  // const d = new Date();
  // const pdf = await page.pdf({
  //   path: path.join(baseDirectory,'public','files',d.getTime()+'.pdf'),
  //   margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
  //   printBackground: true,
  //   format: "A4",
  // });
  const pdf = await page.pdf({
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  });

  await browser.close();
  // const pdfURL = path.join(baseDirectory,'public','files',d.getTime()+'.pdf');
  // res.download(pdfURL,(err)=>{
  //   if(err){
  //     console.log(err);
  //   }
  // })
  res.contentType("application/pdf");
  res.send(pdf);
}

app.post("/generate", pdfGenerator);
app.get("/", (req, res) => {
  // const data = JSON.parse(JSON.stringify(req.body.resumeData));
  res.render("home");
});

app.listen(port, () => {
  console.log("listening on port 3000");
});
