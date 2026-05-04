import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

export default function HomeMain() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      id: 1,
      title: "Doorsmeer",
      description: "Cuci premium dengan presisi tinggi untuk performa kendaraan.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Coffee Shop",
      description: "Nikmati kopi specialty sambil bersantai di lounge kami.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Vape Store",
      description: "Koleksi liquid dan perangkat eksklusif di ekosistem kami.",
      href: "/vape-store",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Bengkel",
      description: "Layanan teknis terpercaya oleh mekanik bersertifikat.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Rental PS",
      description: "Area entertainment eksklusif untuk bermain konsol terkini.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section className="w-full bg-background py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* 5 Layanan Hub Cards with Scroll Animation & Premium Hover UI */}
        <div 
          ref={sectionRef}
          className="flex flex-wrap justify-center gap-6"
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}
            >
              <Link 
                href={service.href || "#"} 
                className="group relative w-full h-full rounded-venus overflow-hidden p-6 flex flex-col justify-between border border-border bg-surface shadow-md transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-2 min-h-[220px] block"
              >
                 {/* Background Image (Hidden normally, reveals intensely on hover) */}
                 <img 
                   src={service.image} 
                   className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 grayscale transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:grayscale-0" 
                   alt={service.title} 
                 />
                 
                 {/* Primary Color Dark Overlay on hover */}
                 <div className="absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/90" />
                 
                 {/* Content Container */}
                 <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                   
                   {/* Top Row: Icon & Arrow */}
                   <div className="flex items-start justify-between w-full">
                     {/* Main Service Icon */}
                     <div className="p-3.5 rounded-full bg-background border border-border text-super-black transition-colors duration-500 group-hover:bg-primary-foreground group-hover:border-primary-foreground group-hover:text-primary">
                        {service.icon}
                     </div>
                     
                     {/* Interactive Arrow Indicator */}
                     <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-surface transition-all duration-500 group-hover:bg-primary-foreground group-hover:border-primary-foreground group-hover:-rotate-45">
                       <svg className="w-5 h-5 text-super-black transition-colors duration-500 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7m0 0l-7-7" />
                       </svg>
                     </div>
                   </div>
                   
                   {/* Bottom Row: Text Content */}
                   <div className="flex flex-col gap-2">
                     <h3 className="text-card-title text-super-black transition-colors duration-500 group-hover:text-primary-foreground">{service.title}</h3>
                     <p className="text-body-reg text-foreground transition-colors duration-500 group-hover:text-primary-foreground">{service.description}</p>
                   </div>
                   
                 </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Heading Section */}
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-h2">Layanan Kami</h2>
          <p className="text-body-l">Lima layanan terintegrasi dalam satu lokasi premium.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-none md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {/* Left Column (Tall) */}
          <Link href="#" className="dark group relative rounded-venus overflow-hidden md:col-span-1 md:row-span-2 min-h-[400px] md:min-h-full block">
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              alt="Doorsmeer & Bengkel" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-super-black/90 via-super-black/40 to-transparent z-0 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start gap-4 z-10">
              <div className="inline-flex items-center px-4 py-1.5 border border-border rounded-full bg-surface/20 backdrop-blur-md">
                <span className="text-label-sm text-foreground">AUTOMOTIVE</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-h2 text-foreground">Doorsmeer & Bengkel</h3>
                <p className="text-body-reg text-foreground">Perawatan profesional dengan presisi tinggi. Sambil menunggu, nikmati fasilitas lifestyle kami.</p>
              </div>
            </div>
          </Link>

          {/* Middle Top (Cafe Lounge) */}
          <Link href="#" className="dark group relative rounded-venus overflow-hidden md:col-span-1 md:row-span-1 min-h-[250px] block">
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              alt="Cafe Lounge" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-super-black/90 via-super-black/30 to-transparent z-0 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-3 z-10">
              <div className="inline-flex items-center px-4 py-1.5 border border-border rounded-full bg-surface/20 backdrop-blur-md">
                <span className="text-label-sm text-foreground">LIFESTYLE</span>
              </div>
              <h3 className="text-h3 text-foreground">Cafe Lounge</h3>
            </div>
          </Link>

          {/* Right Top (PS Arena) */}
          <Link href="#" className="dark group relative rounded-venus overflow-hidden md:col-span-1 md:row-span-1 min-h-[250px] block">
            <img 
              src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              alt="PS Arena" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-super-black/90 via-super-black/30 to-transparent z-0 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-3 z-10">
              <div className="inline-flex items-center px-4 py-1.5 border border-border rounded-full bg-surface/20 backdrop-blur-md">
                <span className="text-label-sm text-foreground">ENTERTAINMENT</span>
              </div>
              <h3 className="text-h3 text-foreground">PS Arena</h3>
            </div>
          </Link>

          {/* Bottom Wide (Vape Store) */}
          <Link href="/vape-store" className="dark group relative rounded-venus overflow-hidden md:col-span-2 md:row-span-1 min-h-[250px] block">
            <img 
              src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              alt="Vape Store" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-super-black/90 via-super-black/40 to-transparent z-0 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-3 z-10">
              <div className="inline-flex items-center px-4 py-1.5 border border-border rounded-full bg-surface/20 backdrop-blur-md">
                <span className="text-label-sm text-foreground">RETAIL</span>
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-h3 text-foreground">Vape Store</h3>
                <p className="text-body-reg text-foreground">Koleksi premium dan liquid pilihan untuk melengkapi santai Anda.</p>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
