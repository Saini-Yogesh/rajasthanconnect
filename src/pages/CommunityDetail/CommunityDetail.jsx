import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, MapPin } from "lucide-react";
import { useFetchById } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import useSEO from "../../hooks/useSEO";
import { buildCommunitySEO } from "../../utils/seo";
import ReviewsSection from "../../components/ui/ReviewsSection/ReviewsSection";
import "../../styles/DetailPage.css";

const FALLBACK = "https://images.unsplash.com/photo-1519810755548-39cd217da494?auto=format&fit=crop&w=1200&q=80";

export default function CommunityDetail() {
  const { id } = useParams();
  const { data: item, loading, error } = useFetchById("/api/communities-tribes", id);

  useSEO(buildCommunitySEO(item, id));

  if (loading) return <LoadingSpinner message="Gathering the community..." size="lg" />;
  if (error || !item)
    return <EmptyState title="Not found" message="This community record doesn't exist." action={<Link to="/communities" className="relatedLink">← Communities</Link>} />;

  return (
    <div className="detailPage">
      <div className="detailHero" style={{ backgroundImage: `url(${item.image_url || FALLBACK})` }}>
        <div className="detailHeroOverlay" />
        <div className="detailHeroContent">
          {item.type && <span className="detailHeroBadge">{item.type}</span>}
          <h1 className="detailHeroTitle">{item.name}</h1>
          {(item.primary_regions || item.region) && <p className="detailHeroSubtitle"><MapPin size={16} /> {Array.isArray(item.primary_regions) ? item.primary_regions.join(", ") : (item.primary_regions || item.region)}</p>}
        </div>
      </div>
      <div className="detailBody">
        <div className="detailMain">
          <Link to="/communities" className="detailBackLink"><ArrowLeft size={16} /> Back to Communities</Link>
          <div className="detailCard">
            <h2 className="detailCardTitle"><Users size={18} /> About this Community</h2>
            <p className="detailDescription">{item.lifestyle_history || item.description}</p>
          </div>
          {(item.beliefs_practices || item.traditions) && <div className="detailCard" style={{ marginTop: 20 }}><h2 className="detailCardTitle">Traditions & Customs</h2><p className="detailDescription">{Array.isArray(item.beliefs_practices) ? item.beliefs_practices.join(". ") : (item.beliefs_practices || item.traditions)}</p></div>}
          {item.details && typeof item.details === "object" && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Community Details</h2>
              {Object.entries(item.details).map(([k, v]) => (
                <div className="detailInfoRow" key={k}>
                  <span className="detailInfoKey">{k.replace(/_/g, " ")}</span>
                  <span className="detailInfoVal">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Traveler Reviews */}
          <ReviewsSection itemId={id} itemType="community" />
        </div>
        <aside className="detailSidebar">
          <div className="detailCard">
            <h3 className="detailCardTitle">Quick Info</h3>
            {item.type && <div className="detailInfoRow"><span className="detailInfoKey">Type</span><span className="detailInfoVal">{item.type}</span></div>}
            {(item.primary_regions || item.region) && <div className="detailInfoRow"><span className="detailInfoKey">Region</span><span className="detailInfoVal">{Array.isArray(item.primary_regions) ? item.primary_regions.join(", ") : (item.primary_regions || item.region)}</span></div>}
            {item.population && <div className="detailInfoRow"><span className="detailInfoKey">Population</span><span className="detailInfoVal">{item.population}</span></div>}
            {item.language && <div className="detailInfoRow"><span className="detailInfoKey">Language</span><span className="detailInfoVal">{item.language}</span></div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
