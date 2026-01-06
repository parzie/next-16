import { fetchHomePage } from "@/lib/strapi";
import { HeroSection } from "@/components/hero-section";

export async function generateMetadata() {
  const strapiData = await fetchHomePage();
  return {
    title: strapiData?.title || "Home Page",
    description: strapiData?.description || "Welcome to our homepage built with Next.js and Strapi",
  };
}

export default async function Home() {
  const strapiData = await fetchHomePage();

  console.log("Strapi Data:", strapiData);
  const { title, description } = strapiData || {};
  const [HeroSectionData] = strapiData?.sections || [];
  return (
    <main className="container mx-auto py-6">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-6">{description}</p>
      <HeroSection data={{ ...HeroSectionData, title, description }} />
    </main>
  );
}
