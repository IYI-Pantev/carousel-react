# Technical Assessment Task - Betty Casino

## Task Overview

Create an infinite image carousel (the items loop when either end is reached) using React for Betty, a fully regulated online casino targeting the North American market with focus on female gamblers. The task examines problem-solving skills, code quality/performance, and architectural decisions.

## Company Context

Betty is building a fully regulated online casino for the North American market that focuses on female gamblers. Besides super smooth and modern UI/UX, Betty's competitive advantage will come from real-time in-game bonusing and live-ops/gamification. The underlying casino platform will be built in-house.

## Requirements

The component must:

- [x] Work with images of different sizes and aspect ratios
- [x] Work on devices with different screen sizes (responsive)
- [x] Work on both mobile and desktop
- [x] Work equally well with a dozen of images, as well as 1000+ images (performance)
- [x] Be reusable
- [x] Navigation triggered ONLY by scroll (no arrows or buttons)
- [x] Infinite loop behavior (seamless transition when reaching ends)

## Technical Specifications

- **Framework/Library**: React
- **Styling**: Modern CSS/Styled Components (for smooth UI/UX)
- **Features**: Infinite scroll, touch/mouse scroll navigation, responsive design
- **Browser Support**: Modern browsers (mobile and desktop)
- **Performance Requirements**: Handle 1000+ images efficiently
- **Image Source**: Picsum Photos API (https://picsum.photos/) or any public API

## Deliverables

- [x] Reusable React carousel component
- [x] Demo implementation showing the component in action
- [x] Clean, performant code with good architecture
- [x] Responsive design that works across devices
- [x] Documentation/comments explaining architectural decisions

## Timeline

- **Due Date**: TBD
- **Estimated Time**: TBD

## Additional Notes

- Focus on super slick UI/UX and lightning fast responses
- Code quality and architectural decisions will be foundation for technical discussion
- Be prepared to explain why certain decisions were made
- Component should handle edge cases gracefully
- Performance optimization is crucial for large image sets

## Implementation Plan

### Phase 1: Project Setup & Architecture

- [ ] Initialize React project with modern tooling (Vite/Create React App)
- [ ] Set up project structure and component architecture
- [ ] Install necessary dependencies (styled-components, etc.)
- [ ] Create basic carousel component skeleton
- [ ] Set up image API integration (Picsum Photos)

### Phase 2: Core Carousel Functionality

- [ ] Implement infinite scroll mechanism
- [ ] Add scroll-based navigation (horizontal scroll detection)
- [ ] Create virtual scrolling for performance (handle 1000+ images)
- [ ] Implement smooth scrolling transitions
- [ ] Add touch/gesture support for mobile devices

### Phase 3: Image Handling & Responsiveness

- [ ] Implement dynamic image sizing for different aspect ratios
- [ ] Add responsive design for various screen sizes
- [ ] Implement lazy loading for performance optimization
- [ ] Add image caching and preloading strategies
- [ ] Handle loading states and error scenarios

### Phase 4: Performance Optimization

- [ ] Implement virtualization for large image sets
- [ ] Add debouncing for scroll events
- [ ] Optimize re-renders with React.memo and useMemo
- [ ] Implement efficient image disposal/cleanup
- [ ] Add performance monitoring and optimization

### Phase 5: Testing & Polish

- [ ] Test across different devices and screen sizes
- [ ] Test with varying image counts (12 vs 1000+)
- [ ] Add error handling and edge cases
- [ ] Code cleanup and documentation
- [ ] Create demo implementation

## Key Technical Challenges to Address

1. **Performance**: Handling 1000+ images without memory leaks
2. **Infinite Loop**: Seamless transition at carousel ends
3. **Scroll Navigation**: Smooth horizontal scroll detection
4. **Responsiveness**: Different screen sizes and orientations
5. **Image Variety**: Different aspect ratios and sizes
6. **Mobile/Touch**: Gesture support and touch responsiveness

---

_This document will be updated as we work through the assessment together._
