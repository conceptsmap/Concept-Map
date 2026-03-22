"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Notifications from "@/layout/components/Notifications";
import Creative from "@/layout/components/Creative";
import Post, { PostProps } from "../dashboard/components/Post";
import FiltersCard, { FilterValues } from "./components/FiltersCard";
import PostSkeleton from "../dashboard/components/PostSkelton";

type BackendPost = PostProps & { _id?: string };

// ✅ Inner component with useSearchParams
const ScriptsContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [defaultPosts, setDefaultPosts] = useState<BackendPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [defaultLoading, setDefaultLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<FilterValues>({
    genres: [],
    contentTypes: [],
    categories: [],
    country: "",
    state: "",
    minPrice: 0,
    maxPrice: 50000,
  });

  const buildFilterParams = useCallback((currentFilters: FilterValues) => {
    const params = new URLSearchParams();
    if (currentFilters.genres.length > 0) params.set("genre", currentFilters.genres.join(","));
    if (currentFilters.contentTypes.length > 0) params.set("type", currentFilters.contentTypes.join(","));
    if (currentFilters.categories.length > 0) params.set("category", currentFilters.categories.join(","));
    if (currentFilters.country) params.set("country", currentFilters.country);
    if (currentFilters.state) params.set("state", currentFilters.state);
    params.set("minPrice", String(currentFilters.minPrice));
    params.set("maxPrice", String(currentFilters.maxPrice));
    return params.toString();
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      genres: [],
      contentTypes: [],
      categories: [],
      country: "",
      state: "",
      minPrice: 0,
      maxPrice: 50000,
    });
  }, []);

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.contentTypes.length > 0 ||
    filters.categories.length > 0 ||
    filters.country.length > 0 ||
    filters.state.length > 0 ||
    filters.minPrice !== 0 ||
    filters.maxPrice !== 50000;

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const authHeaders: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const filterParams = buildFilterParams(filters);
    const hasFiltersOrQuery = query || hasActiveFilters;

    if (!hasFiltersOrQuery) {
      (async () => {
        setDefaultLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/search?take=50`, {
            headers: authHeaders,
          });
          const data = await res.json();
          if (res.ok && data?.data?.scripts) setDefaultPosts(data.data.scripts);
        } catch { } finally {
          setDefaultLoading(false);
        }
      })();
      setPosts([]);
      setError("");
      return;
    }

    setError("");
    (async () => {
      setLoading(true);
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/web/search?take=20`;
        if (query) url += `&textSearch=${encodeURIComponent(query)}`;
        if (filterParams) url += `&${filterParams}`;

        const res = await fetch(url, { headers: authHeaders });
        const data = await res.json();

        if (res.ok && data?.data?.scripts) {
          setPosts(data.data.scripts);
        } else {
          setPosts([]);
          setError(data?.message || "No results found.");
        }
      } catch {
        setPosts([]);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    })();
  }, [query, filters, buildFilterParams, hasActiveFilters]);

  const displayPosts: BackendPost[] = query || hasActiveFilters ? posts : defaultPosts;
  const displayError = query || hasActiveFilters ? error : "";
  const displayLoading = query || hasActiveFilters ? loading : defaultLoading;

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start mt-2">
      <div className="flex-1">
        <div className="w-full lg:hidden mb-4">
          <details className="rounded-2xl bg-white p-3 shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold text-gray-800">
              Filters
            </summary>
            <div className="mt-3">
              <FiltersCard onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
            </div>
          </details>
        </div>

        {displayLoading && Array.from({ length: 5 }).map((_, index) => <PostSkeleton key={index} />)}

        {displayError && !displayLoading && (
          <div className="text-red-500 p-4">{displayError}</div>
        )}

        {!displayLoading && !displayError && displayPosts.length === 0 && (query || hasActiveFilters) && (
          <div className="text-gray-500 p-4">No results found.</div>
        )}

        <div className="flex flex-col gap-4">
          {displayPosts.map((post) => {
            const safePost = {
              ...post,
              author:
                post.author && typeof post.author === "object"
                  ? {
                    name: post.author.name || "Unknown",
                    jobRole: post.author.jobRole || "",
                    avatar: post.author.avatar || "",
                    profile: post.author.profile || "",
                  }
                  : { name: "Unknown", jobRole: "", avatar: "", profile: "" },
              likes: typeof post.likes === "number" ? post.likes : 0,
            };
            return <Post key={post._id ?? post.id} {...safePost} />;
          })}
        </div>
      </div>

      <div className="hidden lg:flex flex-col gap-4 shrink-0 xl:max-w-75 lg:max-w-56 w-full">
        <FiltersCard onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
        <Creative />
        <Notifications />
      </div>
    </div>
  );
};

// ✅ Default export with Suspense
export default function ScriptsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col lg:flex-row gap-4 items-start mt-2">
        <div className="flex-1">
          {Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)}
        </div>
      </div>
    }>
      <ScriptsContent />
    </Suspense>
  );
}