import React, { useState, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import SearchFilterBar from "../../components/ui/SearchFilterBar/SearchFilterBar";
import InfiniteGrid from "../../components/ui/InfiniteGrid/InfiniteGrid";
import RajCard from "../../components/ui/RajCard/RajCard";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import "../HandicraftsList/HandicraftsList.css";

export default function AttireList() {
  useSEO(LIST_SEO.attire);

  const { data, loading } = useFetch("/api/attire");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.name, item.description)
    );
  }, [data, search]);

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="Royal Wardrobe"
        title="Traditional Attire of Rajasthan"
        subtitle="A Rajput groom's Pagri has 1,001 folds. A Bandhani dupatta carries 75,000 knots. Every garment tells the story of a dynasty."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search attire, fabrics, regions..." />
      </PageHeader>
      <section className="handicraftsGrid">
        <div className="pageContainer">
          <InfiniteGrid
            items={items}
            loading={loading}
            loadingMsg="Unfolding the royal wardrobe..."
            emptyTitle="No attire found"
            emptyMsg="Try a different search term."
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl}
                badge={item.category || item.gender}
                title={item.name}
                subtitle={item.worn_by || item.region}
                description={item.description}
                to={`/attire/${item.id}`}
                linkText="View Attire"
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
