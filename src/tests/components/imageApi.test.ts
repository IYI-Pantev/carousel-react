import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchImages } from '../../utils/imageApi';

// Mock the global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ImageApi Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch 50 images from the Pixabay API', async () => {
    // Mock successful API response with 50 images
    const mockImages = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      webformatURL: `https://pixabay.com/get/image-${i + 1}.jpg`,
      user: `User${i + 1}`,
      imageWidth: 640,
      imageHeight: 400,
    }));

    const mockResponse = {
      hits: mockImages,
      totalHits: 500
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await fetchImages('casino', 50, 1);

    // ✅ Test 1: Verify that 50 images were fetched
    expect(result.images).toHaveLength(50);
    
    // ✅ Test 2: Verify the structure of returned images
    expect(result.images[0]).toHaveProperty('id');
    expect(result.images[0]).toHaveProperty('src');
    expect(result.images[0]).toHaveProperty('author');
    expect(result.images[0]).toHaveProperty('originalWidth');
    expect(result.images[0]).toHaveProperty('originalHeight');

    // ✅ Test 3: Verify API was called with correct parameters
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('per_page=50')
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('q=casino')
    );
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'API Error'
    });

    await expect(fetchImages('casino', 50, 1)).rejects.toThrow('Failed to fetch images: API Error');
  });
});
