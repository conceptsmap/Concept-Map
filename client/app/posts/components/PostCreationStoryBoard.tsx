"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Film, X, ImagePlus, Trash2 } from "lucide-react";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

type PostType = "script" | "synopsis" | "storyboard";

interface BoardFile {
  id: string;
  name: string;
  file: File;
  preview: string; // object URL for image preview
}

interface Props {
  submitRef: React.MutableRefObject<(() => void) | null>;
  setLoading: (v: boolean) => void;
  others: PostType[];
  visible: Set<PostType>;
  onToggle: (t: PostType) => void;
  isPrimary?: boolean;
  onRemove?: () => void;
}

const LABEL: Record<PostType, string> = {
  script: "Script",
  synopsis: "Synopsis",
  storyboard: "Story Board",
};

const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Singapore", "UAE"];
const STATES_BY_COUNTRY: Record<string, string[]> = {
  India: ["Kerala", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Gujarat", "Rajasthan", "West Bengal", "Telangana", "Andhra Pradesh"],
  "United States": ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Georgia", "Colorado"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
};

function MultiSelectTags({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((s) => s !== val) : [...selected, val]);
  };
  return (
    <div className="space-y-2">
      <Label>{label} <span className="text-gray-400 text-xs font-normal">(optional — select multiple)</span></Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${selected.includes(opt) ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-300 hover:border-green-400"}`}>
            {opt}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">
              {s}<X className="w-3 h-3 cursor-pointer" onClick={() => toggle(s)} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostCreationStoryBoard({
  submitRef, setLoading, others, visible, onToggle, isPrimary = true, onRemove,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("TVC");
  const [genre, setGenre] = useState("CRIME");
  const [industryCategory, setIndustryCategory] = useState("TECHNOLOGY");
  const [price, setPrice] = useState("");
  const [boardFiles, setBoardFiles] = useState<BoardFile[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [confirmRights, setConfirmRights] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableStates = [...new Set(countries.flatMap((c) => STATES_BY_COUNTRY[c] ?? []))];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newEntries: BoardFile[] = files.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      name: f.name.replace(/\.[^.]+$/, ""), // strip extension as default name
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
    }));
    setBoardFiles((prev) => [...prev, ...newEntries]);
    // reset input so same file can be re-added if needed
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setBoardFiles((prev) => {
      const entry = prev.find((f) => f.id === id);
      if (entry?.preview) URL.revokeObjectURL(entry.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const updateName = (id: string, name: string) => {
    setBoardFiles((prev) => prev.map((f) => f.id === id ? { ...f, name } : f));
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => { boardFiles.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); }); };
  }, []);

  const handleSubmit = async () => {
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

    if (!title || !description) {
      setError("Title and Description are required.");
      return;
    }

    setLoading(true);

    try {
      let uploadedContent: { name: string; cloud_url: string }[] = [];

      // ✅ STEP 1 — Upload Images First
      if (boardFiles.length > 0) {
        const formData = new FormData();

        boardFiles.forEach((bf) => {
          formData.append("files", bf.file);
        });

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web/script/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData?.message || "Failed to upload images");
        }

        // 🔥 Assuming backend returns something like:
        // [{ cloud_url: "..."} , { cloud_url: "..."}]
        uploadedContent = uploadData.data.map(
          (item: any, index: number) => ({
            name: boardFiles[index].name,
            cloud_url: item,
          })
        );
      }

      // ✅ STEP 2 — Send Final Storyboard Payload
      const payload: Record<string, unknown> = {
        main_title: title,
        description,
        category,
        genre,
        industry_category: industryCategory,
        story_borad: {
          ...(price ? { price: Number(price), currency: "INR" } : {}),
          ...(uploadedContent.length > 0
            ? { content: uploadedContent }
            : {}),
        },
      };

      if (countries.length) payload.country = countries;
      if (states.length) payload.state = states;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web/script/storyboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create story board");
      }

      setSuccess("Story board created successfully!");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create story board"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { submitRef.current = handleSubmit; });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold">Story Board</h2>
        </div>
        {!isPrimary && onRemove && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="text-gray-400 hover:text-red-500">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label>Title <span className="text-red-500">*</span></Label>
        <Input placeholder="The Silent Echo" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Description <span className="text-red-500">*</span></Label>
        <Textarea placeholder="A gripping thriller set in a dystopian future." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category <span className="text-red-500">*</span></Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TVC">TVC</SelectItem>
              <SelectItem value="OTT_SERIES">OTT Series</SelectItem>
              <SelectItem value="SHORT_FORM_VIDEO">Short Form Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Industry Category <span className="text-red-500">*</span></Label>
          <Select value={industryCategory} onValueChange={setIndustryCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="GROCERY">Grocery</SelectItem>
              <SelectItem value="CPG">CPG</SelectItem>
              <SelectItem value="ECOMMERCE">Ecommerce</SelectItem>
              <SelectItem value="BEAUTY & PERSONAL CARE">Beauty & Personal Care</SelectItem>
              <SelectItem value="HEALTH & WELLNESS">Health & Wellness</SelectItem>
              <SelectItem value="FINTECH">Fintech</SelectItem>
              <SelectItem value="TELECOM">Telecom</SelectItem>
              <SelectItem value="AUTO">Auto</SelectItem>
              <SelectItem value="TRAVEL & HOSPITALITY">Travel & Hospitality</SelectItem>
              <SelectItem value="F&B">F&B</SelectItem>
              <SelectItem value="CONSUMER ELECTRONICS">Consumer Electronics</SelectItem>
              <SelectItem value="BFSI">BFSI</SelectItem>
              <SelectItem value="APPAREL">Apparel</SelectItem>
              <SelectItem value="TECHNOLOGY">Technology</SelectItem>
              <SelectItem value="REAL ESTATE">Real Estate</SelectItem>
              <SelectItem value="UTILITIES">Utilities</SelectItem>
              <SelectItem value="JEWELLERY">Jewellery</SelectItem>
              <SelectItem value="MEDIA & ENTERTAINMENT">Media & Entertainment</SelectItem>
              <SelectItem value="OTHERS">Others</SelectItem>

            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Genre <span className="text-red-500">*</span></Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CRIME">Crime</SelectItem>
              <SelectItem value="ROMANCE">Romance</SelectItem>
              <SelectItem value="HORROR">Horror</SelectItem>
              <SelectItem value="ACTION">Action</SelectItem>
              <SelectItem value="COMEDY">Comedy</SelectItem>
              <SelectItem value="DRAMA">Drama</SelectItem>
              <SelectItem value="SCI-FI">Sci-Fi</SelectItem>
              <SelectItem value="FANTASY">Fantasy</SelectItem>
              <SelectItem value="HISTORICAL">Historical</SelectItem>
              <SelectItem value="DOCUMENTARY">Documentary</SelectItem>
              <SelectItem value="OTHERS">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price <span className="text-gray-400 text-xs font-normal">(optional)</span></Label>
          <Input type="number" placeholder="8000" value={price} onChange={(e) => setPrice(e.target.value)} min={0} />
        </div>
      </div>

      {/* Multi-file upload for story board panels */}
      <div className="space-y-3">
        <Label>Story Board Files <span className="text-gray-400 text-xs font-normal">(optional — upload multiple)</span></Label>

        {/* Drop zone */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-8 text-sm text-gray-500 hover:border-green-400 hover:bg-green-50 transition-colors"
        >
          <ImagePlus className="w-8 h-8 text-gray-400" />
          <span>Click to add files or drop images / PDFs here</span>
          <span className="text-xs text-gray-400">You can add multiple files</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Preview grid */}
        {boardFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {boardFiles.map((bf) => (
              <div key={bf.id} className="flex gap-3 items-start border rounded-lg p-3 bg-gray-50">
                {/* Thumbnail */}
                {bf.preview ? (
                  <img src={bf.preview} alt={bf.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0 border" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center rounded-md bg-gray-200 flex-shrink-0 text-xs text-gray-500 text-center">PDF</div>
                )}
                {/* Editable name + remove */}
                <div className="flex-1 min-w-0 space-y-1">
                  <Input
                    value={bf.name}
                    onChange={(e) => updateName(bf.id, e.target.value)}
                    placeholder="Panel name"
                    className="h-8 text-sm"
                  />
                  <p className="text-xs text-gray-400 truncate">{bf.file.name}</p>
                </div>
                <button type="button" onClick={() => removeFile(bf.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0 mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <MultiSelectTags label="Country" options={COUNTRIES} selected={countries} onChange={setCountries} />
      {availableStates.length > 0 && (
        <MultiSelectTags label="State" options={availableStates} selected={states} onChange={setStates} />
      )}

      {others.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {others.map((t) => (
            <Button key={t} type="button" variant={visible.has(t) ? "default" : "outline"} size="sm" onClick={() => onToggle(t)}>
              {visible.has(t) ? `Remove ${LABEL[t]}` : `${LABEL[t]} +`}
            </Button>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2">
        <Checkbox id="storyboard-rights" checked={confirmRights} onCheckedChange={(v) => setConfirmRights(Boolean(v))} />
        <Label htmlFor="storyboard-rights" className="text-sm leading-snug">I confirm that I own the rights to this story board.</Label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </div>
  );
}