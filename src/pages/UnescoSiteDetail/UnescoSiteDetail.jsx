import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Globe, MapPin } from "lucide-react";
import { useFetchById } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import useSEO from "../../hooks/useSEO";
import { buildUnescoSEO } from "../../utils/seo";
import ReviewsSection from "../../components/ui/ReviewsSection/ReviewsSection";
import { uniqueValues } from "../../utils/arrays";
import "../../styles/DetailPage.css";

const FALLBACK = "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80";

export default function UnescoSiteDetail() {
  const { id } = useParams();
  const { data: item, loading, error } = useFetchById("/api/unesco-sites", id);

  useSEO(buildUnescoSEO(item, id));

  if (loading) return <LoadingSpinner message="Consulting UNESCO archives..." size="lg" />;
  if (error || !item)
    return <EmptyState title="Site not found" message="This UNESCO site record doesn't exist." action={<Link to="/unesco-sites" className="relatedLink">← UNESCO Sites</Link>} />;

  return (
    <div className="detailPage">
      <div className="detailHero" style={{ backgroundImage: `url(${item.image_url || FALLBACK})` }}>
        <div className="detailHeroOverlay" />
        <div className="detailHeroContent">
          <span className="detailHeroBadge" style={{ background: "#0e7490" }}>UNESCO World Heritage</span>
          <h1 className="detailHeroTitle">{item.name}</h1>
          {(item.city || item.location) && <p className="detailHeroSubtitle"><MapPin size={16} /> {item.city || item.location}</p>}
        </div>
      </div>
      <div className="detailBody">
        <div className="detailMain">
          <Link to="/unesco-sites" className="detailBackLink"><ArrowLeft size={16} /> Back to UNESCO Sites</Link>
          <div className="detailCard">
            <h2 className="detailCardTitle"><Globe size={18} /> About this Heritage Site</h2>
            <p className="detailDescription">{item.description}</p>
          </div>
          {item.significance && <div className="detailCard" style={{ marginTop: 20 }}><h2 className="detailCardTitle">UNESCO Significance</h2><p className="detailDescription">{item.significance}</p></div>}
          {item.history && <div className="detailCard" style={{ marginTop: 20 }}><h2 className="detailCardTitle">History</h2><p className="detailDescription">{item.history}</p></div>}
          {item.details && typeof item.details === "object" && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Site Details</h2>
              {Object.entries(item.details).map(([k, v]) => (
                <div className="detailInfoRow" key={k}>
                  <span className="detailInfoKey">{k.replace(/_/g, " ")}</span>
                  <span className="detailInfoVal">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Traveler Reviews */}
          <ReviewsSection itemId={id} itemType="unescosite" />
        </div>
        <aside className="detailSidebar">
          <div className="detailCard">
            <h3 className="detailCardTitle">Site Info</h3>
            {item.inscription_year && <div className="detailInfoRow"><span className="detailInfoKey">UNESCO Year</span><span className="detailInfoVal">{item.inscription_year}</span></div>}
            {item.city && <div className="detailInfoRow"><span className="detailInfoKey">City</span><span className="detailInfoVal">{item.city}</span></div>}
            {item.built_by && <div className="detailInfoRow"><span className="detailInfoKey">Built By</span><span className="detailInfoVal">{item.built_by}</span></div>}
            {item.built_year && <div className="detailInfoRow"><span className="detailInfoKey">Built Year</span><span className="detailInfoVal">{item.built_year}</span></div>}
          </div>
          {item.related_city_ids?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Related Cities</h3>
              <div className="relatedLinks">{uniqueValues(item.related_city_ids).map((cid) => <Link key={cid} to={`/cities/${cid}`} className="relatedLink"><MapPin size={12} /> {cid.charAt(0).toUpperCase() + cid.slice(1)}</Link>)}</div>
            </div>
          )}
          {item.related_place_ids?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Related Places</h3>
              <div className="relatedLinks">{uniqueValues(item.related_place_ids).map((pid) => <Link key={pid} to={`/places/${pid}`} className="relatedLink">🏰 {pid.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</Link>)}</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
