import { useEffect, useState } from "react";
import { fetchImages } from "./utils/imageApi";
import type { CarouselImage } from "./utils/imageApi";
import GroupCarousel from "./components/GroupCarousel";

function App() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const result = await fetchImages("casino", 50, 1);
        setImages(result.images);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start p-6 space-y-8">
      <h1 className="text-4xl font-bold text-white text-center mt-5">
        <span className="text-yellow-400">BigBet</span> Casino • Infinite
        Possibilities
      </h1>

      {/* Loading state */}
      {loading && <div className="text-white text-lg">Loading images...</div>}

      {/* Error state */}
      {error && <div className="text-red-500 text-lg">Error: {error}</div>}

      {/* Carousel display */}
      {images.length > 0 && !loading && (
        <GroupCarousel initialImages={images} />
      )}
    </div>
  );
}

export default App;
