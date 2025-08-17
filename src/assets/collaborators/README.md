# Collaborators Logo Assets

This folder contains the logo images for our partner companies and collaborators.

## Guidelines for Logo Images

### File Format
- **Preferred**: PNG with transparent background
- **Alternative**: SVG for vector logos
- **Fallback**: JPG (only if PNG/SVG not available)

### Image Specifications
- **Recommended Size**: 200x100 pixels (2:1 aspect ratio)
- **Minimum Size**: 150x75 pixels
- **Maximum Size**: 400x200 pixels
- **Background**: Transparent (PNG) or white background

### File Naming Convention
Use lowercase letters, numbers, and hyphens only:
- `company-name-logo.png`
- `organization-name-logo.svg`

### Examples
- `petcare-plus-logo.png`
- `animal-shelter-network-logo.png`
- `grooming-experts-logo.svg`

## How to Add New Collaborator Logos

1. Save the logo file in this folder following the naming convention
2. Update the collaborators array in the Collaborators component
3. Replace the placeholder URL with the imported logo:

```jsx
import companyLogo from '../assets/collaborators/company-name-logo.png';

const collaborators = [
  {
    id: 1,
    name: 'Company Name',
    logo: companyLogo,
    description: 'Company description'
  },
  // ... more collaborators
];
```

## Current Placeholder Images
The components currently use placeholder images from via.placeholder.com. Replace these with actual company logos by:

1. Adding the logo files to this folder
2. Importing them in the component
3. Updating the logo property in the collaborators array

## Logo Display Features
- **Grayscale Filter**: Logos appear in grayscale by default and show in color on hover
- **Responsive Design**: Logos automatically adjust size based on screen size
- **Smooth Animations**: Hover effects and transitions for better user experience
