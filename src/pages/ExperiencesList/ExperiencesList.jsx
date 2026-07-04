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

export default function ExperiencesList() {
  useSEO(LIST_SEO.experiences);

  const { data, loading } = useFetch("/api/unique-experiences");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.title, item.description, item.city)
    );
  }, [data, search]);

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="Bucket List Rajasthan"
        title="Unique Experiences"
        subtitle="Sleep inside a 12th-century living fort. Ride a camel at sunrise over the golden dunes. Watch falconers at a royal palace. These are the experiences of a lifetime."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search experiences, cities, activities..." />
      </PageHeader>
      <section className="handicraftsGrid">
        <div className="pageContainer">
          <InfiniteGrid
            items={items}
            loading={loading}
            loadingMsg="Curating your bucket list..."
            emptyTitle="No experiences found"
            emptyMsg="Try a different search term."
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl}
                badge={item.category || item.type}
                title={item.title}
                subtitle={item.city || item.location}
                description={item.description}
                to={`/experiences/${item.id}`}
                linkText="Plan this Experience"
                tags={item.tags || []}
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
