import axios from "axios";
import tiktok from "./assets/img/tiktok.svg";
import facebook from "./assets/img/facebook.svg";
import youtube from "./assets/img/youtube.svg";
import instagram from "./assets/img/instagram.svg";

export const MAX_KEYWORDS = 5;

export const MAX_CHARACTERS: { [key: string]: string } = {
  'youtube': '60-100',
  'facebook': '60-100',
  'tiktok': '40-80',
  'instagram': '70-100',
}

export const images: { [key: string]: string } = {
  'tiktok': tiktok,
  'facebook': facebook,
  'youtube': youtube,
  'instagram': instagram
}

export const getServerTime = async (): Promise<Date | null> => {
  try {
    const response = await axios.get('https://worldtimeapi.org/api/timezone/Etc/UTC');
    const serverTime = new Date(response.data.utc_datetime);
    return serverTime;
  } catch (error) {
    console.error('Error fetching server time:', error);
    return null;
  }
};

export const dataPreparationForPromt = (keywords: string[], services: string[]) => {
  const promt_one = `Create catchy and trending titles for ${services[0]} social media account.Total of ${MAX_CHARACTERS[services[0]]} characters long, using following words: ${keywords.join(', ')}. And add trending hashtags at the end of the sentence.`;
  const promt_two = `Create ${services.length} catchy and trending titles for ${services.length} social media accounts: ${services.join(', ')}. Total of ${MAX_CHARACTERS[services[0]]} characters long for ${services[0]},  ${MAX_CHARACTERS[services[1]]} for ${services[1]}${services.length > 2 ? services.length > 3 ? `, ${MAX_CHARACTERS[services[2]]} for ${services[2]}, ${MAX_CHARACTERS[services[3]]} for ${services[3]}` : `, ${MAX_CHARACTERS[services[2]]} for ${services[2]}` : ''}, using following words: ${keywords.join(', ')}. And add trending hashtags at the end of the sentence.
  Show result in ${services.length} separate results. Exclude quotation marks.`
  const result = services.length > 1 ? promt_two : promt_one;

  return result;
}

