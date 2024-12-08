import express  , {Request , Response} from "express"
import Anthropic from "@anthropic-ai/sdk";
import {systemprompt} from "./systempromp"  ; 
import cors from "cors" ; 
import { TextBlock } from "@anthropic-ai/sdk/resources";

require("dotenv").config() 
const app = express() ; 

app.use(express.json())  ; 
app.use(cors())

const PORT = process.env.PORT ?? 8000

app.get("/"  , (req,res )=>{
    console.log(req)
    res.send("this is anas khan")
})

app.post("/chat" , async(req , res)=>{
    try {
        const data = req.body 
        console.log(data.prompt)
        const message = await chat(data.prompt)
        console.log(message)

        res.json({
            success : true , 
            data: message
        });

    } catch (error) {
        res.json({success : false })
    }

})

async function chat(prompt : string)  : Promise<string> {
    console.log("waiting")
    const anthropic = new Anthropic();
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        temperature: 1,
        system: systemprompt,
        messages: [
            {
                "role"  : "assistant"  , 
                "content"  : [
                    {
                        "type"  : "text"  , 
                        "text"  : "just give me the tweet  "
                    }
                ]
            },
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": `${prompt} just give me the content  `
                } , 
            ]
            }  , 

        ]
        });

    return (msg .content[0] as TextBlock)?.text
    
}






app.listen(PORT   , ()=>{
    console.log (`Server is listening on PORT : ${PORT} `)
})