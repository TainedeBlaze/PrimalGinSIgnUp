"use client";

import { useState, useEffect } from "react";
import { fetchEmailSignupPage } from "@/sanity/lib/client";
import Image from "next/image";
import { EmailSignupPage, GalleryImage } from "@/sanity/lib/types";


export default function Home() {
  const [data, setData] = useState<EmailSignupPage | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Fetch Sanity data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchEmailSignupPage();
        setData(res);
      } catch (err) {
        console.error("Error loading email signup page data:", err);
      }
    };
    fetchData();
  }, []);

  // Regex validations
  const fullNameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(0[0-9]{6,14}|\+[1-9][0-9]{6,14})$/;

  const validate = () => {
    const newErrors: { fullName?: string; email?: string; phone?: string } = {};
    if (!fullNameRegex.test(fullName)) newErrors.fullName = "Please enter your full name (first and last).";
    if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address.";
    if (!phoneRegex.test(phone)) newErrors.phone = "Please enter a valid phone number starting with 0 or an international code (e.g. +44).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Format phone number before sending
        const formattedPhone = phone.trim()
          .replace(/\s+/g, '') // Remove all spaces
          .replace(/^0/, '+27'); // Only replace leading 0 with +27

        // Validate phone number format - either international or South African
        const phoneRegex = /^\+[1-9]\d{6,14}$/;
        if (!phoneRegex.test(formattedPhone)) {
          setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number with country code (e.g., +27...)' }));
          return;
        }

        const response = await fetch('/api/BrevoSignup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName,
            email,
            phone: formattedPhone,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.error?.includes('SMS is already associated')) {
            setErrors(prev => ({ ...prev, phone: 'This phone number is already registered. Please use a different number.' }));
          } else {
            throw new Error(data.error || 'Signup failed');
          }
          return;
        }

        setSubmitted(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  // Hide thank-you message and reset form
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setFullName("");
        setEmail("");
        setPhone("");
        setErrors({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  // Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % (data?.gallery.length || 1));
    }, 20000);
    return () => clearInterval(interval);
  }, [data?.gallery.length]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white text-xl gap-4">
        Loading
        <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center">
      {/* Background slideshow and overlay */}
      <div className="absolute inset-0 w-full h-full -z-10">
        {data.gallery.map((src: GalleryImage, idx: number) => (
          <Image
            key={src._key || src.asset._id || idx}
            src={src.asset.url}
            alt="Primal Gin background"
            fill={true} 
            className={`fill object-cover w-full h-full brightness-60 transition-opacity duration-1000 absolute inset-0 ${bgIndex === idx ? 'opacity-100' : 'opacity-0'}`}
            style={{ zIndex: idx }}
            priority={true}
          />
        ))}
        <div className="absolute inset-0" />
      </div>

      {/* Responsive container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12 w-full max-w-4xl md:p-8 p-4 h-full">
        {/* Logo - above form on mobile, left on md+ */}
        <div className="flex-shrink-0 flex items-center justify-center md:justify-end w-full md:w-auto mb-2 md:mb-0 md:mr-[-32px] z-10 order-0 md:order-none">
          <Image src="/Primal logo.png" alt="Primal Gin Logo" className="w-24 sm:w-32 md:w-72 lg:w-96 h-auto object-contain drop-shadow-xl transition-all duration-500" width={300} height={300} priority={true} />
        </div>
        {/* Form */}
        <div className="rounded-2xl shadow-2xl p-6 md:p-10 pt-6 md:pt-12 max-w-lg md:max-w-xl w-full flex flex-col items-center bg-white/60 backdrop-blur-lg transition-all duration-500">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 tracking-tight text-center">
            <span className="text-black">{data.heading || "Get Exclusive Primal Gin Offers"}</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-100 mb-4 md:mb-6 text-center">
            <span className="text-neutral-800">{data.subheading || "Sign up to receive the latest news, launches, and special deals from Primal Gin."}</span>
          </p>
          {submitted ? (
            <div className="text-white text-center font-semibold py-8">
              <span className="text-black">Thank you for signing up!<br />We&apos;ll be in touch soon.</span>
            </div>
          ) : (
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="fullName" className="block text-neutral-800 font-medium mb-1">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black placeholder:text-neutral-500 ${errors.fullName ? 'border-red-500' : 'border-neutral-300'}`}
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  pattern="[A-Za-z]+( [A-Za-z]+)+"
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="text-red-700 text-sm mt-1 font-semibold">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-neutral-800 font-medium mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black placeholder:text-neutral-500 ${errors.email ? 'border-red-500' : 'border-neutral-300'}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  pattern="[^\s@]+@[^ 0-]+\.[^\s@]+"
                  placeholder="you@email.com"
                />
                {errors.email && <p className="text-red-700 text-sm mt-1 font-semibold">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-neutral-800 font-medium mb-1">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black placeholder:text-neutral-500 ${errors.phone ? 'border-red-500' : 'border-neutral-300'}`}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  pattern="(0[0-9]{6,14}|\+[1-9][0-9]{6,14})"
                  placeholder="+27 79 123 2287"
                />
                {errors.phone && <p className="text-red-700 text-sm mt-1 font-semibold">{errors.phone}</p>}
              </div>
              <button
                type="submit"
                className="mt-2 bg-black hover:bg-neutral-800 text-white font-semibold py-2 rounded-lg transition-colors shadow"
              >
                {data.buttonText || "Give me a good offer"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full justify-center text-center mt-8 mb-4 text-neutral-300 text-sm drop-shadow-lg z-10">
        &copy; {new Date().getFullYear()} Primal Spirits. All rights reserved.
      </footer>
    </div>
  );
}
