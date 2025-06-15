import { getRandomKeyword } from "../constants/uplash";
import { PUBLIC_UNSPLASH } from "../lib/config";
import axios from "axios";

interface UnsplashPhoto {
  urls: {
    regular: string;
    [key: string]: string;
  };
  [key: string]: unknown;
}

export async function fetchNaturePhotos(
  page: number = 1,
  perPage: number = 10
) {
  const keyword = getRandomKeyword();
  const url = `https://api.unsplash.com/search/photos?query=${keyword}&page=${page}&per_page=${perPage}&client_id=${PUBLIC_UNSPLASH}`;
  try {
    // Using axios directly since this is an external API with a different base URL
    const response = await axios.get(url);
    return response.data.results.map(
      (photo: UnsplashPhoto) => photo.urls.regular
    );
  } catch (error) {
    console.error("Error fetching Unsplash photos:", error);
    return [];
  }
}
