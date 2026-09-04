import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import CinematicHero from '@/components/home/CinematicHero';
import BrandManifesto from '@/components/home/BrandManifesto';
import SinSelection from '@/components/home/SinSelection';
import RitualSection from '@/components/home/RitualSection';
import GallerySection from '@/components/home/GallerySection';
import LocationSection from '@/components/home/LocationSection';
import FinalCTA from '@/components/home/FinalCTA';

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    base44.entities.MenuItem.list('order_index', 50)
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <>
      <div className="relative z-10">
        <CinematicHero />
        <BrandManifesto />
        <SinSelection items={items} />
        <RitualSection />
        <GallerySection />
        <LocationSection />
        <FinalCTA />
      </div>
    </>
  );
}
