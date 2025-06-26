import { useEffect, useState } from "react";
import { fetchImages } from "./utils/imageApi";
import type { CarouselImage } from "./utils/imageApi";

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
        Infinite possibilities
      </h1>

      {/* Loading state */}
      {loading && <div className="text-white text-lg">Loading images...</div>}

      {/* Error state */}
      {error && <div className="text-red-500 text-lg">Error: {error}</div>}

      {/* Images grid - temporary display before carousel */}
      {images.length > 0 && !loading && (
        <div>
          <p className="text-white text-center mb-4">
            Loaded {images.length} images - Showing first 4:
          </p>
          <div className="grid grid-cols-4 gap-4 max-w-4xl">
            {images.slice(0, 4).map((image) => (
              <div key={image.id} className="flex flex-col items-center">
                <img
                  src={image.src}
                  alt={`Photo by ${image.author}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  loading="lazy"
                />
                <p className="text-white text-sm mt-2 text-center">
                  by {image.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
