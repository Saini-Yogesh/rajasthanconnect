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

export default function UnescoSitesList() {
  useSEO(LIST_SEO.unescoSites);

  const { data, loading } = useFetch("/api/unesco-sites");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.name, item.description, item.city)
    );
  }, [data, search]);

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="World Heritage"
        title="UNESCO World Heritage Sites"
        subtitle="Rajasthan is home to some of India's most magnificent UNESCO-listed sites — from the six Hill Forts to Jantar Mantar's 18th-century astronomical instruments."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search UNESCO sites, cities, heritage..." />
      </PageHeader>
      <section className="handicraftsGrid">
        <div className="pageContainer">
          <InfiniteGrid
            items={items}
            loading={loading}
            loadingMsg="Consulting UNESCO archives..."
            emptyTitle="No UNESCO sites found"
            emptyMsg="Try a different search term."
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl}
                badge="UNESCO"
                badgeColor="#0e7490"
                title={item.name}
                subtitle={item.city || item.location}
                description={item.description}
                to={`/unesco-sites/${item.id}`}
                linkText="View Heritage Site"
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
