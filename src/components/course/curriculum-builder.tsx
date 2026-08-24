"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash, Edit, Check, X, Video, FileText, HelpCircle, Calendar, File } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  type: string;
  sortOrder: number;
}

interface Section {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface CurriculumBuilderProps {
  courseId: string;
  initialSections: Section[];
}

export function CurriculumBuilder({ courseId, initialSections }: CurriculumBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [addingLessonSectionId, setAddingLessonSectionId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonType, setNewLessonType] = useState<string>("VIDEO");

  // Fetch updated course curriculum
  const refreshCurriculum = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const json = await res.json();
      if (json.success) {
        setSections(json.data.sections);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // SECTION CRUD
  // ----------------------------------------------------

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSectionTitle }),
      });
      if (res.ok) {
        setNewSectionTitle("");
        setIsAddingSection(false);
        refreshCurriculum();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSectionTitle = async (sectionId: string) => {
    if (!editingSectionTitle.trim()) return;
    try {
      const res = await fetch(`/api/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingSectionTitle }),
      });
      if (res.ok) {
        setEditingSectionId(null);
        refreshCurriculum();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section and all its lessons?")) return;
    try {
      const res = await fetch(`/api/sections/${sectionId}`, { method: "DELETE" });
      if (res.ok) {
        refreshCurriculum();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // LESSON CRUD
  // ----------------------------------------------------

  const handleAddLesson = async (sectionId: string) => {
    if (!newLessonTitle.trim()) return;
    try {
      const res = await fetch(`/api/sections/${sectionId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newLessonTitle, type: newLessonType }),
      });
      if (res.ok) {
        setNewLessonTitle("");
        setAddingLessonSectionId(null);
        refreshCurriculum();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
      if (res.ok) {
        refreshCurriculum();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // DRAG & DROP REORDERING (HTML5 APIs)
  // ----------------------------------------------------

  // Reorder Sections
  const handleSectionDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("sectionIndex", index.toString());
  };

  const handleSectionDrop = async (e: React.DragEvent, targetIndex: number) => {
    const sourceIndexStr = e.dataTransfer.getData("sectionIndex");
    if (!sourceIndexStr) return; // Dropping a lesson instead of a section

    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (sourceIndex === targetIndex) return;

    const list = [...sections];
    const [dragged] = list.splice(sourceIndex, 1);
    list.splice(targetIndex, 0, dragged);

    // Optimistically update UI
    const updatedList = list.map((sec, idx) => ({ ...sec, sortOrder: idx }));
    setSections(updatedList);

    // Save to DB
    try {
      await fetch("/api/sections/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          list: updatedList.map((sec) => ({ id: sec.id, sortOrder: sec.sortOrder })),
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Reorder Lessons within a Section
  const handleLessonDragStart = (e: React.DragEvent, sectionId: string, lessonIndex: number) => {
    e.dataTransfer.setData("sourceSectionId", sectionId);
    e.dataTransfer.setData("lessonIndex", lessonIndex.toString());
  };

  const handleLessonDrop = async (e: React.DragEvent, targetSectionId: string, targetIndex: number) => {
    const sourceSectionId = e.dataTransfer.getData("sourceSectionId");
    const sourceIndexStr = e.dataTransfer.getData("lessonIndex");

    if (!sourceSectionId || !sourceIndexStr) return;
    if (sourceSectionId !== targetSectionId) {
      alert("Moving lessons between sections is not implemented yet. Keep sorting within the same section.");
      return;
    }

    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (sourceIndex === targetIndex) return;

    const section = sections.find((sec) => sec.id === targetSectionId);
    if (!section) return;

    const lessonList = [...section.lessons];
    const [dragged] = lessonList.splice(sourceIndex, 1);
    lessonList.splice(targetIndex, 0, dragged);

    // Optimistically update UI
    const updatedLessons = lessonList.map((les, idx) => ({ ...les, sortOrder: idx }));
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === targetSectionId ? { ...sec, lessons: updatedLessons } : sec
      )
    );

    // Save to DB
    try {
      await fetch("/api/lessons/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          list: updatedLessons.map((les) => ({ id: les.id, sortOrder: les.sortOrder })),
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <Video className="h-4 w-4 text-purple-500" />;
      case "TEXT": return <FileText className="h-4 w-4 text-blue-500" />;
      case "QUIZ": return <HelpCircle className="h-4 w-4 text-emerald-500" />;
      case "LIVE_CLASS": return <Calendar className="h-4 w-4 text-orange-500" />;
      default: return <File className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* List Sections */}
      <div className="space-y-4">
        {sections.map((section, secIdx) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleSectionDragStart(e, secIdx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleSectionDrop(e, secIdx)}
            className="border border-border bg-card rounded-lg overflow-hidden shadow-sm"
          >
            {/* Section Header */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-3 flex-1">
                <div className="cursor-grab hover:text-foreground text-slate-400 transition-colors">
                  <GripVertical className="h-5 w-5" />
                </div>

                {editingSectionId === section.id ? (
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="text"
                      value={editingSectionTitle}
                      onChange={(e) => setEditingSectionTitle(e.target.value)}
                      className="w-full bg-background border border-input rounded px-3 py-1.5 text-sm"
                    />
                    <button
                      onClick={() => handleSaveSectionTitle(section.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingSectionId(null)}
                      className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-foreground p-1.5 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="font-bold text-foreground text-base">{section.title}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingSectionId(section.id);
                    setEditingSectionTitle(section.title);
                  }}
                  className="hover:text-primary text-muted-foreground p-1.5 rounded transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="hover:text-destructive text-muted-foreground p-1.5 rounded transition-colors"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Section Lessons */}
            <div className="p-4 space-y-2 bg-background">
              {section.lessons.map((lesson, lesIdx) => (
                <div
                  key={lesson.id}
                  draggable
                  onDragStart={(e) => handleLessonDragStart(e, section.id, lesIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleLessonDrop(e, section.id, lesIdx)}
                  className="flex items-center justify-between border border-border p-3 rounded-md hover:border-slate-300 dark:hover:border-slate-700 bg-card/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab text-slate-400 group-hover:text-foreground transition-colors">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    {getLessonIcon(lesson.type)}
                    <span className="text-sm font-medium text-foreground">{lesson.title}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                      {lesson.type}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="hover:text-destructive text-muted-foreground p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {section.lessons.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-md">
                  No lessons in this section yet. Add some below!
                </p>
              )}

              {/* Add Lesson Form Toggle */}
              {addingLessonSectionId === section.id ? (
                <div className="border border-border p-3 rounded-md mt-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/20">
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Enter lesson title..."
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="flex-1 bg-background border border-input rounded px-3 py-1.5 text-sm"
                    />
                    <select
                      value={newLessonType}
                      onChange={(e) => setNewLessonType(e.target.value)}
                      className="bg-background border border-input rounded px-3 py-1.5 text-sm cursor-pointer focus:ring-0"
                    >
                      <option value="VIDEO">Video Lecture</option>
                      <option value="TEXT">Reading Article</option>
                      <option value="DOWNLOAD">Resource Download</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAddingLessonSectionId(null)}
                      className="border border-border text-foreground hover:bg-muted text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddLesson(section.id)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                    >
                      Add Lesson
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingLessonSectionId(section.id)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold mt-4"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Lesson
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Section Form Toggle */}
      {isAddingSection ? (
        <div className="border border-border p-4 rounded-lg bg-card shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-foreground">Add New Section</h3>
          <input
            type="text"
            placeholder="E.g., Getting Started with Lernexa..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleAddSection()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-4 py-2 rounded transition-colors"
            >
              Add Section
            </button>
            <button
              onClick={() => setIsAddingSection(false)}
              className="border border-border hover:bg-muted text-foreground text-sm font-semibold px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingSection(true)}
          className="flex items-center gap-2 border border-dashed border-primary/40 hover:border-primary text-primary bg-primary/5 hover:bg-primary/10 transition-colors w-full p-4 rounded-lg font-semibold text-sm justify-center"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>
      )}
    </div>
  );
}
