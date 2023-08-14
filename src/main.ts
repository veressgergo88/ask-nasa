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
  copyright: z.string().optional(),
});

type ApodResponse = z.infer<typeof ApodResponseSchema>;

const apiDefaultLoad = async (date: string): Promise<ApodResponse | null> => {
  let response;
  if (date) {
    response = await http.get(
      `https://api.nasa.gov/planetary/apod?date=${date}&api_key=WF3e0bbEjS5OAec5vUMc6carOEPjYpuQB9lIsZNf`
    );
  } else {
    response = await http.get(
      "https://api.nasa.gov/planetary/apod?api_key=WF3e0bbEjS5OAec5vUMc6carOEPjYpuQB9lIsZNf"
    );
  }
  const data = response.data;
  const result = ApodResponseSchema.safeParse(data);

  if (!result.success) {
    console.error("Invalid API response:", result.error);
    return null;
  } else {
    return result.data;
  }
};

function renderData(apiData: ApodResponse) {
  const datePicker = document.getElementById(
    "dateSelector"
  )! as HTMLInputElement;
  datePicker.value = apiData.date;
  document.getElementById("dayOfThePictureTitle")!.innerHTML = apiData.title;
  const img = document.querySelector("img");
  img!.src = apiData.url;
  document.getElementById("dayOfThePictureExplanation")!.innerHTML =
    apiData.explanation;
  apiData.copyright !== undefined
    ? (document.getElementById("dayOfThePictureAuthor")!.innerHTML =
        apiData.copyright)
    : (document.getElementById("dayOfThePictureAuthor")!.innerHTML = "");
}

const loadData = async () => {
  const apiData = await apiDefaultLoad("");
  if (apiData) renderData(apiData);
};

loadData();

document
  .getElementById("dateSelector")!
  .addEventListener("change", async () => {
    const dateValue = (
      document.getElementById("dateSelector")! as HTMLInputElement
    ).value;
    const apiData = await apiDefaultLoad(dateValue);
    if (apiData) renderData(apiData);
  });
