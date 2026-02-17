"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "../types/product";

interface ProductCarouselProps {
  products: ProductListItem[];
  title?: string;
}

export const ProductCarousel = ({ products, title }: ProductCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (products.length === 0) return null;

  return (
    <div className="w-full">
      {/* Título opcional */}
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-pucara-black mb-4">
          {title}
        </h2>
      )}

      {/* Contenedor relativo para el carrusel y las flechas superpuestas */}
      <div className="relative">
        {/* Carrusel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_50%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 first:pl-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Botón izquierdo (anterior) */}
        <button
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-pucara-red  hover:text-pucara-blue hover:border-pucara-red disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          aria-label="Producto anterior"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Botón derecho (siguiente) */}
        <button
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-pucara-red  hover:text-pucara-blue hover:border-pucara-red disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          aria-label="Producto siguiente"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};