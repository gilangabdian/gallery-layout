"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { GalleryExtension } from "tiptap-extension-gallery-layout";
import { useState, useRef } from "react";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, ImagePlus, Save, Edit3 } from "lucide-react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ElementType;
  label: string;
}

const ToolbarButton = ({ onClick, isActive, icon: Icon, label }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-2 rounded transition-colors ${
      isActive ? "bg-neutral-700 text-white" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
    }`}>
    <Icon size={18} />
  </button>
);

export default function TiptapEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Underline, 
      GalleryExtension.configure({
        onUpload: async (files: File[]) => {
          // Fake upload delay for demo purposes
          await new Promise(resolve => setTimeout(resolve, 800));
          // Use ObjectURLs which are much lighter than Base64 (perfect for Playground)
          return files.map(file => URL.createObjectURL(file));
        }
      })
    ],
    content: `
      <h2>First time in Japan</h2>
      <p>Hi! I just got back from a vacation in Japan🎌. It was my first time there, and I was so happy to finally visit; I spent a lot of time exploring various beautiful spots. Of course, I made sure to capture the moments in photos. Here is a collection of my photos from visiting various places in Japan (I'm actually a bit embarrassed to share them with you because many of my photos are bad😔):</p>
      
      <div data-type="gallery-layout" data-layout="grid" data-size="small" data-aspect-ratio="1/1" data-captions="true" data-lightbox="true" data-images='[{"src":"/_next/image?url=%2Fphotos%2Fbambo.jpg&w=1200&q=75","alt":"Bamboo Forest","title":"Bamboo Forest, Arashiyama"},{"src":"/_next/image?url=%2Fphotos%2Fdotonbori.jpg&w=1200&q=75","alt":"Dotonbori at Night","title":"Dotonbori at Night, Osaka"},{"src":"/_next/image?url=%2Fphotos%2Fgirl-with-umbrella.jpg&w=1200&q=75","alt":"Rainy Stroll","title":"Rainy Stroll in Japan"},{"src":"/_next/image?url=%2Fphotos%2Fkiyomizu-dera.jpg&w=1200&q=75","alt":"Kiyomizu-dera Temple","title":"Kiyomizu-dera Temple, Kyoto"},{"src":"/_next/image?url=%2Fphotos%2Fmasaki-kimoro.jpg&w=1200&q=75","alt":"Masaki Kimoro Street","title":"Masaki Kimoro Street View"},{"src":"/_next/image?url=%2Fphotos%2Fmount-fuji.jpg&w=1200&q=75","alt":"Mount Fuji","title":"Majestic Mount Fuji"},{"src":"/_next/image?url=%2Fphotos%2Fnara-park.jpg&w=1200&q=75","alt":"Nara Park Deer","title":"Friendly Deer at Nara Park"},{"src":"/_next/image?url=%2Fphotos%2Fnight-vibes-japan.jpg&w=1200&q=75","alt":"Tokyo Night Vibes","title":"Tokyo Night Vibes"},{"src":"/_next/image?url=%2Fphotos%2Fsensoji-temple.jpg&w=1200&q=75","alt":"Senso-ji Temple","title":"Senso-ji Temple, Asakusa"},{"src":"/_next/image?url=%2Fphotos%2Fshibuya.jpg&w=1200&q=75","alt":"Shibuya Crossing","title":"Shibuya Crossing"},{"src":"/_next/image?url=%2Fphotos%2Fshinjuku.jpg&w=1200&q=75","alt":"Neon Lights of Shinjuku","title":"Neon Lights of Shinjuku"},{"src":"/_next/image?url=%2Fphotos%2Funiversal-studio-japan.jpg&w=1200&q=75","alt":"Universal Studios Japan","title":"Universal Studios Japan (USJ)"}]'></div>

      <p>That’s probably all I wanted to share. I hope you like the photo I’ve included here.</p>
      <p>Thank you!</p>
    `,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[300px]",
      },
    },
    immediatelyRender: false,
    editable: false,
  });

  // Effect to sync editable state
  if (editor && editor.isEditable !== isEditing) {
    editor.setEditable(isEditing);
  }

  if (!editor) {
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const images = Array.from(files).map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name,
      title: file.name.split(".")[0], // Use filename as default title
    }));

    editor.chain().focus().insertGallery(images).updateAttributes("gallery", { captions: true }).run();

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Editor Frame */}
      <div
        className={`w-full rounded-xl transition-all duration-300 ${
          isEditing ? "border border-neutral-800 bg-neutral-900/50" : "border border-transparent bg-transparent"
        }`}>
        {/* Toolbar (Only visible when editing) */}
        {isEditing && (
          <div className="flex flex-wrap items-center gap-1 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm p-2 sticky top-[72px] z-40 rounded-t-xl">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={Bold}
              label="Bold"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={Italic}
              label="Italic"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              icon={UnderlineIcon}
              label="Underline"
            />

            <div className="w-[1px] h-6 bg-neutral-800 mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive("heading", { level: 1 })}
              icon={Heading1}
              label="Heading 1"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              icon={Heading2}
              label="Heading 2"
            />

            <div className="w-[1px] h-6 bg-neutral-800 mx-1" />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 ml-1 bg-white hover:bg-neutral-200 text-black text-sm font-medium rounded transition-colors">
              <ImagePlus size={16} />
              Add Gallery
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* The Editor Area */}
        <div className={`w-full ${isEditing ? "p-6" : "p-0 py-4"}`}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Action Toggle Button */}
      <div className="mt-8 flex justify-end">
        {isEditing ? (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-blue-900/20">
            <Save size={18} />
            Save Blog
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-full font-medium transition-colors">
            <Edit3 size={18} />
            Edit Blog
          </button>
        )}
      </div>
    </div>
  );
}
