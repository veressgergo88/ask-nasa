import "./style.css";
import http from "axios";
import { z } from "zod";

// Létrehozzuk a sémát az API válaszhoz
const ApodResponseSchema = z.object({
  date: z.string().transform((val) => new Date(val)), // Átalakítjuk a dátumot Date objektummá
  explanation: z.string(),
  hdurl: z.string().url(),
  media_type: z.string(),
  service_version: z.string(),
  title: z.string(),
  url: z.string().url(),
  copyright: z.string().optional()
});

// Meghatározzuk a Promise típusát
type ApodResponse = z.infer<typeof ApodResponseSchema>;


// Létrehozzuk az API requestet és ellenőrizzük az adatokat a sémával
const load = async (): Promise<ApodResponse | null> => {
  try {
    const response = await http.get("https://api.nasa.gov/planetary/apod?api_key=WF3e0bbEjS5OAec5vUMc6carOEPjYpuQB9lIsZNf");
    const data = response.data;
    const result = ApodResponseSchema.safeParse(data);

    if (!result.success) {
      console.error("Invalid API response:", result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("API request error:", error);
    return null;
  }
};

// Létrehozzuk a fő függvényt, amely lekéri az adatokat és kiírja a HTML-be
const init = async () => {
  const apod = await load();
  if (apod) {
    const button = document.getElementById('load-button')
    button!.style.display = "none"
    const formattedDate = `${apod.date.getFullYear()}.${String(apod.date.getMonth() + 1).padStart(2, '0')}.${String(apod.date.getDate()).padStart(2, '0')}`;
    document.getElementById("today")!.innerHTML = formattedDate;

    document.getElementById("dayOfThePictureTitle")!.innerHTML = apod.title;
    const img = document.querySelector("img")!;
    img.src = apod.url;
    document.getElementById("dayOfThePictureExplanation")!.innerHTML = apod.explanation;
    
    // Ellenőrizzük, hogy a copyright mező létezik-e
     if (apod.copyright !== undefined) {
      document.getElementById("dayOfThePictureAuthor")!.innerHTML = apod.copyright;
    } else {
      // Ha nincs copyright mező a válaszban, ne írjunk semmit
      document.getElementById("dayOfThePictureAuthor")!.innerHTML = "";
    }
  }
}

// Létrehozzuk a gomb lenyomásának hatását, amely létrehozza az API kapcsolatot és kiíratja az adatokat a HTML-be
document.getElementById("load-button")!.addEventListener("click", init);