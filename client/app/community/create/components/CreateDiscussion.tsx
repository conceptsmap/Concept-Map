"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip } from "lucide-react";

export default function CreateDiscussion() {
  return (
    <div className="w-full mx-auto px-4">
      <form className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className=" text-lg">✎</span>
          <h2 className="text-lg font-semibold">Create Discussion</h2>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            placeholder="The Silent Echo"
            className="bg-gray-50"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="The Silent Echo"
            rows={4}
            className="bg-gray-50"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <Input
            placeholder="#shortfilm #film"
            className="bg-gray-50"
          />
        </div>

        {/* Attach File */}
        <div className="space-y-2">
          <Label>Attach File</Label>
          <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".jpg,.jpeg,.png,.mp4"
            />
            <div className="flex flex-col items-center gap-2">
              <Paperclip className="w-6 h-6 text-gray-400" />
              <p className="text-sm text-gray-500">
                Attach JPEG,PNG/Mp4 File
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Post Discussion
          </Button>
        </div>
      </form>
    </div>
  );
}