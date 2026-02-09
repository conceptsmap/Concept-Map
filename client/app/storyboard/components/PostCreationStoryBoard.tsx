"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PostCreationStoryBoard() {
  const [title, setTitle] = useState("");
  // Use a valid default genre from TVCOTTSeriesGenre enum
  const [genre, setGenre] = useState<string | undefined>("CRIME");
  const [price, setPrice] = useState("");
  const [audience, setAudience] = useState<string | undefined>("public");
  const [tags, setTags] = useState("#shortfilm #film");
  const [confirmRights, setConfirmRights] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const handleScriptClick = () => router.push("/scripts");
  const handleSynopsisClick = () => router.push("/synopsis");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!confirmRights) {
      setError("Please confirm that you own the rights to this story board.");
      return;
    }
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Please log in first.");
      return;
    }
    if (!title || !genre) {
      setError("Please fill all required fields: Title, Genre.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        main_title: title,
        description: title,
        category: "TVC", // or get from UI if needed
        genre,
        industry_category: "TECHNOLOGY", // or get from UI if needed
        type: ["STORY_BOARD"],
        story_borad: {
          price: price ? Number(price) : undefined,
          currency: "INR",
          content: [
            {
              name: title,
              cloud_url: "", // Add upload logic if needed
            },
          ],
        },
        tags,
        audience,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/script/storyboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create story board");
      setSuccess("Story board created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create story board");
      } else {
        setError("Failed to create story board");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-lg">🎬</span>
        <h2 className="text-lg font-semibold">Story Board</h2>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          placeholder="The Silent Echo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Genre & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Genre</Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Select Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CRIME">Crime</SelectItem>
              <SelectItem value="ROMANCE">Romance</SelectItem>
              <SelectItem value="HORROR">Horror</SelectItem>
              <SelectItem value="ACTION">Action</SelectItem>
              <SelectItem value="COMEDY">Comedy</SelectItem>
              <SelectItem value="DRAMA">Drama</SelectItem>
              <SelectItem value="SCIFI">Sci-Fi</SelectItem>
              <SelectItem value="FANTASY">Fantasy</SelectItem>
              <SelectItem value="HISTORICAL">Historical</SelectItem>
              <SelectItem value="DOCUMENTARY">Documentary</SelectItem>
              <SelectItem value="OTHERS">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            type="number"
            placeholder="8000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Story Board Sample Upload */}
      <div className="space-y-2">
        <Label>Story Board Sample</Label>

        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          <div className="text-xl">🖼️</div>
          <p>Drop your image here or browse</p>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="storyboard-sample"
          />
        </div>
      </div>

      {/* Full Upload & Audience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Story Board Upload</Label>
          <Input type="file" accept=".jpg,.png,.pdf" />
        </div>

        <div className="space-y-2">
          <Label>Audience</Label>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger>
              <SelectValue placeholder="Public" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      {/* Related Posts */}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleScriptClick}>
          Script +
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleSynopsisClick}>
          Synopsis +
        </Button>
      </div>

      {/* Rights Confirmation */}
      <div className="flex items-start gap-2">
        <Checkbox
          id="rights"
          checked={confirmRights}
          onCheckedChange={(v) => setConfirmRights(Boolean(v))}
        />
        <Label htmlFor="rights" className="text-sm leading-snug">
          I confirm that I own the rights to this story board.
        </Label>
      </div>

      {/* Action */}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
