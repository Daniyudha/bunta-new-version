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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <Image
                src="/images/second-logo.png"
                alt="Cikasda Logo"
                width={200}
                height={200}
                className="h-30 w-auto object-contain"
                priority
              />
            </div>

            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              UPT PSDA Wilayah II adalah unit pelaksana teknis yang bertugas
              dalam pengelolaan sumber daya air dan irigasi di wilayah II
              Provinsi Sulawesi Tengah.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <span className="text-gray-400">
                  Jl. Prof. Dr. Moh. Yamin No.33, Kota Palu
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">+62 821-9098-3281</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">cikasda@sultengprov.go.id</span>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-gray-400">
                  <p>Senin - Jumat: 08:00 - 16:00</p>
                  <p className="text-gray-500">Online 24 Jam</p>
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
                    className="text-gray-400 hover:text-blue-400 transition-colors"
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
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-300">
                Ikuti Kami
              </h4>

              <a
                href="https://www.instagram.com/cikasda.sulteng"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-500 transition"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Cikasda UPT PSDA Wilayah II
          </p>

          <p className="text-gray-500 text-sm">
            Powered by{" "}
            <a
              href="https://www.gegacreative.com/"
              target="_blank"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              PT. Gega Creative Ideas
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
