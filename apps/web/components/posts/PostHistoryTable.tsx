"use client";

import { useMemo, useState } from "react";
import type { Post, TabStatus } from "@/lib/posts/types";
import { usePosts } from "@/lib/posts/store";
import { usePlatforms } from "@/lib/platforms/store";
import { contentTypeById } from "@/lib/posts/content-templates";
import { formatDate } from "@/lib/organizations/derive";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SearchIcon, TrashIcon } from "@/components/ui/icons";

const HEADERS = ["Content", "Platforms", "Created", "Actions"] as const;
const PAGE_SIZE = 10;

const TONE_BY_STATUS: Record<TabStatus, "neutral" | "success" | "error" | "warning"> = {
  generating: "neutral",
  ready: "neutral",
  draft: "neutral",
  scheduled: "warning",
  posting: "neutral",
  posted: "success",
  failed: "error",
};

const STATUS_LABELS: Record<TabStatus, string> = {
  generating: "generating",
  ready: "ready",
  draft: "draft",
  scheduled: "scheduled",
  posting: "posting",
  posted: "posted",
  failed: "failed",
};

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "posted", label: "Posted" },
  { value: "failed", label: "Failed" },
  { value: "in_progress", label: "In progress" },
];

function postMatchesStatusFilter(post: Post, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "in_progress") return post.drafts.some((d) => d.status === "generating" || d.status === "posting");
  return post.drafts.some((d) => d.status === filter);
}

export function PostHistoryTable({ posts }: { posts: Post[] }) {
  const { platformById, state: platformsState } = usePlatforms();
  const { deletePost } = usePosts();
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const type = contentTypeById(post.contentType);
      if (q) {
        const haystack = `${type?.label ?? post.contentType} ${post.prompt} ${post.drafts.map((d) => d.caption).join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (platformFilter !== "all" && !post.drafts.some((d) => d.platformId === platformFilter)) return false;
      if (!postMatchesStatusFilter(post, statusFilter)) return false;
      return true;
    });
  }, [posts, query, platformFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search posts"
            aria-label="Search posts"
            className="w-full pl-8"
          />
        </div>
        <Select
          value={platformFilter}
          onChange={(e) => {
            setPlatformFilter(e.target.value);
            setPage(0);
          }}
          aria-label="Filter by platform"
        >
          <option value="all">All Platforms</option>
          {platformsState.platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          aria-label="Filter by status"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/15">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {HEADERS.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className={`px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant ${
                      header === "Actions" ? "text-right" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={HEADERS.length} className="px-4 py-14 text-center">
                    <EmptyState
                      title="No posts found"
                      description={
                        posts.length === 0
                          ? "Generated posts for this organization will appear here."
                          : "No posts match your filters."
                      }
                    />
                  </td>
                </tr>
              ) : (
                pageItems.map((post) => {
                  const type = contentTypeById(post.contentType);
                  return (
                    <tr key={post.id} className="border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-white/[0.04]">
                      <td className="px-4 py-3">
                        <span className="text-[14px] font-semibold text-on-surface">{type?.label ?? post.contentType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {post.drafts.map((draft) => (
                            <Badge key={draft.platformId} tone={TONE_BY_STATUS[draft.status]}>
                              {platformById(draft.platformId)?.name ?? draft.platformId} · {STATUS_LABELS[draft.status]}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-on-surface-variant">{formatDate(post.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <IconButton label={`Delete ${type?.label ?? "post"}`} onClick={() => setDeleteTarget(post)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5">
            <p className="text-[12px] text-on-surface-variant">
              Page {currentPage + 1} of {pageCount}
            </p>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= pageCount - 1}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titleId="delete-post-title"
        title="Delete this post?"
        description="This removes it from history. This cannot be undone."
        confirmLabel="Delete post"
        onConfirm={() => {
          if (deleteTarget) deletePost(deleteTarget.id);
        }}
      />
    </div>
  );
}
