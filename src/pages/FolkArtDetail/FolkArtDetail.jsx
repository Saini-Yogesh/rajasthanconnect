import React from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Palette } from "lucide-react";
import { useFetchById } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import useSEO from "../../hooks/useSEO";
import { buildFolkArtSEO } from "../../utils/seo";
import ReviewsSection from "../../components/ui/ReviewsSection/ReviewsSection";
import { uniqueValues } from "../../utils/arrays";
import "../../styles/DetailPage.css";

const FALLBACK = "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80";

export default function FolkArtDetail() {
  const { id } = useParams();
  const { data: art, loading, error } = useFetchById("/api/folk-arts", id);

  useSEO(buildFolkArtSEO(art, id));

  if (loading) return <LoadingSpinner message="Setting the stage..." size="lg" />;
  if (error || !art)
    return (
      <EmptyState
        title="Folk art not found"
        message="This record may have been moved."
        action={<Link to="/folk-arts" className="relatedLink">← Back to Folk Arts</Link>}
      />
    );

  return (
    <div className="detailPage">
      <div className="detailHero" style={{ backgroundImage: `url(${art.image_url || FALLBACK})` }}>
        <div className="detailHeroOverlay" />
        <div className="detailHeroContent">
          {art.category && <span className="detailHeroBadge">{art.category}</span>}
          <h1 className="detailHeroTitle">{art.name}</h1>
          {(art.origin_region || art.region) && <p className="detailHeroSubtitle"><MapPin size={16} /> {art.origin_region || art.region}</p>}
        </div>
      </div>

      <div className="detailBody">
        <div className="detailMain">
          <Link to="/folk-arts" className="detailBackLink"><ArrowLeft size={16} /> Back to Folk Arts</Link>
          <div className="detailCard">
            <h2 className="detailCardTitle"><Palette size={18} /> About this Art Form</h2>
            <p className="detailDescription">{art.history_origin || art.description || art.performance_details}</p>
          </div>
          {(art.performance_details || art.history) && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Historical Background</h2>
              <p className="detailDescription">{art.performance_details || art.history}</p>
            </div>
          )}
          {art.details && typeof art.details === "object" && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Art Details</h2>
              {Object.entries(art.details).map(([k, v]) => (
                <div className="detailInfoRow" key={k}>
                  <span className="detailInfoKey">{k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, " ")}</span>
                  <span className="detailInfoVal">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Traveler Reviews */}
          <ReviewsSection itemId={id} itemType="folkart" />
        </div>
        <aside className="detailSidebar">
          <div className="detailCard">
            <h3 className="detailCardTitle">Quick Info</h3>
            {art.category && <div className="detailInfoRow"><span className="detailInfoKey">Category</span><span className="detailInfoVal">{art.category}</span></div>}
            {(art.origin_region || art.region) && <div className="detailInfoRow"><span className="detailInfoKey">Region</span><span className="detailInfoVal">{art.origin_region || art.region}</span></div>}
            {(art.key_exponents || art.performers) && <div className="detailInfoRow"><span className="detailInfoKey">Performers</span><span className="detailInfoVal">{Array.isArray(art.key_exponents) ? art.key_exponents.join(", ") : (art.key_exponents || art.performers)}</span></div>}
          </div>
          {art.related_city_ids?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Related Cities</h3>
              <div className="relatedLinks">
                {uniqueValues(art.related_city_ids).map((cid) => (
                  <Link key={cid} to={`/cities/${cid}`} className="relatedLink">
                    <MapPin size={12} /> {cid.charAt(0).toUpperCase() + cid.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
