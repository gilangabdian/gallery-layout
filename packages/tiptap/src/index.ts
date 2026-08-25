import { Node, mergeAttributes } from "@tiptap/core";
import { createGallery, type GalleryOptions, type GalleryImage } from "gallery-layout";

export interface GalleryExtensionOptions {
  defaultLayout: "scroll" | "grid";
  defaultSize: "small" | "medium" | "large";
  defaultGap?: string;
  defaultRadius?: string;
  defaultCaptionSize?: string;
  defaultAspectRatio?: string;
  defaultLightbox?: boolean;
  defaultCaptions?: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    galleryLayout: {
      insertGallery: (images: GalleryImage[]) => ReturnType;
      setGalleryLayout: (layout: "scroll" | "grid") => ReturnType;
      setGallerySize: (size: "small" | "medium" | "large") => ReturnType;
    };
  }
}

export const GalleryExtension = Node.create<GalleryExtensionOptions>({
  name: "galleryLayout",
  group: "block",
  atom: true, // It is an atom block because it's managed by gallery-layout internally

  addOptions() {
    return {
      defaultLayout: "scroll",
      defaultSize: "medium",
      defaultAlign: "left",
      defaultGap: "16px",
      defaultRadius: "4px",
      defaultCaptionSize: "14px",
      defaultAspectRatio: "auto",
      defaultLightbox: false,
      defaultCaptions: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (element) => JSON.parse(element.getAttribute("data-images") || "[]"),
        renderHTML: (attributes) => {
          return { "data-images": JSON.stringify(attributes.images) };
        },
      },
      layout: {
        default: this.options.defaultLayout,
        parseHTML: (element) => element.getAttribute("data-layout"),
        renderHTML: (attributes) => {
          return { "data-layout": attributes.layout };
        },
      },
      size: {
        default: this.options.defaultSize,
        parseHTML: (element) => element.getAttribute("data-size"),
        renderHTML: (attributes) => {
          return { "data-size": attributes.size };
        },
      },
      captions: {
        default: this.options.defaultCaptions,
        parseHTML: (element) => element.getAttribute("data-captions") === "true",
        renderHTML: (attributes) =>
          attributes.captions !== undefined ? { "data-captions": String(attributes.captions) } : {},
      },
      captionPosition: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-caption-position"),
        renderHTML: (attributes) =>
          attributes.captionPosition ? { "data-caption-position": attributes.captionPosition } : {},
      },
      captionSize: {
        default: this.options.defaultCaptionSize,
        parseHTML: (element) => element.getAttribute("data-caption-size"),
        renderHTML: (attributes) => {
          if (attributes.captionSize === this.options.defaultCaptionSize) return {};
          return attributes.captionSize ? { "data-caption-size": attributes.captionSize } : {};
        },
      },
      pointer: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-pointer") === "true",
        renderHTML: (attributes) =>
          attributes.pointer !== undefined ? { "data-pointer": String(attributes.pointer) } : {},
      },
      lightbox: {
        default: this.options.defaultLightbox,
        parseHTML: (element) => element.getAttribute("data-lightbox") === "true",
        renderHTML: (attributes) =>
          attributes.lightbox !== undefined ? { "data-lightbox": String(attributes.lightbox) } : {},
      },
      gap: {
        default: this.options.defaultGap,
        parseHTML: (element) => element.getAttribute("data-gap"),
        renderHTML: (attributes) => {
          if (attributes.gap === this.options.defaultGap) return {};
          return attributes.gap ? { "data-gap": attributes.gap } : {};
        },
      },
      radius: {
        default: this.options.defaultRadius,
        parseHTML: (element) => element.getAttribute("data-radius"),
        renderHTML: (attributes) => {
          if (attributes.radius === this.options.defaultRadius) return {};
          return attributes.radius ? { "data-radius": attributes.radius } : {};
        },
      },
      aspectRatio: {
        default: this.options.defaultAspectRatio,
        parseHTML: (element) => element.getAttribute("data-aspect-ratio"),
        renderHTML: (attributes) => {
          if (attributes.aspectRatio === this.options.defaultAspectRatio) return {};
          return attributes.aspectRatio ? { "data-aspect-ratio": attributes.aspectRatio } : {};
        },
      },
      columns: {
        default: undefined,
        parseHTML: (element) =>
          element.getAttribute("data-columns") ? parseInt(element.getAttribute("data-columns")!) : undefined,
        renderHTML: (attributes) =>
          attributes.columns !== undefined ? { "data-columns": String(attributes.columns) } : {},
      },
      snap: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-snap") === "true",
        renderHTML: (attributes) => (attributes.snap !== undefined ? { "data-snap": String(attributes.snap) } : {}),
      },
      align: {
        default: "left",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderHTML: (attributes) => (attributes.align ? { "data-align": attributes.align } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="gallery-layout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { "data-type": "gallery-layout" })];
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const container = document.createElement("div");
      container.classList.add("tiptap-gallery-nodeview");
      container.style.position = "relative";

      const galleryWrapper = document.createElement("div");
      container.appendChild(galleryWrapper);

      let syncDOM: ((attrs: Record<string, any>) => void) | null = null;
      let toolbarWrapper: HTMLDivElement | null = null;

      if (editor.isEditable) {
        // Inject styles for the toolbar and settings panel
        const style = document.createElement("style");
        style.innerHTML = `
          .tiptap-gallery-nodeview .gallery-toolbar-wrapper {
            position: absolute;
            top: 12px; right: 12px;
            z-index: 50;
            display: none;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
          }
          .ProseMirror-selectednode .gallery-toolbar-wrapper {
            display: flex;
          }
          .gallery-toolbar-main, .gallery-settings-panel {
            background: rgba(20, 20, 20, 0.85);
            padding: 6px;
            border-radius: 8px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          }
          .gallery-toolbar-main {
            display: flex;
            gap: 4px;
            align-items: center;
          }
          .gallery-toolbar-btn {
            background: transparent;
            color: rgba(255, 255, 255, 0.7);
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 12px;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s;
          }
          .gallery-toolbar-btn:hover { background: rgba(255, 255, 255, 0.1); color: white; }
          .gallery-toolbar-btn.active { background: white; color: black; font-weight: 500; }
          .gallery-toolbar-divider { width: 1px; height: 16px; background: rgba(255, 255, 255, 0.2); margin: 0 4px; }

          .gallery-settings-panel {
            display: none; /* hidden by default */
            width: 280px;
            padding: 12px;
            flex-direction: column;
            gap: 12px;
            font-size: 12px;
            color: #ddd;
            font-family: inherit;
          }
          .gallery-settings-panel.open {
            display: flex;
          }
          .settings-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
          }
          .settings-label { flex: 1; }
          .settings-input, .settings-select {
            width: 160px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            border-radius: 4px;
            padding: 4px 6px;
            font-size: 12px;
            outline: none;
          }
          .settings-input:focus, .settings-select:focus { border-color: rgba(255, 255, 255, 0.5); }
          .settings-checkbox { cursor: pointer; }
        `;
        container.appendChild(style);

        toolbarWrapper = document.createElement("div");
        toolbarWrapper.className = "gallery-toolbar-wrapper";
        container.appendChild(toolbarWrapper);

        // Main Toolbar
        const mainToolbar = document.createElement("div");
        mainToolbar.className = "gallery-toolbar-main";
        toolbarWrapper.appendChild(mainToolbar);

        // Create main buttons
        const btnScroll = document.createElement("button");
        btnScroll.className = "gallery-toolbar-btn";
        btnScroll.textContent = "Scroll";
        const btnGrid = document.createElement("button");
        btnGrid.className = "gallery-toolbar-btn";
        btnGrid.textContent = "Grid";
        const div1 = document.createElement("div");
        div1.className = "gallery-toolbar-divider";
        const btnXS = document.createElement("button");
        btnXS.className = "gallery-toolbar-btn";
        btnXS.textContent = "XS";
        const btnS = document.createElement("button");
        btnS.className = "gallery-toolbar-btn";
        btnS.textContent = "S";
        const btnM = document.createElement("button");
        btnM.className = "gallery-toolbar-btn";
        btnM.textContent = "M";
        const btnL = document.createElement("button");
        btnL.className = "gallery-toolbar-btn";
        btnL.textContent = "L";
        const btnXL = document.createElement("button");
        btnXL.className = "gallery-toolbar-btn";
        btnXL.textContent = "XL";
        const div2 = document.createElement("div");
        div2.className = "gallery-toolbar-divider";
        const btnSettings = document.createElement("button");
        btnSettings.className = "gallery-toolbar-btn";
        btnSettings.textContent = "⚙️";

        const sizeGroup = [div1, btnXS, btnS, btnM, btnL, btnXL, div2];
        mainToolbar.append(btnScroll, btnGrid, ...sizeGroup, btnSettings);

        // Settings Panel
        const settingsPanel = document.createElement("div");
        settingsPanel.className = "gallery-settings-panel";
        toolbarWrapper.appendChild(settingsPanel);

        // Toggle panel logic
        let isSettingsOpen = false;
        btnSettings.addEventListener("click", (e) => {
          e.preventDefault();
          isSettingsOpen = !isSettingsOpen;
          settingsPanel.classList.toggle("open", isSettingsOpen);
          btnSettings.classList.toggle("active", isSettingsOpen);
        });

        // Helper to create setting row
        const createSettingRow = (labelText: string, el: HTMLElement) => {
          const row = document.createElement("div");
          row.className = "settings-row";
          const label = document.createElement("div");
          label.className = "settings-label";
          label.textContent = labelText;
          row.append(label, el);
          return row;
        };

        // Settings Controls (Inputs)
        const inpGap = document.createElement("input");
        inpGap.className = "settings-input";
        inpGap.placeholder = "e.g. 16px";
        const inpRadius = document.createElement("input");
        inpRadius.className = "settings-input";
        inpRadius.placeholder = "e.g. 8px";
        const inpRatio = document.createElement("input");
        inpRatio.className = "settings-input";
        inpRatio.placeholder = "e.g. 1/1";
        const inpCustomWidth = document.createElement("input");
        inpCustomWidth.className = "settings-input";
        inpCustomWidth.placeholder = "e.g. 360px";
        const inpColumns = document.createElement("input");
        inpColumns.className = "settings-input";
        inpColumns.placeholder = "e.g. 3 (number only)";
        inpColumns.type = "number";
        const inpCaptionSize = document.createElement("input");
        inpCaptionSize.className = "settings-input";
        inpCaptionSize.placeholder = "e.g. 12px";

        // Captions Setup
        const chkCaptions = document.createElement("input");
        chkCaptions.type = "checkbox";
        chkCaptions.className = "settings-checkbox";

        // Align Setup
        const selAlign = document.createElement("select");
        selAlign.className = "settings-select";
        const alignOpts = [
          { v: "left", l: "Left" },
          { v: "center", l: "Center" },
          { v: "right", l: "Right" },
        ];
        alignOpts.forEach((o) => {
          const opt = document.createElement("option");
          opt.value = o.v;
          opt.textContent = o.l;
          selAlign.appendChild(opt);
        });

        // Pointer Setup
        const chkPointer = document.createElement("input");
        chkPointer.type = "checkbox";
        chkPointer.className = "settings-checkbox";
        const chkLightbox = document.createElement("input");
        chkLightbox.type = "checkbox";
        chkLightbox.className = "settings-checkbox";
        const chkSnap = document.createElement("input");
        chkSnap.type = "checkbox";
        chkSnap.className = "settings-checkbox";

        const selCaptionPos = document.createElement("select");
        selCaptionPos.className = "settings-select";

        const captionPositions = [
          { label: "Default (Bottom Center)", value: "" },
          { label: "Top Left", value: "top-left" },
          { label: "Top Center", value: "top-center" },
          { label: "Top Right", value: "top-right" },
          { label: "Bottom Left", value: "bottom-left" },
          { label: "Bottom Center", value: "bottom-center" },
          { label: "Bottom Right", value: "bottom-right" },
          { label: "Overlay Top Left", value: "overlay-top-left" },
          { label: "Overlay Top Center", value: "overlay-top-center" },
          { label: "Overlay Top Right", value: "overlay-top-right" },
          { label: "Overlay Bottom Left", value: "overlay-bottom-left" },
          { label: "Overlay Bottom Center", value: "overlay-bottom-center" },
          { label: "Overlay Bottom Right", value: "overlay-bottom-right" },
        ];
        captionPositions.forEach((p) => {
          const opt = document.createElement("option");
          opt.value = p.value;
          opt.textContent = p.label;
          selCaptionPos.appendChild(opt);
        });

        const rowCustomWidth = createSettingRow("Custom Width", inpCustomWidth);
        const rowAlign = createSettingRow("Align", selAlign);
        const rowColumns = createSettingRow("Columns", inpColumns);
        const rowSnap = createSettingRow("Scroll Snap", chkSnap);

        settingsPanel.append(
          rowCustomWidth,
          rowAlign,
          createSettingRow("Gap", inpGap),
          createSettingRow("Radius", inpRadius),
          createSettingRow("Aspect Ratio", inpRatio),
          rowColumns,
          rowSnap,
          createSettingRow("Captions (On/Off)", chkCaptions),
          createSettingRow("Caption Size", inpCaptionSize),
          createSettingRow("Caption Position", selCaptionPos),
          createSettingRow("Hover Pointer", chkPointer),
          createSettingRow("Enable Lightbox", chkLightbox),
        );

        // Event Listeners for State Updates
        const updateAttr = (key: string, value: any) => {
          if (typeof getPos === "function") {
            editor
              .chain()
              .updateAttributes(this.name, { [key]: value })
              .run();
          }
        };

        btnScroll.addEventListener("click", (e) => {
          e.preventDefault();
          updateAttr("layout", "scroll");
        });
        btnGrid.addEventListener("click", (e) => {
          e.preventDefault();
          updateAttr("layout", "grid");
        });
        btnXS.addEventListener("click", (e) => {
          e.preventDefault();
          updateAttr("size", "extra-small");
        });
        btnS.addEventListener("click", (e) => {
          e.preventDefault();
          updateAttr("size", "small");
        });
        btnM.addEventListener("click", (e) => {
          e.preventDefault();
          updateAttr("size", "medium");
        });
        btnL.addEventListener("click", (e) => {
          e.preventDefault();
          updateAttr("size", "large");
        });
        btnXL.addEventListener("click", (e) => {
          e.preventDefault();
          updateAttr("size", "extra-large");
        });

        let timeouts: Record<string, any> = {};
        const debounceUpdate = (key: string, val: any) => {
          clearTimeout(timeouts[key]);
          timeouts[key] = setTimeout(() => updateAttr(key, val), 400);
        };

        inpCustomWidth.addEventListener("input", () => debounceUpdate("size", inpCustomWidth.value || undefined));
        inpGap.addEventListener("input", () => debounceUpdate("gap", inpGap.value || undefined));
        inpRadius.addEventListener("input", () => debounceUpdate("radius", inpRadius.value || undefined));
        inpRatio.addEventListener("input", () => debounceUpdate("aspectRatio", inpRatio.value || undefined));
        inpColumns.addEventListener("input", () => {
          const parsed = parseInt(inpColumns.value);
          debounceUpdate("columns", isNaN(parsed) ? undefined : parsed);
        });
        inpCaptionSize.addEventListener("input", () =>
          debounceUpdate("captionSize", inpCaptionSize.value || undefined),
        );

        chkCaptions.addEventListener("change", () => updateAttr("captions", chkCaptions.checked));
        chkPointer.addEventListener("change", () => updateAttr("pointer", chkPointer.checked));
        chkLightbox.addEventListener("change", () => updateAttr("lightbox", chkLightbox.checked));
        chkSnap.addEventListener("change", () => updateAttr("snap", chkSnap.checked));
        selCaptionPos.addEventListener("change", () => updateAttr("captionPosition", selCaptionPos.value || undefined));
        selAlign.addEventListener("change", () => updateAttr("align", selAlign.value || undefined));

        // Sync Function: Tiptap Attrs -> DOM State
        syncDOM = (attrs: Record<string, any>) => {
          btnScroll.classList.toggle("active", attrs.layout === "scroll" || !attrs.layout);
          btnGrid.classList.toggle("active", attrs.layout === "grid");
          
          const currentSize = attrs.size || "medium";
          const isGrid = attrs.layout === "grid";

          btnXS.classList.toggle("active", currentSize === "extra-small");
          btnS.classList.toggle("active", currentSize === "small");
          btnM.classList.toggle("active", currentSize === "medium");
          btnL.classList.toggle("active", currentSize === "large");
          btnXL.classList.toggle("active", currentSize === "extra-large");

          // Dynamic UI toggling based on Layout
          const isCustomSize = !["extra-small", "small", "medium", "large", "extra-large"].includes(currentSize);
          rowAlign.style.display = (isGrid && isCustomSize) ? "flex" : "none";
          rowColumns.style.display = isGrid ? "flex" : "none";
          rowSnap.style.display = !isGrid ? "flex" : "none";

          // Placeholder logic for Custom Width
          const presets: Record<string, string> = {
            "extra-small": "e.g. 140px",
            "small": "e.g. 220px",
            "medium": "e.g. 360px",
            "large": "e.g. 520px",
            "extra-large": "e.g. 720px",
          };
          inpCustomWidth.placeholder = presets[currentSize] || "e.g. 360px";

          // Only update input values if they are NOT currently focused.
          if (document.activeElement !== inpCustomWidth) {
            inpCustomWidth.value = presets[currentSize] ? "" : currentSize;
          }
          if (document.activeElement !== inpGap) inpGap.value = attrs.gap || "";
          if (document.activeElement !== inpRadius) inpRadius.value = attrs.radius || "";
          if (document.activeElement !== inpRatio) inpRatio.value = attrs.aspectRatio || "";
          if (document.activeElement !== inpColumns) inpColumns.value = attrs.columns || "";
          if (document.activeElement !== inpCaptionSize) inpCaptionSize.value = attrs.captionSize || "";

          chkCaptions.checked = !!attrs.captions;
          chkPointer.checked = !!attrs.pointer;
          chkLightbox.checked = !!attrs.lightbox;
          chkSnap.checked = attrs.snap !== false; // snap is implicitly true by default in core

          if (document.activeElement !== selCaptionPos) {
            selCaptionPos.value = attrs.captionPosition || "";
          }
          if (document.activeElement !== selAlign) {
            selAlign.value = attrs.align || "left";
          }
        };

        syncDOM(node.attrs);
      }

      // Helper to render gallery
      const renderGallery = (attrs: Record<string, any>) => {
        galleryWrapper.innerHTML = "";
        const options: GalleryOptions = {
          images: attrs.images,
          layout: attrs.layout,
          size: attrs.size,
          lightbox: attrs.lightbox,
          pointer: attrs.pointer,
          gap: attrs.gap,
          radius: attrs.radius,
          aspectRatio: attrs.aspectRatio,
          captions: attrs.captions,
          captionPosition: attrs.captionPosition,
          captionSize: attrs.captionSize,
          columns: attrs.columns,
          snap: attrs.snap,
          align: attrs.align,
          lazyLoad: false, // MUST BE FALSE inside Tiptap to prevent the 0-height lazy-load rendering cancellation bug!
        };
        createGallery(galleryWrapper, options);
      };

      renderGallery(node.attrs);

      return {
        dom: container,
        // CRITICAL FIX: Prevent Tiptap from stealing focus when interacting with our Settings Panel
        stopEvent: (event) => {
          if (toolbarWrapper && toolbarWrapper.contains(event.target as HTMLElement)) {
            return true;
          }
          return false;
        },
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) {
            return false;
          }

          node = updatedNode;
          renderGallery(node.attrs);

          if (syncDOM) {
            syncDOM(node.attrs);
          }

          return true;
        },
      };
    };
  },

  addCommands() {
    return {
      insertGallery:
        (images: GalleryImage[]) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { images },
          });
        },
      setGalleryLayout:
        (layout: "scroll" | "grid") =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { layout });
        },
      setGallerySize:
        (size: "small" | "medium" | "large") =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { size });
        },
    };
  },
});
