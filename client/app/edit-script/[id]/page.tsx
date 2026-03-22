'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { ArrowLeft, ImagePlus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface BoardFile {
    id: string;
    name: string;
    file: File;
    preview: string; // object URL for image preview
}

type PostType = 'script' | 'synopsis' | 'storyboard';

interface ScriptData {
    _id: string;
    main_title: string;
    description: string;
    category: string;
    genre: string;
    industry_category: string;
    type: string[];
    country: string[];
    state: string[];
    is_draft?: boolean;
    script?: {
        price?: number;
        sale_type?: 'FIXED' | 'BIDDABLE';
        minimum_bid?: number;
        currency?: string;
        content?: { name: string; scenes: { name: string; description: string }[] }[];
    };
    synopsis?: {
        price?: number;
        sale_type?: 'FIXED' | 'BIDDABLE';
        minimum_bid?: number;
        currency?: string;
        content?: string;
    };
    story_borad?: {
        price?: number;
        sale_type?: 'FIXED' | 'BIDDABLE';
        minimum_bid?: number;
        currency?: string;
        content?: { name: string; cloud_url: string }[];
    };
}

const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Singapore", "UAE"];
const STATES_BY_COUNTRY: Record<string, string[]> = {
    India: ["Kerala", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Gujarat", "Rajasthan", "West Bengal", "Telangana", "Andhra Pradesh"],
    "United States": ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Georgia", "Colorado"],
    "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
    Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
    Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
};

export default function EditScriptPage() {
    const router = useRouter();
    const params = useParams();
    const scriptId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [scriptData, setScriptData] = useState<ScriptData | null>(null);
    const [scriptType, setScriptType] = useState<PostType>('script');

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('TVC');
    const [genre, setGenre] = useState('CRIME');
    const [industryCategory, setIndustryCategory] = useState('TECHNOLOGY');
    const [price, setPrice] = useState('');
    const [saleType, setSaleType] = useState<'FIXED' | 'BIDDABLE'>('FIXED');
    const [minimumBid, setMinimumBid] = useState('');
    const [content, setContent] = useState('');
    const [countries, setCountries] = useState<string[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [boardFiles, setBoardFiles] = useState<BoardFile[]>([]);
    const [existingBoardFiles, setExistingBoardFiles] = useState<{ name: string; cloud_url: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDraft, setIsDraft] = useState(false);

    const availableStates = [...new Set(countries.flatMap((c) => STATES_BY_COUNTRY[c] ?? []))];

    // Fetch script details
    useEffect(() => {
        const fetchScript = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setError('Please log in to edit scripts');
                    setLoading(false);
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const res = await fetch(`${apiUrl}/web/script/${scriptId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch script details');
                }

                const data = await res.json();
                const script = data.data;
                setScriptData(script);

                // Populate form based on script type
                setTitle(script.main_title || '');
                setDescription(script.description || '');
                setCategory(script.category || 'TVC');
                setGenre(script.genre || 'CRIME');
                setIndustryCategory(script.industry_category || 'TECHNOLOGY');
                setCountries(script.country || []);
                setStates(script.state || []);
                setIsDraft(script.is_draft || false);

                // Determine script type and populate content
                if (script.type?.includes('SYNOPSIS')) {
                    setScriptType('synopsis');
                    setPrice(script.synopsis?.price?.toString() || '');
                    setSaleType(script.synopsis?.sale_type === 'BIDDABLE' ? 'BIDDABLE' : 'FIXED');
                    setMinimumBid(script.synopsis?.minimum_bid?.toString() || '');
                    setContent(script.synopsis?.content || '');
                } else if (script.type?.includes('STORY_BOARD')) {
                    setScriptType('storyboard');
                    setPrice(script.story_borad?.price?.toString() || '');
                    setSaleType(script.story_borad?.sale_type === 'BIDDABLE' ? 'BIDDABLE' : 'FIXED');
                    setMinimumBid(script.story_borad?.minimum_bid?.toString() || '');
                    if (script.story_borad?.content) {
                        setExistingBoardFiles(script.story_borad.content);
                    }
                } else {
                    setScriptType('script');
                    setPrice(script.script?.price?.toString() || '');
                    setSaleType(script.script?.sale_type === 'BIDDABLE' ? 'BIDDABLE' : 'FIXED');
                    setMinimumBid(script.script?.minimum_bid?.toString() || '');
                    const scriptContent = script.script?.content?.[0]?.scenes?.[0]?.description || '';
                    setContent(scriptContent);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load script');
            } finally {
                setLoading(false);
            }
        };

        if (scriptId) {
            fetchScript();
        }
    }, [scriptId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const newEntries: BoardFile[] = files.map((f) => ({
            id: `${f.name}-${Date.now()}-${Math.random()}`,
            name: f.name.replace(/\.[^.]+$/, ''),
            file: f,
            preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
        }));
        setBoardFiles((prev) => [...prev, ...newEntries]);
        e.target.value = '';
    };

    const removeFile = (id: string) => {
        setBoardFiles((prev) => {
            const entry = prev.find((f) => f.id === id);
            if (entry?.preview) URL.revokeObjectURL(entry.preview);
            return prev.filter((f) => f.id !== id);
        });
    };

    const removeExistingFile = (cloudUrl: string) => {
        setExistingBoardFiles((prev) => prev.filter((f) => f.cloud_url !== cloudUrl));
    };

    const updateName = (id: string, name: string) => {
        setBoardFiles((prev) => prev.map((f) => f.id === id ? { ...f, name } : f));
    };

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            boardFiles.forEach((f) => {
                if (f.preview) URL.revokeObjectURL(f.preview);
            });
        };
    }, [boardFiles]);

    const handleCountryToggle = (country: string) => {
        setCountries(prev =>
            prev.includes(country)
                ? prev.filter(c => c !== country)
                : [...prev, country]
        );
    };

    const handleStateToggle = (state: string) => {
        setStates(prev =>
            prev.includes(state)
                ? prev.filter(s => s !== state)
                : [...prev, state]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('Please log in first.');
            return;
        }

        const isPublishing = !isDraft;

        if (isPublishing && !title?.trim()) {
            setError('Title is required.');
            return;
        }

        if (isPublishing && !description?.trim()) {
            setError('Description is required.');
            return;
        }

        if (isPublishing && saleType === 'FIXED' && (!price || Number(price) <= 0)) {
            setError('Valid fixed price is required.');
            return;
        }

        if (isPublishing && saleType === 'BIDDABLE' && (!minimumBid || Number(minimumBid) <= 0)) {
            setError('Valid minimum bid is required.');
            return;
        }

        if (isPublishing && scriptType !== 'storyboard' && !content?.trim()) {
            setError('Content is required.');
            return;
        }

        setSubmitting(true);

        try {
            let updatePayload: any = {
                country: countries,
                state: states,
                is_draft: isDraft,
            };

            if (title.trim()) updatePayload.main_title = title.trim();
            if (description.trim()) updatePayload.description = description.trim();
            if (category) updatePayload.category = category;
            if (genre) updatePayload.genre = genre;
            if (industryCategory) updatePayload.industry_category = industryCategory;

            if (scriptType === 'script') {
                const scriptPayload: any = {
                    sale_type: saleType,
                    currency: 'INR',
                };

                if (saleType === 'FIXED' && price && Number(price) > 0) {
                    scriptPayload.price = Number(price);
                }
                if (saleType === 'BIDDABLE' && minimumBid && Number(minimumBid) > 0) {
                    scriptPayload.minimum_bid = Number(minimumBid);
                }
                if (content.trim()) {
                    scriptPayload.content = [
                        {
                            name: 'Scene 1',
                            scenes: [
                                {
                                    name: 'Scene 1',
                                    description: content.trim(),
                                },
                            ],
                        },
                    ];
                }

                updatePayload.script = scriptPayload;
            } else if (scriptType === 'synopsis') {
                const synopsisPayload: any = {
                    sale_type: saleType,
                    currency: 'INR',
                };

                if (saleType === 'FIXED' && price && Number(price) > 0) {
                    synopsisPayload.price = Number(price);
                }
                if (saleType === 'BIDDABLE' && minimumBid && Number(minimumBid) > 0) {
                    synopsisPayload.minimum_bid = Number(minimumBid);
                }
                if (content.trim()) synopsisPayload.content = content.trim();

                updatePayload.synopsis = synopsisPayload;
            } else if (scriptType === 'storyboard') {
                let storyboardContent = [...existingBoardFiles];

                // Upload new files if any
                if (boardFiles.length > 0) {
                    const formData = new FormData();
                    boardFiles.forEach((bf) => {
                        formData.append('files', bf.file);
                    });

                    const uploadRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/web/script/upload`,
                        {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                        }
                    );

                    const uploadData = await uploadRes.json();
                    if (!uploadRes.ok) {
                        throw new Error(uploadData?.message || 'Failed to upload images');
                    }

                    const newUploadedContent = uploadData.data.map(
                        (item: any, index: number) => ({
                            name: boardFiles[index].name,
                            cloud_url: item,
                        })
                    );

                    storyboardContent = [...storyboardContent, ...newUploadedContent];
                }

                const storyboardPayload: any = {
                    sale_type: saleType,
                    currency: 'INR',
                };

                if (saleType === 'FIXED' && price && Number(price) > 0) {
                    storyboardPayload.price = Number(price);
                }
                if (saleType === 'BIDDABLE' && minimumBid && Number(minimumBid) > 0) {
                    storyboardPayload.minimum_bid = Number(minimumBid);
                }
                if (storyboardContent.length > 0) storyboardPayload.content = storyboardContent;

                updatePayload.story_borad = storyboardPayload;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const res = await fetch(`${apiUrl}/web/script/${scriptId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatePayload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.message || 'Failed to update script');
            }

            setSuccessMessage(isDraft ? 'Draft updated successfully!' : 'Script updated successfully!');
            setTimeout(() => {
                router.push('/my-posts');
            }, 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update script');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading script details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}


            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {successMessage}
                </div>
            )}

            {/* Form */}
            {/* Draft Toggle */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                <Checkbox
                    id="draft"
                    checked={isDraft}
                    onCheckedChange={(checked) => setIsDraft(Boolean(checked))}
                />
                <div className="flex-1">
                    <Label htmlFor="draft" className="cursor-pointer">
                        Save as Draft
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                        Draft scripts are not published and won't be visible to others
                    </p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                    <Input
                        id="title"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="description"
                        placeholder="Enter description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Category, Genre, Industry */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger id="category">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TVC">TVC</SelectItem>
                                <SelectItem value="OTT_SERIES">OTT Series</SelectItem>
                                <SelectItem value="SHORT_FORM_VIDEO">Short Form Video</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="genre">Genre <span className="text-red-500">*</span></Label>
                        <Select value={genre} onValueChange={setGenre}>
                            <SelectTrigger id="genre">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CRIME">Crime</SelectItem>
                                <SelectItem value="ROMANCE">Romance</SelectItem>
                                <SelectItem value="HORROR">Horror</SelectItem>
                                <SelectItem value="ACTION">Action</SelectItem>
                                <SelectItem value="COMEDY">Comedy</SelectItem>
                                <SelectItem value="DRAMA">Drama</SelectItem>
                                <SelectItem value="SCI-FI">Sci-Fi</SelectItem>
                                <SelectItem value="FANTASY">Fantasy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="industry">Industry Category <span className="text-red-500">*</span></Label>
                        <Select value={industryCategory} onValueChange={setIndustryCategory}>
                            <SelectTrigger id="industry">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                                <SelectItem value="GROCERY">Grocery</SelectItem>
                                <SelectItem value="CPG">CPG</SelectItem>
                                <SelectItem value="ECOMMERCE">Ecommerce</SelectItem>
                                <SelectItem value="BEAUTY & PERSONAL CARE">Beauty & Personal Care</SelectItem>
                                <SelectItem value="HEALTH & WELLNESS">Health & Wellness</SelectItem>
                                <SelectItem value="FINTECH">Fintech</SelectItem>
                                <SelectItem value="AUTO">Auto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <Label htmlFor="sale-type">Sale Type <span className="text-red-500">*</span></Label>
                    <Select value={saleType} onValueChange={(value: 'FIXED' | 'BIDDABLE') => setSaleType(value)}>
                        <SelectTrigger id="sale-type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FIXED">Fixed Price</SelectItem>
                            <SelectItem value="BIDDABLE">Biddable</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {saleType === 'FIXED' ? (
                    <div className="space-y-2">
                        <Label htmlFor="price">Fixed Price (INR) <span className="text-red-500">*</span></Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="1000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="minimum-bid">Minimum Bid (INR) <span className="text-red-500">*</span></Label>
                        <Input
                            id="minimum-bid"
                            type="number"
                            placeholder="1000"
                            value={minimumBid}
                            onChange={(e) => setMinimumBid(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                )}

                {/* Storyboard File Upload */}
                {scriptType === 'storyboard' && (
                    <div className="space-y-3">
                        <Label>Story Board Files <span className="text-gray-400 text-xs font-normal">(optional — upload multiple)</span></Label>

                        {/* Existing Files */}
                        {existingBoardFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 font-medium">Current Files:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {existingBoardFiles.map((file) => (
                                        <div key={file.cloud_url} className="flex gap-3 items-start border rounded-lg p-3 bg-gray-50">
                                            <img
                                                src={file.cloud_url}
                                                alt={file.name}
                                                className="w-16 h-16 object-cover rounded-md shrink-0 border"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{file.cloud_url}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingFile(file.cloud_url)}
                                                className="text-gray-400 hover:text-red-500 shrink-0 mt-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Drop zone for new files */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-8 text-sm text-gray-500 hover:border-green-400 hover:bg-green-50 transition-colors"
                        >
                            <ImagePlus className="w-8 h-8 text-gray-400" />
                            <span>Click to add files or drop images here</span>
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

                        {/* New Files Preview */}
                        {boardFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 font-medium">New Files to Upload:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {boardFiles.map((bf) => (
                                        <div key={bf.id} className="flex gap-3 items-start border rounded-lg p-3 bg-gray-50">
                                            {bf.preview ? (
                                                <img src={bf.preview} alt={bf.name} className="w-16 h-16 object-cover rounded-md shrink-0 border" />
                                            ) : (
                                                <div className="w-16 h-16 flex items-center justify-center rounded-md bg-gray-200 shrink-0 text-xs text-gray-500 text-center">
                                                    FILE
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <Input
                                                    value={bf.name}
                                                    onChange={(e) => updateName(bf.id, e.target.value)}
                                                    placeholder="Panel name"
                                                    className="h-8 text-sm"
                                                />
                                                <p className="text-xs text-gray-400 truncate">{bf.file.name}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(bf.id)}
                                                className="text-gray-400 hover:text-red-500 shrink-0 mt-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Content (for script and synopsis) */}
                {scriptType !== 'storyboard' && (
                    <div className="space-y-2">
                        <Label htmlFor="content">
                            {scriptType === 'script' ? 'Script Content' : 'Synopsis Content'}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="content"
                            placeholder={
                                scriptType === 'script'
                                    ? 'Enter your script content...'
                                    : 'Enter your synopsis content...'
                            }
                            rows={8}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                )}

                {/* Countries */}
                <div className="space-y-2">
                    <Label>Countries <span className="text-gray-400 text-xs">(optional)</span></Label>
                    <div className="flex flex-wrap gap-2">
                        {COUNTRIES.map((country) => (
                            <button
                                key={country}
                                type="button"
                                onClick={() => handleCountryToggle(country)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${countries.includes(country)
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                                    }`}
                            >
                                {country}
                            </button>
                        ))}
                    </div>
                </div>

                {/* States */}
                {availableStates.length > 0 && (
                    <div className="space-y-2">
                        <Label>States <span className="text-gray-400 text-xs">(optional)</span></Label>
                        <div className="flex flex-wrap gap-2">
                            {availableStates.map((state) => (
                                <button
                                    key={state}
                                    type="button"
                                    onClick={() => handleStateToggle(state)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${states.includes(state)
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                                        }`}
                                >
                                    {state}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/my-posts')}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={submitting}
                    >
                        {submitting ? 'Updating...' : 'Update ' + scriptType.charAt(0).toUpperCase() + scriptType.slice(1)}
                    </Button>
                </div>
            </form>
        </div>
    );
}
