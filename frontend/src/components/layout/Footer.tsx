import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import Image from "next/image";

const footerNavigation = {
  main: [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Profil Irigasi", href: "/irrigation" },
    { name: "Data & Statistik", href: "/data" },
    { name: "SKM", href: "/skm" },
    { name: "Kepegawaian", href: "/kepegawaian" },
    { name: "Berita", href: "/news" },
    { name: "Galeri", href: "/gallery" },
    { name: "Kontak", href: "/contact" },
  ],
  support: [
    { name: "Pusat Bantuan", href: "/help" },
    { name: "FAQ", href: "/faq" },
    { name: "Laporkan Masalah", href: "/report" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/second-logo.png"
                alt="Admin Avatar"
                width={250}
                height={40}
                className="w-auto h-auto"
                priority
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              UPT PSDA Wilayah II adalah unit pelaksana teknis yang bertugas
              dalam pengelolaan sumber daya air dan irigasi di wilayah II
              Provinsi Sulawesi Tengah di bawah naungan Dinas Cipta Karya dan
              Sumber Daya Air Pemerintah Provinsi Sulawesi Tengah.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">
                  Jl. Prof. Dr. Moh. Yamin No.33, Kota Palu, Sulawesi Tengah
                  94114
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">+62 821-9098-3281</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">cikasda@sultengprov.go.id</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="flex flex-col text-gray-300">
                  <span className="text-gray-300">
                    Kantor: Senin-Jumat: 8:00 - 16:00 WITA
                  </span>
                  <span className="text-gray-300">Online: 24 Jam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {footerNavigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
            <ul className="space-y-2">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media (Placeholder) */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Ikuti Kami</h4>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <a
                    target="_blank"
                    href="https://www.instagram.com/cikasda.sulteng"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Cikasda UPT PSDA Wilayah II. All Right
            Reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Powered by{" "}
            <span>
              <a
                className="text-md font-bold text-blue-400 hover:text-blue-300"
                href="https://www.gegacreative.com/"
                target="_blank"
              >
                PT. Gega Creative Ideas
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
