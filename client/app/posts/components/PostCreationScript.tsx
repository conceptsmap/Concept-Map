"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PenLine, X, Plus } from "lucide-react";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type PostType = "script" | "synopsis" | "storyboard";

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

function MultiSelectTags({
  label, options, selected, onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((s) => s !== val) : [...selected, val]);
  };
  return (
    <div className="space-y-2">
      <Label>{label} <span className="text-gray-400 text-xs font-normal">(optional — select multiple)</span></Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${selected.includes(opt)
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">
              {s}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggle(s)} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostCreationScript({
  submitRef, setLoading, others, visible, onToggle, isPrimary = true, onRemove,
}: Props) {
  const router = useRouter()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("TVC");
  const [genre, setGenre] = useState("CRIME");
  const [industryCategory, setIndustryCategory] = useState("TECHNOLOGY");
  const [price, setPrice] = useState("");
  const [scriptContent, setScriptContent] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [confirmRights, setConfirmRights] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Available states = union of states for all selected countries
  const availableStates = [...new Set(countries.flatMap((c) => STATES_BY_COUNTRY[c] ?? []))];

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("auth_token");

    if (!token) {
      setError("Please log in first.");
      return;
    }

    if (!confirmRights) {
      setError("Please confirm that you own the rights to this content.");
      return;
    }

    if (!title?.trim()) {
      setError("Title is required.");
      return;
    }

    if (!description?.trim()) {
      setError("Description is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    if (!genre) {
      setError("Genre is required.");
      return;
    }

    if (!industryCategory) {
      setError("Industry category is required.");
      return;
    }

    if (!scriptContent?.trim()) {
      setError("Script content is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Valid price is required.");
      return;
    }


    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        main_title: title.trim(),
        description: description.trim(),
        category,
        genre,
        industry_category: industryCategory,
        country: countries,
        state: states,
        script: {
          price: Number(price),
          currency: "INR",
          content: [
            {
              name: "Scene 1",
              scenes: [
                {
                  name: "Scene 1",
                  description: scriptContent.trim(),
                },
              ],
            },
          ],
        },
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web/script/script`,
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
        throw new Error(data?.message || "Failed to create script");
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create script");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { submitRef.current = handleSubmit; });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold">Script</h2>
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
          <Label>Price </Label>
          <Input type="number" placeholder="8000" value={price} onChange={(e) => setPrice(e.target.value)} min={0} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Script Content <span className="text-gray-400 text-xs font-normal">(optional)</span></Label>
        <Textarea rows={8} placeholder={`Scene 1 – Midnight\nEerie wind howls in the background...`} value={scriptContent} onChange={(e) => setScriptContent(e.target.value)} />
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
        <Checkbox id="script-rights" checked={confirmRights} onCheckedChange={(v) => setConfirmRights(Boolean(v))} />
        <Label htmlFor="script-rights" className="text-sm leading-snug">I confirm that I own the rights to these contents</Label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </div>
  );
}