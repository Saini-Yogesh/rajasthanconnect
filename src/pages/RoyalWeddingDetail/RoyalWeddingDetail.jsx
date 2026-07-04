import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Crown, MapPin } from "lucide-react";
import { useFetchById } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import useSEO from "../../hooks/useSEO";
import { buildRoyalWeddingSEO } from "../../utils/seo";
import ReviewsSection from "../../components/ui/ReviewsSection/ReviewsSection";
import { uniqueValues } from "../../utils/arrays";
import "../../styles/DetailPage.css";

const FALLBACK = "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80";

export default function RoyalWeddingDetail() {
  const { id } = useParams();
  const { data: item, loading, error } = useFetchById("/api/royal-wedding-venues", id);

  useSEO(buildRoyalWeddingSEO(item, id));

  if (loading) return <LoadingSpinner message="Arranging the royal flowers..." size="lg" />;
  if (error || !item)
    return <EmptyState title="Venue not found" message="This venue record doesn't exist." action={<Link to="/royal-weddings" className="relatedLink">← Wedding Venues</Link>} />;

  return (
    <div className="detailPage">
      <div className="detailHero" style={{ backgroundImage: `url(${item.image_url || FALLBACK})` }}>
        <div className="detailHeroOverlay" />
        <div className="detailHeroContent">
          <span className="detailHeroBadge">Royal Wedding Venue</span>
          <h1 className="detailHeroTitle">{item.name}</h1>
          {item.city && <p className="detailHeroSubtitle"><MapPin size={16} /> {item.city}, Rajasthan</p>}
        </div>
      </div>
      <div className="detailBody">
        <div className="detailMain">
          <Link to="/royal-weddings" className="detailBackLink"><ArrowLeft size={16} /> Back to Wedding Venues</Link>
          <div className="detailCard">
            <h2 className="detailCardTitle"><Crown size={18} /> About this Venue</h2>
            <p className="detailDescription">{item.description}</p>
          </div>
          {item.history && <div className="detailCard" style={{ marginTop: 20 }}><h2 className="detailCardTitle">Historical Heritage</h2><p className="detailDescription">{item.history}</p></div>}
          {item.wedding_offerings && <div className="detailCard" style={{ marginTop: 20 }}><h2 className="detailCardTitle">Wedding Offerings</h2><p className="detailDescription">{item.wedding_offerings}</p></div>}
          {item.details && typeof item.details === "object" && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Venue Details</h2>
              {Object.entries(item.details).map(([k, v]) => (
                <div className="detailInfoRow" key={k}>
                  <span className="detailInfoKey">{k.replace(/_/g, " ")}</span>
                  <span className="detailInfoVal">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Traveler Reviews */}
          <ReviewsSection itemId={id} itemType="weddingvenue" />
        </div>
        <aside className="detailSidebar">
          <div className="detailCard">
            <h3 className="detailCardTitle">Venue Info</h3>
            {item.city && <div className="detailInfoRow"><span className="detailInfoKey">City</span><span className="detailInfoVal">{item.city}</span></div>}
            {item.capacity && <div className="detailInfoRow"><span className="detailInfoKey">Capacity</span><span className="detailInfoVal">{item.capacity}</span></div>}
            {item.price_range && <div className="detailInfoRow"><span className="detailInfoKey">Price Range</span><span className="detailInfoVal">{item.price_range}</span></div>}
            {item.contact && <div className="detailInfoRow"><span className="detailInfoKey">Contact</span><span className="detailInfoVal">{item.contact}</span></div>}
          </div>
          {item.features?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Features</h3>
              <div className="detailTags">{item.features.map((f, i) => <span key={i} className="detailTag">{f}</span>)}</div>
            </div>
          )}
          {item.related_city_ids?.length > 0 && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h3 className="detailCardTitle">Location</h3>
              <div className="relatedLinks">{uniqueValues(item.related_city_ids).map((cid) => <Link key={cid} to={`/cities/${cid}`} className="relatedLink"><MapPin size={12} /> {cid.charAt(0).toUpperCase() + cid.slice(1)}</Link>)}</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
