import axios from "axios";

export default async function getVideoMetaData(videoId) {
  // enable api key and setup next.config.js
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.GOOGLE_API_KEY}&part=snippet,contentDetails,statistics,status`;

  try {
    // { data: {items: [metadata]}}
    // Clean up the response

    const response = await axios.get(url);
    const data = response.data

    const metadata = data.items[0];

    const videoTitle = metadata.snippet.title;
    const videoDescription = metadata.snippet.description;
    const shortenedDescription = videoDescription.split(".")[0];

    const shortMetadata = {
      videoTitle,
      videoDescription: shortenedDescription,
      videoId,

    }

    return shortMetadata;

  } catch (err) {
    console.error(`Failed to get metadata: ${err}`);
  }
}
