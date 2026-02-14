"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PostCreationSynopsis() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  // Use a valid default genre from TVCOTTSeriesGenre enum
  const [genre, setGenre] = useState<string | undefined>("CRIME");
  const [price, setPrice] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [audience, setAudience] = useState<string | undefined>("public");
  const [tags, setTags] = useState("#shortfilm #film");
  const [confirmRights, setConfirmRights] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!confirmRights) {
      setError("Please confirm that you own the rights to this synopsis.");
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
        type: ["SYNOPSIS"],
        synopsis: {
          price: price ? Number(price) : undefined,
          currency: "INR",
          content: synopsis,
        },
        tags,
        audience,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/script/synopsis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create synopsis");
      setSuccess("Synopsis created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create synopsis");
      } else {
        setError("Failed to create synopsis");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-lg">📝</span>
        <h2 className="text-lg font-semibold">Synopsis</h2>
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

      {/* Synopsis Sample */}
      <div className="space-y-2">
        <Label>Synopsis Sample</Label>
        <Textarea
          rows={10}
          placeholder={`✨ Overview\nA seasoned journalist, Lisa Carter...\n\n🔑 Key Plot Points\n• A cryptic lead\n• A race against time\n• The final revelation`}
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />
      </div>

      {/* File Upload & Audience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Attach PDF / DOC File</Label>
          <Input type="file" />
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
        <Button type="button" variant="outline" size="sm" onClick={() => router.push("/scripts")}>
          Script +
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => router.push("/storyboard")}>
          Story Board +
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
          I confirm that I own the rights to this synopsis.
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
