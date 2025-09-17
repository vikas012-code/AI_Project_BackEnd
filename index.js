const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { InferenceClient } = require("@huggingface/inference") ;
const { fal } = require ("@fal-ai/client") ;
const fs = require("fs");


const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.api_key });

// const client = new InferenceClient(process.env.HF_TOKEN);

// fal.config({
//   credentials: process.env.fal_key,
// });

app.get("/",(req ,res)=>{
    res.status(200).send("server is ok")
})

app.post("/api/generate-text", async (req, res) => {
  const { prompt } = req.body;
  console.log("prompt ",prompt)
  try {
    const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt
    });

    console.log("res ",response)

    // const data = await response.output[0].content;

    // console.log("data ",data)

    res.json({ result: response.output_text });
    
  } catch (error) {
    console.log(error)
    res.status(400).send("Error")
  }
});




app.post("/api/generate-image", async (req, res) => {

const prompt = req?.body?.prompt ||  'shot of vaporwave fashion dog in miami'

// //working but reached limit
// try {
//     const prompt = "Astronaut riding a horse";

//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_TOKEN}`, // 🔑 put token in .env
//           "Content-Type": "application/json",
//         },
//         method: "POST",
//         body: JSON.stringify({ inputs: prompt }),
//       }
//     );

//     if (!response.ok) {
//       const err = await response.json();
//       return res.status(500).json(err);
//     }

//     // HF returns raw image bytes → convert and send as PNG
//     const buffer = await response.arrayBuffer();
//     res.setHeader("Content-Type", "image/png");
//     res.send(Buffer.from(buffer));
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Image generation failed" });
//   }

// //working but reached limit
// try {
//     const prompt = "Astronaut riding a horse";

//     const response = await fetch(`https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`, {
//       headers: {
//         Authorization: `Bearer ${process.env.HF_TOKEN}`,
//         "Content-Type": "application/json"
//       },
//       method: "POST",
//       body: JSON.stringify({ inputs: prompt })
//     });

//     if (!response.ok) {
//       const err = await response.json();
//       return res.status(500).json(err);
//     }

//     const base64Image = Buffer.from(response, 'binary').toString ('base64')

//     const resultImage =  `data:image/png;base64,${base64image}`

//     res.setHeader("Content-Type", "image/png");
//     res.send(resultImage);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Image generation failed" });
//   }


try {

  const form = new FormData()
  form.append('prompt', prompt)

  fetch('https://clipdrop-api.co/text-to-image/v1', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.clipdrop,
  },
  body: form,
  })
  .then(response => response.arrayBuffer())
  .then(buffer => {
    const base64 = Buffer.from(buffer).toString("base64");
    // const dataUrl = `data:image/png;base64,${base64}`;

    fs.writeFileSync("output.png", Buffer.from(base64, "base64"));
    // console.log(dataUrl); // you can send this to frontend


    const buffer1 = Buffer.from(base64, "base64");

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer1)


    // res.setHeader("Content-Type", "image/PNG");
    // res.send(base64);

  })
  
} catch (error) {
  console.log(error)
  res.status(400).send(error)
}




//fake image response
// try {

//   const prompt = req?.body?.prompt 

//   if(prompt){

//     setTimeout(()=>{
//       fs.readFile("./output.png",(err ,data)=>{
//       if(err){
//         console.log(err)
//         res.status(400).send(err)
//       }
//       else{
//         console.log(prompt)
//         res.setHeader("Content-Type", "image/png")
//         res.status(200).send(data)
//       }
//     })
//     },4000)

//   }
//   else{
//     throw new Error("something wrong with prompt");
//   }
  
// } catch (error) {

//   console.log("error ",error)
//   res.send({status:"error" , message: error})
  
// }

});

app.listen(5000, () => console.log("Server running on port 5000"));