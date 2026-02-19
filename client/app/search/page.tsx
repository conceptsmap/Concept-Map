"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Notifications from "@/layout/components/Notifications";
import Creative from "@/layout/components/Creative";
import Post, { PostProps } from "../dashboard/components/Post";
import FiltersCard, { FilterValues } from "./components/FiltersCard";
import PostSkeleton from "../dashboard/components/PostSkelton";
import { profile } from "console";

type BackendPost = PostProps & { _id?: string };

export default function ScriptsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [defaultPosts, setDefaultPosts] = useState<BackendPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [defaultLoading, setDefaultLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<FilterValues>({
    genres: [],
    occasions: [],
    licenceTypes: [],
    location: "",
  });

  // Build query string from filters
  const buildFilterParams = useCallback((currentFilters: FilterValues) => {
    const params = new URLSearchParams();

    // Combine genres and occasions into filter param
    const filterItems = [...currentFilters.genres, ...currentFilters.occasions];
    if (filterItems.length > 0) {
      params.set("filter", filterItems.join(","));
    }

    // Location - split into state (just use location as state for now)
    if (currentFilters.location) {
      params.set("state", currentFilters.location);
    }

    return params.toString();
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      genres: [],
      occasions: [],
      licenceTypes: [],
      location: "",
    });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = filters.genres.length > 0 ||
    filters.occasions.length > 0 ||
    filters.licenceTypes.length > 0 ||
    filters.location.length > 0;

  // Fetch posts when query or filters change
  useEffect(() => {
    const filterParams = buildFilterParams(filters);
    const hasFiltersOrQuery = query || hasActiveFilters;

    if (!hasFiltersOrQuery) {
      // Fetch default recent posts
      (async () => {
        setDefaultLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/search?take=20`);
          const data = await res.json();
          if (res.ok && data?.data?.scripts) {
            console.log("Default posts data:", data.data.scripts);
            setDefaultPosts(data.data.scripts);
          }
        } catch {
          // Silently fail for default posts
        } finally {
          setDefaultLoading(false);
        }
      })();
      setPosts([]);
      setError("");
      return;
    }

    // Fetch with search query and/or filters
    setError("");
    (async () => {
      setLoading(true);
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/web/search?take=20`;
        if (query) {
          url += `&textSearch=${encodeURIComponent(query)}`;
        }
        if (filterParams) {
          url += `&${filterParams}`;
        }
        const res = await fetch(url);
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

  // Show search results if there's a query or filters, otherwise show default recent posts
  const displayPosts: BackendPost[] = (query || hasActiveFilters) ? posts : defaultPosts;
  const displayError = (query || hasActiveFilters) ? error : "";
  const displayLoading = (query || hasActiveFilters) ? loading : defaultLoading;

  return (
    <div className="flex gap-4 items-start mt-2">
      {/* LEFT */}
      <div className="flex-1">
        {/* {!query && !displayLoading && displayPosts.length > 0 && (
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Posts</h2>
        )} */}
        {displayLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))
        }
        {displayError && !displayLoading && <div className="text-red-500 p-4">{displayError}</div>}
        {!displayLoading && !displayError && displayPosts.length === 0 && (query || hasActiveFilters) && (
          <div className="text-gray-500 p-4">No results found.</div>
        )}
        <div className="flex flex-col gap-4">
          {displayPosts.map((post) => {
            // Fallback for missing author or avatar
            const safePost = {
              ...post,
              author: post.author && typeof post.author === 'object'
                ? {
                  name: post.author.name || 'Unknown', jobRole: post.author.jobRole || '', avatar: post.author.avatar || '', profile: post.author.profile || ''
                }
                : { name: 'Unknown', jobRole: '', avatar: '', profile: '' },
              likes: typeof post.likes === 'number' ? post.likes : 0,
            };
            return <Post key={post._id ?? post.id} {...safePost} />;
          })}
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex flex-col gap-4 shrink-0   xl:max-w-75
        lg:max-w-56">
        <FiltersCard
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        <Creative />
        <Notifications />
      </div>
    </div>
  );
}
