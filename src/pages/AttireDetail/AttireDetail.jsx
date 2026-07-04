import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useFetchById } from "../../hooks/useFetch";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import useSEO from "../../hooks/useSEO";
import { buildAttireSEO } from "../../utils/seo";
import ReviewsSection from "../../components/ui/ReviewsSection/ReviewsSection";
import "../../styles/DetailPage.css";

const FALLBACK = "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80";

export default function AttireDetail() {
  const { id } = useParams();
  const { data: item, loading, error } = useFetchById("/api/attire", id);

  useSEO(buildAttireSEO(item, id));

  if (loading) return <LoadingSpinner message="Opening the royal wardrobe..." size="lg" />;
  if (error || !item)
    return <EmptyState title="Not found" message="This attire record doesn't exist." action={<Link to="/attire" className="relatedLink">← Attire</Link>} />;

  return (
    <div className="detailPage">
      <div className="detailHero" style={{ backgroundImage: `url(${item.image_url || FALLBACK})` }}>
        <div className="detailHeroOverlay" />
        <div className="detailHeroContent">
          {item.category && <span className="detailHeroBadge">{item.category}</span>}
          <h1 className="detailHeroTitle">{item.name}</h1>
          {item.worn_by && <p className="detailHeroSubtitle"><ShieldCheck size={16} /> {item.worn_by}</p>}
        </div>
      </div>
      <div className="detailBody">
        <div className="detailMain">
          <Link to="/attire" className="detailBackLink"><ArrowLeft size={16} /> Back to Attire</Link>
          <div className="detailCard">
            <h2 className="detailCardTitle"><ShieldCheck size={18} /> About this Attire</h2>
            <p className="detailDescription">{item.cultural_significance || item.description}</p>
          </div>
          {item.wearing_style_occasions && <div className="detailCard" style={{ marginTop: 20 }}><h2 className="detailCardTitle">History</h2><p className="detailDescription">{item.wearing_style_occasions}</p></div>}
          {item.details && typeof item.details === "object" && (
            <div className="detailCard" style={{ marginTop: 20 }}>
              <h2 className="detailCardTitle">Attire Details</h2>
              {Object.entries(item.details).map(([k, v]) => (
                <div className="detailInfoRow" key={k}>
                  <span className="detailInfoKey">{k.replace(/_/g, " ")}</span>
                  <span className="detailInfoVal">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Traveler Reviews */}
          <ReviewsSection itemId={id} itemType="attire" />
        </div>
        <aside className="detailSidebar">
          <div className="detailCard">
            <h3 className="detailCardTitle">Quick Info</h3>
            {item.category && <div className="detailInfoRow"><span className="detailInfoKey">Category</span><span className="detailInfoVal">{item.category}</span></div>}
            {item.worn_by && <div className="detailInfoRow"><span className="detailInfoKey">Worn By</span><span className="detailInfoVal">{item.worn_by}</span></div>}
            {(item.material_fabrics || item.fabric) && <div className="detailInfoRow"><span className="detailInfoKey">Fabric</span><span className="detailInfoVal">{Array.isArray(item.material_fabrics) ? item.material_fabrics.join(", ") : (item.material_fabrics || item.fabric)}</span></div>}
            {(item.wearing_style_occasions || item.occasions) && <div className="detailInfoRow"><span className="detailInfoKey">Occasion</span><span className="detailInfoVal">{Array.isArray(item.occasions) ? item.occasions.join(", ") : (item.wearing_style_occasions || item.occasions)}</span></div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
