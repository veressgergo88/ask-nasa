import "./style.css";
import http from "axios";
import { z } from "zod";

const ApodResponseSchema = z.object({
  date: z.string(),
  explanation: z.string(),
  hdurl: z.string().url(),
  media_type: z.string(),
  service_version: z.string(),
  title: z.string(),
  url: z.string().url(),
  copyright: z.string().optional()
})

type ApodResponseSchema = z.infer<typeof ApodResponseSchema>

const apiDefaultLoad = async (): Promise<ApodResponseSchema | null> => {
  const response = await http.get("https://api.nasa.gov/planetary/apod?api_key=WF3e0bbEjS5OAec5vUMc6carOEPjYpuQB9lIsZNf");
  const data = response.data;
  console.log(data)
  const result = ApodResponseSchema.safeParse(data);
  console.log(result)
  
  if (!result.success) {
    console.error("Invalid API response:", result.error);
    return null;
  }
  else {
    return result.data
  }
};

const loadData = async () => {
  const apiData = await apiDefaultLoad()
  if(apiData){
    const datePicker = document.getElementById("dateSelector")! as HTMLInputElement
    datePicker.value = apiData.date
    document.getElementById("dayOfThePictureTitle")!.innerHTML = apiData.title
    const img = document.querySelector("img")
    img!.src = apiData.url
    document.getElementById("dayOfThePictureExplanation")!.innerHTML = apiData.explanation
    apiData.copyright !== undefined ? document.getElementById("dayOfThePictureAuthor")!.innerHTML = apiData.copyright : document.getElementById("dayOfThePictureAuthor")!.innerHTML = ""
  } 
}

loadData()

const apiDateLoad = async (): Promise<ApodResponseSchema | null> => {
  const dateValue = (document.getElementById("dateSelector")! as HTMLInputElement).value
  const response = await http.get(`https://api.nasa.gov/planetary/apod?date=${dateValue}&api_key=WF3e0bbEjS5OAec5vUMc6carOEPjYpuQB9lIsZNf`);
  const data = response.data;
  console.log(data)
  const result = ApodResponseSchema.safeParse(data);
  console.log(result)
  
  if (!result.success) {
    console.error("Invalid API response:", result.error);
    return null;
  }
  else {
    return result.data
  }
}

document.getElementById("dateSelector")!.addEventListener("change", async () => {
  const apiData = await apiDateLoad()
  if(apiData){
    const datePicker = document.getElementById("dateSelector")! as HTMLInputElement
    datePicker.value = apiData.date
    document.getElementById("dayOfThePictureTitle")!.innerHTML = apiData.title
    const img = document.querySelector("img")
    img!.src = apiData.url
    document.getElementById("dayOfThePictureExplanation")!.innerHTML = apiData.explanation
    apiData.copyright !== undefined ? document.getElementById("dayOfThePictureAuthor")!.innerHTML = apiData.copyright : document.getElementById("dayOfThePictureAuthor")!.innerHTML = ""
  } 
})
