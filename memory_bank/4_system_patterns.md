# System Patterns: Frontend Design Choices

## Component Structure

The React frontend appears to follow a structured organization:

- `/pages`: Page-level components (Home, Login, etc.)
- `/components`: Reusable UI components
- `/assets`: Static assets like images and icons
- `/store`: State management (likely using Zustand or Redux)
- `/hooks`: Custom React hooks
- `/utils`: Utility functions
- `/apis`: API integration and services

## Design System

Based on the screenshots and current implementation:

- **Color Palette**: Primary blues and whites
- **Typography**: Clean, modern sans-serif
- **Buttons**: Rounded with hover effects
- **Layout**: Responsive, mobile-friendly designs
- **Styling**: Using Tailwind CSS for utility-based styling

## State Management

- Authentication state stored in localStorage and context for persistence
- Role-based rendering (admin, teacher views)
- Possible use of React Context API for global state

## Navigation Patterns

- Protected and unprotected routes
- Role-based navigation
- Clear CTAs for primary actions

## Best Practices to Maintain

- Component reusability
- Responsive design principles
- Consistent styling
- Accessibility considerations
- Performance optimization
