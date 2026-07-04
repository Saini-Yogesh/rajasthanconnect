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

export default function CommunitiesList() {
  useSEO(LIST_SEO.communities);

  const { data, loading } = useFetch("/api/communities-tribes");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.name, item.description, item.region)
    );
  }, [data, search]);

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="Living Communities"
        title="Communities & Tribes"
        subtitle="From the warrior Rajputs to the nomadic Rabaris, Rajasthan's communities have shaped its art, festivals, and traditions for thousands of years."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search communities, tribes, regions..." />
      </PageHeader>
      <section className="handicraftsGrid">
        <div className="pageContainer">
          <InfiniteGrid
            items={items}
            loading={loading}
            loadingMsg="Gathering the communities..."
            emptyTitle="No communities found"
            emptyMsg="Try a different search term."
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl}
                badge={item.type || "Community"}
                title={item.name}
                subtitle={item.region}
                description={item.description}
                to={`/communities/${item.id}`}
                linkText="Explore Community"
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
