"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import {
  createComment,
  getPostComments,
  likeComment,
  unlikeComment,
} from "@/app/lib/firebase-utils";
import { Comment } from "@/app/types";
import toast from "react-hot-toast";

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const commentsData = await getPostComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const comment = await createComment(postId, user.uid, newComment.trim());
      setComments([...comments, comment]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      if (comment.likes.includes(user.uid)) {
        await unlikeComment(commentId, user.uid);
        setComments(
          comments.map((c) =>
            c.id === commentId
              ? { ...c, likes: c.likes.filter((id) => id !== user.uid) }
              : c
          )
        );
      } else {
        await likeComment(commentId, user.uid);
        setComments(
          comments.map((c) =>
            c.id === commentId ? { ...c, likes: [...c.likes, user.uid] } : c
          )
        );
      }
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      toast.error("Failed to update like status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {user && (
        <form onSubmit={handleCreateComment} className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-foreground placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comment
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">
                    {comment.authorId[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  User {comment.authorId}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{comment.content}</p>
            {user && (
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`mt-2 text-sm ${
                  comment.likes.includes(user.uid)
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {comment.likes.length} likes
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
