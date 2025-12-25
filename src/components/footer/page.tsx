import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="p-6 border-t mt-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
        <div>
          <h4 className="font-bold text-2xl mb-4"><span className='bg-black text-white rounded text-center w-fit px-3 mx-3'>S</span>ShopMart</h4>
          <p>
            Your one-stop destination for the latest technology, fashion, and
            lifestyle products. Quality guaranteed with fast shipping and
            excellent customer service.
          </p>
          <div className="mt-4 space-y-1 ">
            <p className="flex gap-2 "><MapPin/>123 Shop Street, October City, DC 12345</p>
            <p className="flex gap-2"><Phone size={16} strokeWidth={1.25}/>(+20) 0903333333</p>
            <p className="flex gap-2"><Mail size={16} strokeWidth={1.25} />support@shopmart.com</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-2 uppercase">Shop</h4>
          <ul className="space-y-1">
            <li>Electronics</li>
            <li>Fashion</li>
            <li>Home & Garden</li>
            <li>Sports</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2 uppercase">Customer Service</h4>
          <ul className="space-y-1">
            <li>Contact Us</li>
            <li>Help Center</li>
            <li>Track Your Order</li>
            <li>Returns & Exchanges</li>
            <li>Size Guide</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2 uppercase">Policies</h4>
          <ul className="space-y-1">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
            <li>Shipping Policy</li>
            <li>Refund Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
