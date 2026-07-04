import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import SearchFilterBar from "../../components/ui/SearchFilterBar/SearchFilterBar";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import SectionHeader from "../../components/ui/SectionHeader/SectionHeader";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import "./DistrictsList.css";
import "../../styles/ListPage.css";

export default function DistrictsList() {
  useSEO(LIST_SEO.districts);

  const { data, loading } = useFetch("/api/districts");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.name, item.description, item.region)
    );
  }, [data, search]);

  return (
    <div className="districtsPage">
      <PageHeader
        badge={`${33} Districts`}
        title="Districts of Rajasthan"
        subtitle="Rajasthan is divided into 33 districts — spanning desert dunes, ancient hills, fertile plains, and sacred lakes. Each district carries its own unique identity."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search districts, regions..." />
      </PageHeader>

      <div className="pageContainer">
        {loading ? (
          <LoadingSpinner message="Mapping the districts..." />
        ) : items.length === 0 ? (
          <EmptyState title="No districts found" message="Try a different search." />
        ) : (
          <>
            <SectionHeader
              title="All Districts"
              subtitle={`Showing ${items.length} district${items.length !== 1 ? "s" : ""}`}
              align="left"
            />
            <div className="districtsGrid">
              {items.map((district) => (
                <Link
                  key={district.id}
                  to={`/cities?district_id=${district.id}`}
                  className="districtCard"
                >
                  <div className="districtCardInner">
                    <div className="districtNumber">{district.code || district.id?.slice(-2)?.toUpperCase()}</div>
                    <div className="districtInfo">
                      <h3 className="districtName">{district.name}</h3>
                      {district.region && <p className="districtRegion">{district.region}</p>}
                      {district.description && (
                        <p className="districtDesc">{district.description}</p>
                      )}
                    </div>
                    {district.area_km2 && (
                      <div className="districtArea">
                        <span>{district.area_km2?.toLocaleString()} km²</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
