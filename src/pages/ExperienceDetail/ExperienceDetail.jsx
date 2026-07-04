import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { useFetchById } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import useSEO from "../../hooks/useSEO";
import { buildExperienceSEO } from "../../utils/seo";
import ReviewsSection from "../../components/ui/ReviewsSection/ReviewsSection";
import { uniqueValues } from "../../utils/arrays";
import "../../styles/DetailPage.css";

const FALLBACK = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80";

export default function ExperienceDetail() {
  const { id } = useParams();
  const { data: item, loading, error } = useFetchById("/api/unique-experiences", id);

  useSEO(buildExperienceSEO(item, id));

  if (loading) return <LoadingSpinner message="Preparing your adventure..." size="lg" />;
  if (error || !item)
    return <EmptyState title="Not found" message="This experience doesn't exist." action={<Link to="/experiences" className="relatedLink">← Experiences</Link>} />;

  return (
    <div className="detailPage">
      <div className="detailHero" style={{ backgroundImage: `url(${item.image_url || FALLBACK})` }}>
        <div className="detailHeroOverlay" />
        <div className="detailHeroContent">
          {item.category && <span className="detailHeroBadge">{item.category}</span>}
          <h1 className="detailHeroTitle">{item.title}</h1>
          {(item.city || item.location) && <p className="detailHeroSubtitle"><MapPin size={16} /> {item.city || item.location}</p>}
        </div>
      </div>
      <div className="detailBody">
        <div className="detailMain">
          <Link to="/experiences" className="detailBackLink"><ArrowLeft size={16} /> Back to Experiences</Link>
          <div className="detailCard">
            <h2 className="detailCardTitle"><Star size={18} /> About this Experience</h2>
            <p className="detailDescription">{item.description}</p>
          </div>
          {item.what_to_expect && <div className="detailCard" style={{ marginTop: 20 }}><h2 className="detailCardTitle">What to Expect</h2><p className="detailDescription">{item.what_to_expect}</p></div>}
          {item.details && typeof item.details === "object" && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Experience Details</h2>
              {Object.entries(item.details).map(([k, v]) => (
                <div className="detailInfoRow" key={k}>
                  <span className="detailInfoKey">{k.replace(/_/g, " ")}</span>
                  <span className="detailInfoVal">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Traveler Reviews */}
          <ReviewsSection itemId={id} itemType="experience" />
        </div>
        <aside className="detailSidebar">
          <div className="detailCard">
            <h3 className="detailCardTitle">Quick Info</h3>
            {item.city && <div className="detailInfoRow"><span className="detailInfoKey">City</span><span className="detailInfoVal">{item.city}</span></div>}
            {item.duration && <div className="detailInfoRow"><span className="detailInfoKey">Duration</span><span className="detailInfoVal">{item.duration}</span></div>}
            {item.price_range && <div className="detailInfoRow"><span className="detailInfoKey">Price</span><span className="detailInfoVal">{item.price_range}</span></div>}
            {item.best_season && <div className="detailInfoRow"><span className="detailInfoKey">Best Season</span><span className="detailInfoVal">{item.best_season}</span></div>}
          </div>
          {item.tags?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Tags</h3>
              <div className="detailTags">{item.tags.map((t, i) => <span key={i} className="detailTag">{t}</span>)}</div>
            </div>
          )}
          {item.related_city_ids?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Related Cities</h3>
              <div className="relatedLinks">{uniqueValues(item.related_city_ids).map((cid) => <Link key={cid} to={`/cities/${cid}`} className="relatedLink"><MapPin size={12} /> {cid.charAt(0).toUpperCase() + cid.slice(1)}</Link>)}</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
