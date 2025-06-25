// Type definitions for Picsum API response
export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

// Type for our processed image data
export interface CarouselImage {
  id: string;
  src: string;
  author: string;
  originalWidth: number;
  originalHeight: number;
}

const BASE_URL = "https://picsum.photos";

export const fetchImages = async (
  count: number = 12,
  width: number = 200,
  height: number = 200
): Promise<CarouselImage[]> => {
  try {
    // Fetch the list of available images
    const response = await fetch(`${BASE_URL}/v2/list?limit=${count}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    const images: PicsumImage[] = await response.json();

    // Transform to our carousel format with custom dimensions
    return images.map((image) => ({
      id: image.id,
      src: `${BASE_URL}/id/${image.id}/${width}/${height}`,
      author: image.author,
      originalWidth: image.width,
      originalHeight: image.height,
    }));
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};
