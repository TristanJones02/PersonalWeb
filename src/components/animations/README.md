# ScrollReveal Animation Component

A lightweight, customizable scroll animation component for React that reveals elements as they come into the viewport. **Now with dynamic scroll-speed responsive animations!**

## Features

✨ **Scroll-Speed Responsive**: Animations automatically speed up when users scroll quickly
🎯 **Smart Timing**: Delays and durations adjust based on scroll velocity
🚀 **Performance Optimized**: Uses Intersection Observer and throttled scroll detection
♿ **Accessibility Friendly**: Respects `prefers-reduced-motion`

## Usage

```jsx
import ScrollReveal from '../animations/ScrollReveal';

// Basic usage
<ScrollReveal>
  <div>Content to animate</div>
</ScrollReveal>

// With options
<ScrollReveal 
  direction="up" 
  delay={200} 
  duration={0.8} 
  distance={80}
>
  <div>Content to animate</div>
</ScrollReveal>
```

## Dynamic Animation Behavior

The component automatically detects scroll speed and adjusts animations:

- **Slow Scroll** (< 1px/ms): Normal animation timing
- **Medium Scroll** (1-2px/ms): 2x faster animations
- **Fast Scroll** (> 2px/ms): 3x faster animations with snappier easing

This creates a responsive experience where:
- Slow, deliberate scrolling shows full, smooth animations
- Fast scrolling keeps up with user intent with quicker transitions

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | string | `'up'` | Animation direction |
| `delay` | number | `0` | Base animation delay in milliseconds* |
| `duration` | number | `0.6` | Base animation duration in seconds* |
| `distance` | number | `60` | Movement distance in pixels |
| `once` | boolean | `true` | Whether animation triggers only once |
| `threshold` | number | `0.1` | Intersection observer threshold (0-1) |
| `className` | string | `''` | Additional CSS classes |

_*Actual timing automatically adjusts based on scroll speed_

## Animation Directions

### Basic Directions
- `'up'` - Slide in from bottom
- `'down'` - Slide in from top  
- `'left'` - Slide in from left
- `'right'` - Slide in from right
- `'fade'` - Fade in only (no movement)
- `'scale'` - Scale in from smaller size
- `'zoom'` - Zoom in from very small

### Combined Directions
- `'up-left'` - Slide diagonally from bottom-left
- `'up-right'` - Slide diagonally from bottom-right
- `'down-left'` - Slide diagonally from top-left
- `'down-right'` - Slide diagonally from top-right

### Advanced Effects
- `'flip-x'` - Flip along X-axis
- `'flip-y'` - Flip along Y-axis

## Examples

### Staggered List Animation
```jsx
{items.map((item, index) => (
  <ScrollReveal 
    key={item.id}
    direction="left" 
    delay={100 + (index * 50)}
  >
    <ItemComponent item={item} />
  </ScrollReveal>
))}
```

### Different Effects for Different Sections
```jsx
<ScrollReveal direction="up" delay={100}>
  <h2>Section Title</h2>
</ScrollReveal>

<ScrollReveal direction="scale" delay={200}>
  <div className="card">Card content</div>
</ScrollReveal>

<ScrollReveal direction="fade" delay={300}>
  <p>Description text</p>
</ScrollReveal>
```

### Performance Tips
- Use `threshold={0.1}` for early triggering
- Use `once={true}` (default) for better performance
- Stagger delays to create flowing animations
- Trust the automatic scroll-speed optimization

## Accessibility

The component automatically respects the `prefers-reduced-motion` CSS media query:
- **Regular users**: Full scroll-responsive animations
- **Reduced motion users**: Simple fade animations only
- **Fast scroll + reduced motion**: Extra-quick fade transitions 