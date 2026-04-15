export interface District {
  name: string;
  deliveryCharge: number;
}

// Karnataka districts with delivery charges (₹)
// Dharwad = 0 (home district)
export const karnatakaDistricts: District[] = [
  { name: "Dharwad", deliveryCharge: 0 },
  { name: "Hubballi", deliveryCharge: 300 },
  { name: "Belagavi", deliveryCharge: 300 },
  { name: "Gadag", deliveryCharge: 300 },
  { name: "Haveri", deliveryCharge: 300 },
  { name: "Uttara Kannada", deliveryCharge: 300 },
  { name: "Davangere", deliveryCharge: 300 },
  { name: "Chitradurga", deliveryCharge: 300 },
  { name: "Shivamogga", deliveryCharge: 300 },
  { name: "Ballari", deliveryCharge: 300 },
  { name: "Koppal", deliveryCharge: 300 },
  { name: "Raichur", deliveryCharge: 300 },
  { name: "Vijayanagara", deliveryCharge: 300 },
  { name: "Bidar", deliveryCharge: 300 },
  { name: "Kalaburagi", deliveryCharge: 300 },
  { name: "Yadgir", deliveryCharge: 300 },
  { name: "Vijayapura", deliveryCharge: 300 },
  { name: "Bagalkot", deliveryCharge: 300 },
  { name: "Tumakuru", deliveryCharge: 300 },
  { name: "Hassan", deliveryCharge: 300 },
  { name: "Chikkamagaluru", deliveryCharge: 300 },
  { name: "Udupi", deliveryCharge: 300 },
  { name: "Dakshina Kannada", deliveryCharge: 300 },
  { name: "Kodagu", deliveryCharge: 300 },
  { name: "Mysuru", deliveryCharge: 300 },
  { name: "Mandya", deliveryCharge: 300 },
  { name: "Bengaluru Urban", deliveryCharge: 300 },
  { name: "Bengaluru Rural", deliveryCharge: 300 },
  { name: "Ramanagara", deliveryCharge: 300 },
  { name: "Kolar", deliveryCharge: 300 },
  { name: "Chikkaballapur", deliveryCharge: 300 },
  { name: "Chamarajanagara", deliveryCharge: 300 },
];
