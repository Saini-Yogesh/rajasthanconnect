import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Music } from "lucide-react";
import { useFetchById } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import useSEO from "../../hooks/useSEO";
import { buildFolkMusicSEO } from "../../utils/seo";
import ReviewsSection from "../../components/ui/ReviewsSection/ReviewsSection";
import "../../styles/DetailPage.css";

const FALLBACK = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80";

export default function FolkMusicDetail() {
  const { id } = useParams();
  const { data: item, loading, error } = useFetchById("/api/folk-music-instruments", id);

  useSEO(buildFolkMusicSEO(item, id));

  if (loading) return <LoadingSpinner message="Listening to the desert winds..." size="lg" />;
  if (error || !item)
    return <EmptyState title="Not found" message="This music record doesn't exist." action={<Link to="/folk-music" className="relatedLink">← Folk Music</Link>} />;

  return (
    <div className="detailPage">
      <div className="detailHero" style={{ backgroundImage: `url(${item.image_url || FALLBACK})` }}>
        <div className="detailHeroOverlay" />
        <div className="detailHeroContent">
          {(item.category || item.type) && <span className="detailHeroBadge">{item.category || item.type}</span>}
          <h1 className="detailHeroTitle">{item.name}</h1>
          {item.community && <p className="detailHeroSubtitle"><Music size={16} /> {item.community}</p>}
        </div>
      </div>
      <div className="detailBody">
        <div className="detailMain">
          <Link to="/folk-music" className="detailBackLink"><ArrowLeft size={16} /> Back to Folk Music</Link>
          <div className="detailCard">
            <h2 className="detailCardTitle"><Music size={18} /> About this Tradition</h2>
            <p className="detailDescription">{item.origin_history || item.description}</p>
          </div>
          {(item.tuning_playing_style || item.history) && <div className="detailCard" style={{ marginTop: 20 }}><h2 className="detailCardTitle">History</h2><p className="detailDescription">{item.tuning_playing_style || item.history}</p></div>}
          {item.details && typeof item.details === "object" && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Details</h2>
              {Object.entries(item.details).map(([k, v]) => (
                <div className="detailInfoRow" key={k}>
                  <span className="detailInfoKey">{k.replace(/_/g, " ")}</span>
                  <span className="detailInfoVal">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Traveler Reviews */}
          <ReviewsSection itemId={id} itemType="folkmusic" />
        </div>
        <aside className="detailSidebar">
          <div className="detailCard">
            <h3 className="detailCardTitle">Quick Info</h3>
            {(item.category || item.type) && <div className="detailInfoRow"><span className="detailInfoKey">Type</span><span className="detailInfoVal">{item.category || item.type}</span></div>}
            {item.community && <div className="detailInfoRow"><span className="detailInfoKey">Community</span><span className="detailInfoVal">{item.community}</span></div>}
            {item.region && <div className="detailInfoRow"><span className="detailInfoKey">Region</span><span className="detailInfoVal">{item.region}</span></div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
