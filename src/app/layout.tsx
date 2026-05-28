import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Digital Marketing Institute in Noida | ZICA Digital Academy",
  description: "Learn Advanced Digital Marketing in Noida. Master SEO, Google Ads, Meta Ads, AI Tools & Automations. 100% Placements & Guaranteed Paid Internship.",
  metadataBase: new URL("https://didm.in"),
  icons: {
    icon: "/didmfavicon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Digital Marketing Institute in Noida | ZICA Digital Academy",
    description: "Learn SEO, Google Ads, Meta Ads, and AI Tools. Join Noida's #1 Rated Practical Academy with 100% Placement Support.",
    url: "https://didm.in",
    siteName: "ZICA Digital Academy Noida",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
        width: 800,
        height: 600,
        alt: "ZICA Digital Academy Noida Campus",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Digital Marketing Institute in Noida | ZICA Digital Academy",
    description: "Master PPC, SEO, Content, and AI Marketing tools. Guaranteed Placements & Internships in Noida.",
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Schema markup JSON-LD objects
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ZICA Digital Academy Noida",
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    "@id": "https://didm.in/#academy",
    "url": "https://didm.in",
    "telephone": "+918447222054",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "A-40, 4th Floor",
      "addressLocality": "Noida",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201301",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.6273,
      "longitude": 77.3725
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1240"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    }
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Professional Diploma in Digital Growth Marketing",
    "description": "Comprehensive 4-Month practical training covering SEO, Google PPC, Meta Ads, and AI prompt engineering with 100% placement alignment in Noida.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "ZICA Digital Academy Noida",
      "sameAs": "https://didm.in"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://didm.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Noida Campus Courses",
        "item": "https://didm.in/#curriculum"
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18183560002" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'AW-18183560002');
            `,
          }}
        />

        {/* Google Tag Manager - Head Script (Uncomment and replace GTM-XXXXXX with actual ID when ready)
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXX');`,
          }}
        />
        */}
        
        {/* JSON-LD Schema Injections */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        {/* Google Tag Manager (noscript) - Body Fallback (Uncomment and replace GTM-XXXXXX with actual ID when ready)
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        */}

        <ToastProvider>
          <div className="flex-1 flex flex-col relative w-full">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
