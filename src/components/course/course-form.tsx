"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  thumbnail: string | null;
  price: number;
  level: string;
  categoryId: string | null;
  status: string;
}

interface CourseFormProps {
  course: Course;
  categories: Category[];
}

export function CourseForm({ course, categories }: CourseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: course.title,
    slug: course.slug,
    subtitle: course.subtitle || "",
    description: course.description || "",
    thumbnail: course.thumbnail || "",
    price: course.price,
    level: course.level,
    categoryId: course.categoryId || "",
    status: course.status,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed updating course metadata");
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6 rounded-lg shadow-sm">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 p-3 rounded text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 p-3 rounded text-sm font-medium flex items-center gap-2">
          <Check className="h-4 w-4" />
          Course metadata updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Course Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-background border border-input rounded px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-foreground"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">URL Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full bg-background border border-input rounded px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-foreground"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">Short Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full bg-background border border-input rounded px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-foreground"
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">Detailed Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full bg-background border border-input rounded px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-foreground"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Price (INR)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full bg-background border border-input rounded px-3.5 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-foreground"
          />
        </div>

        {/* Level */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Difficulty Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full bg-background border border-input rounded px-3.5 py-2 text-sm cursor-pointer outline-none text-foreground"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full bg-background border border-input rounded px-3.5 py-2 text-sm cursor-pointer outline-none text-foreground"
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Publish Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-background border border-input rounded px-3.5 py-2 text-sm cursor-pointer outline-none text-foreground"
          >
            <option value="DRAFT">Draft</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
