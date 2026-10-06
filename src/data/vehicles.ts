import tipperImage from '../assets/vehicles/tipper.jpg';
import jcbImage from '../assets/vehicles/jcb.jpg';
import tractorImage from '../assets/vehicles/tractor.webp';

export const initialVehicles = [
  {
    id: "SPK-TIPPER-01",
    name: "Tipper",
    type: "Material Transportation",
    image: tipperImage,
    status: "Available",
    description: "Suitable for transporting sand, soil, gravel and construction materials.",
    rentalRate: null,
    assignedDriver: null,
    currentLocation: null
  },
  {
    id: "SPK-JCB-01",
    name: "JCB",
    type: "Earth Moving",
    image: jcbImage,
    status: "Available",
    description: "Suitable for excavation, land levelling, digging and construction work.",
    rentalRate: null,
    assignedDriver: null,
    currentLocation: null
  },
  {
    id: "SPK-TRACTOR-01",
    name: "Tractor",
    type: "Agricultural Work",
    image: tractorImage,
    status: "Available",
    description: "Suitable for agricultural work, transportation and field operations.",
    rentalRate: null,
    assignedDriver: null,
    currentLocation: null
  }
];
