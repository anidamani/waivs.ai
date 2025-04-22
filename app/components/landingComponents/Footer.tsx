// components/Footer.tsx

import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-[100px] pb-[48px]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        {/* Left Column: Logo, Description, Copyright */}
        <div className="max-w-sm">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Image
              src="/logo.svg" // Replace with your actual logo path
              alt="waivs.ai Logo"
              width={115}
              height={21}
            />
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-600">
            Spend less time on paperwork and more on patients with waivs.ai –
            the AI-powered solution for fast, accurate clinical documentation.
          </p>

          {/* Copyright */}
          <p className="mt-4 text-sm text-gray-500">© 2023 waivs.ai</p>
        </div>

        {/* Right Columns: Links, Resources, Company */}
        <div className="grid sm:grid-cols-3 gap-12 md:gap-32">
          {/* Links Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#000000]">
              Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  API
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Sign up
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Log in
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#000000]">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Help docs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Quick start guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#000000]">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Terms of service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Contact us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition hover:text-gray-900"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
