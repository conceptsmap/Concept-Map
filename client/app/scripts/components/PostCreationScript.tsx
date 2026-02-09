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

export default function PostCreationScript() {
  const router = useRouter();
  const [tags, setTags] = useState("#shortfilm #film");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [genre, setGenre] = useState<string | undefined>("DRAMA");
  const [price, setPrice] = useState("");
  const [scriptSample, setScriptSample] = useState("");
  const [audience, setAudience] = useState<string | undefined>("public");
  const [category, setCategory] = useState<string | undefined>("TVC");
  const [industryCategory, setIndustryCategory] = useState<string | undefined>(
    "TECHNOLOGY",
  );
  const [scriptType, setScriptType] = useState<string | undefined>("SCRIPT");
  const [confirmRights, setConfirmRights] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!confirmRights) {
      setError("Please confirm that you own the rights to these contents.");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Please log in first.");
      return;
    }

    const missingFields: string[] = [];
    if (!title) missingFields.push("Title");
    if (!shortDescription) missingFields.push("Short Description");
    if (!genre) missingFields.push("Genre");
    if (!category) missingFields.push("Category");
    if (!industryCategory) missingFields.push("Industry Category");
    if (!scriptType) missingFields.push("Type");

    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(", ")}.`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        main_title: title,
        description: shortDescription,
        category,
        genre,
        industry_category: industryCategory,
        type: [scriptType],
        script: {
          price: price ? Number(price) : undefined,
          currency: "INR",
          content: scriptSample
            ? [
                {
                  name: "Sample",
                  scenes: [
                    {
                      name: "Sample Scene",
                      description: scriptSample,
                    },
                  ],
                },
              ]
            : undefined,
        },
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/script`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create script");
      setSuccess("Script created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create script");
      } else {
        setError("Failed to create script");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
  w-full
  mx-auto
  px-4
"
    >
        {/*   max-w-full
   xl:max-w-6xl
   2xl:max-w-7xl */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-lg">✎</span>
          <h2 className="text-lg font-semibold">Script</h2>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            placeholder="The Silent Echo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <Label>Short Description</Label>
          <Textarea
            placeholder="A gripping thriller set in a dystopian future."
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </div>

        {/* Category & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TVC">TVC</SelectItem>
                <SelectItem value="OTT_SERIES">OTT Series</SelectItem>
                <SelectItem value="SHORT_FORM_VIDEO">
                  Short Form Video
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Industry Category</Label>
            <Select
              value={industryCategory}
              onValueChange={setIndustryCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                <SelectItem value="FINTECH">Fintech</SelectItem>
                <SelectItem value="MEDIA_AND_ENTERTAINMENT">
                  Media & Entertainment
                </SelectItem>
                <SelectItem value="HEALTH_AND_WELLNESS">
                  Health & Wellness
                </SelectItem>
                <SelectItem value="TRAVEL_AND_HOSPITALITY">
                  Travel & Hospitality
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Genre & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Thriller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAMA">Drama</SelectItem>
                <SelectItem value="ACTION">Action</SelectItem>
                <SelectItem value="COMEDY">Comedy</SelectItem>
                <SelectItem value="HORROR">Horror</SelectItem>
                <SelectItem value="ROMANCE">Romance</SelectItem>
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
              min={0}
            />
          </div>
        </div>

        {/* Script Sample */}
        <div className="space-y-2">
          <Label>Script Sample</Label>
          <Textarea
            rows={8}
            placeholder={`🎬 Scene 1 – Midnight (0–5 sec)\nEerie wind howls in the background...`}
            value={scriptSample}
            onChange={(e) => setScriptSample(e.target.value)}
          />
        </div>

        {/* File Upload & Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Script Upload</Label>
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
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/synopsis")}> 
            Synopsis +
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/storyboard")}> 
            Story Board +
          </Button>
        </div>

        {/* Script Type */}
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={scriptType}
            onValueChange={(value) => {
              if (value === "STORY_BOARD") {
                router.push("/storyboard");
                return;
              }
              if (value === "SYNOPSIS") {
                router.push("/synopsis");
                return;
              }
              setScriptType(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SCRIPT">Script</SelectItem>
              <SelectItem value="STORY_BOARD">Story Board</SelectItem>
              <SelectItem value="SYNOPSIS">Synopsis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Confirmation */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="rights"
            checked={confirmRights}
            onCheckedChange={(value) => setConfirmRights(Boolean(value))}
          />
          <Label htmlFor="rights" className="text-sm leading-snug">
            I confirm that I own the rights to these contents
          </Label>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}

        {/* Action */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
