"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  getCommunity,
  getCommunityPosts,
  createPost,
  joinCommunity,
  leaveCommunity,
  likePost,
  unlikePost,
} from "@/app/lib/firebase-utils";
import { Community, Post } from "@/app/types";
import Comments from "@/app/components/Comments";
import toast from "react-hot-toast";

export default function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
  });
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  useEffect(() => {
    const loadCommunity = async () => {
      const communityData = await getCommunity(id);
      if (communityData) {
        setCommunity(communityData);
        const postsData = await getCommunityPosts(id);
        setPosts(postsData);
      } else {
        router.push("/dashboard/communities");
      }
    };
    loadCommunity();
  }, [id, router]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !community) return;

    try {
      const post = await createPost(community.id, user.uid, newPost.content);
      setPosts([post, ...posts]);
      setIsCreatingPost(false);
      setNewPost({ content: "" });
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  const handleJoinCommunity = async () => {
    if (!user || !community) return;
    try {
      await joinCommunity(community.id, user.uid);
      setCommunity({
        ...community,
        members: [...community.members, user.uid],
      });
      toast.success("Joined community successfully!");
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("Failed to join community");
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user || !community) return;
    try {
      await leaveCommunity(community.id, user.uid);
      setCommunity({
        ...community,
        members: community.members.filter((id) => id !== user.uid),
      });
      toast.success("Left community successfully!");
    } catch (error) {
      console.error("Error leaving community:", error);
      toast.error("Failed to leave community");
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      if (post.likes.includes(user.uid)) {
        await unlikePost(postId, user.uid);
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? { ...p, likes: p.likes.filter((id) => id !== user.uid) }
              : p
          )
        );
      } else {
        await likePost(postId, user.uid);
        setPosts(
          posts.map((p) =>
            p.id === postId ? { ...p, likes: [...p.likes, user.uid] } : p
          )
        );
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      toast.error("Failed to update like status");
    }
  };

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isMember = user && community.members.includes(user.uid);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {community.name}
              </h1>
              <p className="mt-2 text-gray-500">{community.description}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>{community.members.length} members</span>
              </div>
            </div>
            {user && (
              <button
                onClick={isMember ? handleLeaveCommunity : handleJoinCommunity}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  isMember
                    ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    : "text-white bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isMember ? "Leave Community" : "Join Community"}
              </button>
            )}
          </div>
        </div>
      </div>

      {isMember && (
        <div className="mt-8">
          <button
            onClick={() => setIsCreatingPost(true)}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <div className="flex items-center justify-center">
              <PhotoIcon className="h-6 w-6 mr-2" />
              <span>Create a post</span>
            </div>
          </button>
        </div>
      )}

      {isCreatingPost && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ content: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-500">
                      {post.authorId[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    User {post.authorId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-900">{post.content}</p>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                {user && (
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`text-sm ${
                      post.likes.includes(user.uid)
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {post.likes.length} likes
                  </button>
                )}
                <button
                  onClick={() =>
                    setExpandedPost(expandedPost === post.id ? null : post.id)
                  }
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {post.comments.length} comments
                </button>
              </div>
              {expandedPost === post.id && <Comments postId={post.id} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
