import type { Metadata } from "next";
import { PostsView } from "@/components/posts/PostsView";

export const metadata: Metadata = {
  title: "Post · Ascentware Social Media Platform",
};

export default function PostPage() {
  return <PostsView />;
}
