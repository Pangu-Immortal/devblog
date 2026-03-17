import { notFound } from "next/navigation";
import { getPostById, POSTS } from "@/lib/mock-data";
import PostDetailClient from "@/components/PostDetailClient";

export function generateStaticParams() {
  return POSTS.map((post) => ({ id: post.id }));
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) notFound();

  return <PostDetailClient post={post} />;
}
