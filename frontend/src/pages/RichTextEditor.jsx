
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { marked } from "marked";
import TurndownService from "turndown";

const turndownService = new TurndownService();

function RichTextEditor({ value = "", onChange }) {
  const [mode, setMode] = useState("rich");
  const [markdown, setMarkdown] = useState("");

  const editor = useEditor({
    extensions: [
  StarterKit,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      setMarkdown(turndownService.turndown(html));
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (mode === "rich" && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }

    setMarkdown(
      value
        ? turndownService.turndown(value)
        : ""
    );
  }, [editor, value, mode]);

  function switchMode(nextMode) {
    if (!editor || mode === nextMode) return;

    if (nextMode === "markdown") {
      const html = editor.getHTML();
      setMarkdown(turndownService.turndown(html));
      setMode("markdown");
      return;
    }

    const html = marked.parse(markdown, { async: false });
    editor.commands.setContent(html);
    onChange?.(html);
    setMode("rich");
  }

  return (
    <div className="rich-text-editor">
      <div className="editor-mode-switch">
        <button
          type="button"
          onClick={() => switchMode("rich")}
          aria-pressed={mode === "rich"}
        >
          Rich Text
        </button>

        <button
          type="button"
          onClick={() => switchMode("markdown")}
          aria-pressed={mode === "markdown"}
        >
          Markdown
        </button>
      </div>

      {mode === "rich" ? (
        <div className="rich-editor-area">
          {editor && (
            <div className="rich-editor-toolbar">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                aria-pressed={editor.isActive("bold")}
              >
                Bold
              </button>

              
<button
  type="button"
  onClick={() => editor.chain().focus().toggleStrike().run()}
  aria-pressed={editor.isActive("strike")}
>
  Strikethrough
</button>

<button
  type="button"
  onClick={() =>
    editor.chain().focus().unsetAllMarks().clearNodes().run()
  }
>
  Clear Formatting
</button>

<button
  type="button"
  onClick={() =>
    editor.chain().focus().toggleHeading({ level: 1 }).run()
  }
  aria-pressed={editor.isActive("heading", { level: 1 })}
>
  H1
</button>

<button
  type="button"
  onClick={() =>
    editor.chain().focus().toggleHeading({ level: 3 }).run()
  }
  aria-pressed={editor.isActive("heading", { level: 3 })}
>
  H3
</button>


              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                aria-pressed={editor.isActive("italic")}
              >
                Italic
              </button>

              
<button
  type="button"
  onClick={() => {
    const url = window.prompt("Enter the link URL (https://...)");

    if (url && /^https?:\/\//i.test(url.trim())) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url.trim() })
        .run();
    } else if (url) {
      window.alert("Please enter a valid URL starting with http:// or https://");
    }
  }}
  disabled={!editor}
>
  Link
</button>


              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                aria-pressed={editor.isActive("heading", { level: 2 })}
              >
                H2
              </button>

              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                aria-pressed={editor.isActive("bulletList")}
              >
                Bullet List
              </button>

              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                aria-pressed={editor.isActive("orderedList")}
              >
                Numbered List
              </button>
            </div>
          )}

          <EditorContent editor={editor} />
        </div>
      ) : (
        <textarea
  className="markdown-editor"
  value={markdown}
  onChange={(event) => {
    const nextMarkdown = event.target.value;
    setMarkdown(nextMarkdown);

    const html = marked.parse(nextMarkdown, { async: false });
    onChange?.(html);
  }}
  placeholder="Write using Markdown..."
  rows={12}
  aria-label="Markdown editor"
/>
      )}
    </div>
  );
}

export default RichTextEditor;
