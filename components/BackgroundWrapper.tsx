"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const DEFAULT_BG = "/images/background-img003.jpg";

const backgroundForPath = (pathname: string) => {
  if (pathname === "/") {
    return "/images/background-img003.jpg";
  }

  if (pathname === "/blogs" || pathname.startsWith("/blogs/")) {
    return "/images/background-img001.jpg";
  }

  if (pathname === "/categories" || pathname === "/tags") {
    return "/images/background-img002.jpg";
  }

  if (pathname === "/work-history" || pathname.startsWith("/profile/work-history")) {
    return "/images/background-img004.jpg";
  }

  return DEFAULT_BG;
};

type BackgroundWrapperProps = {
  children: ReactNode;
};

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  const pathname = usePathname() ?? "/";
  const backgroundUrl = backgroundForPath(pathname);

  return (
    <div
      className="bg-transparent"
      // className="bg-cover bg-fixed bg-position-[center_top] bg-no-repeat"
      // style={{ backgroundImage: `url('${backgroundUrl}')` }}
    >
      <div id="background" className="bg-cover bg-no-repeat bg-position-[top_center] fixed inset-0 -z-10 bg-gray-500" style={{ backgroundImage: `url('${backgroundUrl}')` }}></div>
      <div className="back-color min-h-[calc(100vh-180px)]">
        <div className="relative isolate px-0 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#a22c0c] to-[#89fcb7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            />
          </div>
          <div className="mx-auto max-w-5xl sm:py-10 lg:py-12">
            {children}
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-23rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-50rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#a22c0c] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
