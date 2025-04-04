import HomeHeaderSection from "./ui/HomeHeaderSection";
import HomeArticleSection from "./ui/HomeArticleSection";
import HomeImageSection from "./ui/HomeImageSection";
import Footer from "./ui/Footer";

export default function Page() {
  return (
    <div>
      <HomeHeaderSection />
      <HomeArticleSection />
      <HomeImageSection />
      <Footer />
    </div>
  )
}
