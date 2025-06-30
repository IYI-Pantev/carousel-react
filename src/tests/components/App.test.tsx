import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../../App";

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VITE_PIXABAY_API_KEY = "test-api-key";
  });

  it("should fetch and display 50 casino images", async () => {
    // Mock successful API response with 50 images
    const mockApiImages = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      pageURL: `https://pixabay.com/photo-${i + 1}`,
      type: "photo",
      tags: `casino, gambling, image ${i + 1}`,
      previewURL: `https://pixabay.com/get/preview-${i + 1}.jpg`,
      previewWidth: 150,
      previewHeight: 100,
      webformatURL: `https://pixabay.com/get/image-${i + 1}.jpg`,
      webformatWidth: 640,
      webformatHeight: 427,
      largeImageURL: `https://pixabay.com/get/large-${i + 1}.jpg`,
      imageWidth: 1920,
      imageHeight: 1280,
      user: `photographer${i + 1}`,
      userImageURL: `https://pixabay.com/get/user-${i + 1}.jpg`,
    }));

    const mockResponse = {
      total: 500,
      totalHits: 500,
      hits: mockApiImages,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<App />);

    // Wait for loading to complete and images to be displayed
    await waitFor(
      () => {
        expect(screen.queryByText("Loading images...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify that images are rendered (should be at least 4 visible on desktop)
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(4);

    // Verify that fetch was called with correct parameters for 50 images
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("key=test-api-key")
    );
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("q=casino"));
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("per_page=50")
    );
  });

  it("should display error message when API fails", async () => {
    // Mock API failure
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    render(<App />);

    // Wait for error message to appear
    await waitFor(
      () => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("should show loading state initially", () => {
    // Mock pending API response
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<App />);

    // Should show loading message
    expect(screen.getByText("Loading images...")).toBeInTheDocument();
  });
});
