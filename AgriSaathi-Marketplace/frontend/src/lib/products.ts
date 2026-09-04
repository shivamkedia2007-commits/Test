import tomato from "@/assets/products/tomato.jpg.asset.json";
import potato from "@/assets/products/potato.jpg.asset.json";
import onion from "@/assets/products/onion.jpg.asset.json";
import carrot from "@/assets/products/carrot.jpg.asset.json";
import cauliflower from "@/assets/products/cauliflower.jpg.asset.json";
import apple from "@/assets/products/apple.jpg.asset.json";
import banana from "@/assets/products/banana.jpg.asset.json";
import mango from "@/assets/products/mango.jpg.asset.json";
import wheat from "@/assets/products/wheat.jpg.asset.json";
import rice from "@/assets/products/rice.jpg.asset.json";
import moongDal from "@/assets/products/moong-dal.jpg.asset.json";
import turmeric from "@/assets/products/turmeric.jpg.asset.json";
import mustardOil from "@/assets/products/mustard-oil.jpg.asset.json";
import paneer from "@/assets/products/paneer.jpg.asset.json";
import milk from "@/assets/products/milk.jpg.asset.json";

export type Product = {
  id: string;
  productId: number;
  name: string;
  price: number;
  unit: string;
  farmer: string;
  location: string;
  image: string;
  quantityAvailable: number;
  harvestDate: string;
  sellerId: number;
};

const IMAGE_MAP: Record<string, string> = {
  tomato: tomato.url, potato: potato.url, onion: onion.url, carrot: carrot.url,
  cauliflower: cauliflower.url, apple: apple.url, banana: banana.url, mango: mango.url,
  wheat: wheat.url, rice: rice.url, "moong dal": moongDal.url,
  "turmeric powder": turmeric.url, "mustard oil": mustardOil.url, paneer: paneer.url, milk: milk.url,
};

export function productFromApi(p: any): Product {
  const name = String(p.product_name ?? p.name ?? "Product");
  return {
    id: String(p.product_id ?? p.id),
    productId: Number(p.product_id ?? p.id),
    name,
    price: Number(p.price_per_kg ?? p.price ?? 0),
    unit: "kg",
    farmer: String(p.farmer ?? p.seller_name ?? "Verified Farmer"),
    location: String(p.location ?? "India"),
    image: IMAGE_MAP[name.toLowerCase()] ?? tomato.url,
    quantityAvailable: Number(p.quantity_available ?? 0),
    harvestDate: String(p.date_of_harvest ?? ""),
    sellerId: Number(p.seller_id ?? 0),
  };
}

export function unitPrice(product: Product, unit: string): number {
  return unit === "ql" ? product.price * 100 : product.price;
}

export function formatQty(qty: number): string {
  return Number.isInteger(qty) ? String(qty) : String(qty);
}
