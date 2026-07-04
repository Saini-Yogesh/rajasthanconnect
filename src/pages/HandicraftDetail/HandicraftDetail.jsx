import React from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Gem } from "lucide-react";
import { useFetchById } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import useSEO from "../../hooks/useSEO";
import { buildHandicraftSEO } from "../../utils/seo";
import ReviewsSection from "../../components/ui/ReviewsSection/ReviewsSection";
import { uniqueValues } from "../../utils/arrays";
import { getHandicraftCategory } from "../../utils/handicraftCategories";
import "../../styles/DetailPage.css";

const FALLBACK =
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80";

export default function HandicraftDetail() {
  const { id } = useParams();
  const { data: craft, loading, error } = useFetchById("/api/handicrafts", id);

  useSEO(buildHandicraftSEO(craft, id));

  if (loading) return <LoadingSpinner message="Consulting the master craftsmen..." size="lg" />;
  if (error || !craft)
    return (
      <EmptyState
        title="Craft not found"
        message="This handicraft record may have been moved or doesn't exist."
        action={<Link to="/handicrafts" className="relatedLink">← Back to Handicrafts</Link>}
      />
    );

  const category = getHandicraftCategory(craft);

  return (
    <div className="detailPage">
      {/* Hero */}
      <div
        className="detailHero"
        style={{ backgroundImage: `url(${craft.image_url || craft.imageUrl || FALLBACK})` }}
      >
        <div className="detailHeroOverlay" />
        <div className="detailHeroContent">
          {category && (
            <span className="detailHeroBadge">{category}</span>
          )}
          <h1 className="detailHeroTitle">{craft.name}</h1>
          {craft.origin_city_id && (
            <p className="detailHeroSubtitle">
              <MapPin size={16} /> {craft.origin_city || craft.origin_city_id.charAt(0).toUpperCase() + craft.origin_city_id.slice(1)}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="detailBody">
        {/* Main content */}
        <div className="detailMain">
          <Link to="/handicrafts" className="detailBackLink">
            <ArrowLeft size={16} /> Back to Handicrafts
          </Link>

          <div className="detailCard">
            <h2 className="detailCardTitle"><Gem size={18} /> About this Craft</h2>
            <p className="detailDescription">{craft.process_description || craft.description}</p>
          </div>

          {craft.history && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Historical Origins</h2>
              <p className="detailDescription">{craft.history}</p>
            </div>
          )}

          {craft.techniques && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Craft Techniques</h2>
              <p className="detailDescription">{craft.techniques}</p>
            </div>
          )}

          {/* Details map */}
          {craft.details && typeof craft.details === "object" && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Craft Details</h2>
              {Object.entries(craft.details).map(([key, val]) => (
                <div className="detailInfoRow" key={key}>
                  <span className="detailInfoKey">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
                  </span>
                  <span className="detailInfoVal">
                    {Array.isArray(val) ? val.join(", ") : String(val)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Traveler Reviews */}
          <ReviewsSection itemId={id} itemType="handicraft" />
        </div>

        {/* Sidebar */}
        <aside className="detailSidebar">
          <div className="detailCard">
            <h3 className="detailCardTitle">Quick Info</h3>
            {craft.origin_city_id && (
              <div className="detailInfoRow">
                <span className="detailInfoKey">Origin City</span>
                <span className="detailInfoVal">{craft.origin_city || craft.origin_city_id}</span>
              </div>
            )}
            {craft.category && (
              <div className="detailInfoRow">
                <span className="detailInfoKey">Category</span>
                <span className="detailInfoVal">{craft.category}</span>
              </div>
            )}
            {(craft.materials_used || craft.materials) && (
              <div className="detailInfoRow">
                <span className="detailInfoKey">Materials</span>
                <span className="detailInfoVal">
                  {Array.isArray(craft.materials_used || craft.materials)
                    ? (craft.materials_used || craft.materials).join(", ")
                    : (craft.materials_used || craft.materials)}
                </span>
              </div>
            )}
            {(craft.gi_tag_status || craft.gi_tag) && (
              <div className="detailInfoRow">
                <span className="detailInfoKey">GI Tag</span>
                <span className="detailInfoVal">
                  {craft.gi_tag || (craft.gi_tag_status ? `Yes${craft.gi_tag_year ? ` (${craft.gi_tag_year})` : ""}` : "No")}
                </span>
              </div>
            )}
          </div>

          {craft.tags?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Tags</h3>
              <div className="detailTags">
                {craft.tags.map((tag, i) => (
                  <span key={i} className="detailTag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {craft.related_city_ids?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Related Cities</h3>
              <div className="relatedLinks">
                {uniqueValues(craft.related_city_ids).map((cid) => (
                  <Link key={cid} to={`/cities/${cid}`} className="relatedLink">
                    <MapPin size={12} />
                    {cid.charAt(0).toUpperCase() + cid.slice(1)}
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
