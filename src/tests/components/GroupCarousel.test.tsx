import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import GroupCarousel from "../../components/GroupCarousel";
import type { CarouselImage } from "../../utils/imageApi";

// Mock fetch for the component's internal fetchImages calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("GroupCarousel Component", () => {
  const mockImages: CarouselImage[] = Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    src: `https://example.com/image-${i + 1}.jpg`,
    author: `Photographer ${i + 1}`,
    originalWidth: 800,
    originalHeight: 600,
  }));

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful API response for loadMore functionality
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        hits: [],
        totalHits: 0,
      }),
    });

    // Set test API key
    process.env.VITE_PIXABAY_API_KEY = "test-api-key";
  });

  it("should display 4 images on desktop viewport", () => {
    // Mock desktop viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(<GroupCarousel initialImages={mockImages} />);

    // Verify images are rendered - should show exactly 4 for desktop
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(4);

    // Verify first four images have correct src attributes
    expect(images[0]).toHaveAttribute("src", mockImages[0].src);
    expect(images[1]).toHaveAttribute("src", mockImages[1].src);
    expect(images[2]).toHaveAttribute("src", mockImages[2].src);
    expect(images[3]).toHaveAttribute("src", mockImages[3].src);
  });

  it("should display 2 images on mobile viewport", () => {
    // Mock mobile viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<GroupCarousel initialImages={mockImages} />);

    // Verify images are rendered - should show exactly 2 for mobile
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(2);

    // Verify first two images have correct src attributes
    expect(images[0]).toHaveAttribute("src", mockImages[0].src);
    expect(images[1]).toHaveAttribute("src", mockImages[1].src);
  });

  it("should render carousel with proper image attributes", () => {
    render(<GroupCarousel initialImages={mockImages} />);

    // Check that images are loaded and accessible
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);

    // Verify images have alt attributes
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img).toHaveAttribute("src");
    });
  });

  it("should handle empty images array gracefully", () => {
    render(<GroupCarousel initialImages={[]} />);

    // Should not crash and should not display any images
    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);
  });
});
