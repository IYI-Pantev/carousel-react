export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  user: string;
  userImageURL: string;
}

interface PixabayApiResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

// Keep this interface for your carousel component
export interface CarouselImage {
  id: string;
  src: string;
  author: string;
  originalWidth: number;
  originalHeight: number;
}

const BASE_URL = "https://pixabay.com/api";
const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

export const fetchImages = async (
  query: string = "casino",
  perPage: number = 50,
  page: number = 1
): Promise<{ images: CarouselImage[]; hasMore: boolean }> => {
  try {
    // Check if API key is available
    if (!PIXABAY_KEY) {
      throw new Error(
        "Pixabay API key not found. Make sure VITE_PIXABAY_API_KEY is set in your .env file"
      );
    }

    // Fetch the list of available images
    const response = await fetch(
      `${BASE_URL}/?key=${PIXABAY_KEY}&q=${encodeURIComponent(
        query
      )}&image_type=photo&per_page=${perPage}&page=${page}&safesearch=true`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    const data: PixabayApiResponse = await response.json();
    const images: PixabayImage[] = data.hits;

    const carouselImages: CarouselImage[] = images.map((image) => ({
      id: image.id.toString(),
      src: image.webformatURL,
      author: image.user,
      originalWidth: image.imageWidth,
      originalHeight: image.imageHeight,
    }));

    return {
      images: carouselImages,
      hasMore: data.hits.length === perPage,
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};
