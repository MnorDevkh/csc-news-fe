/**
 * Structure page content document helpers.
 * Stored in the existing `content` text column as:
 * - v2: JSON object `{ schemaVersion: 2, sections: PageSection[] }`
 * - legacy: JSON array of `{ type: 'text'|'image'|'text_image', ... }`
 * - older: raw HTML string
 */

export const SCHEMA_VERSION = 2;

const LAYOUT_TYPES = new Set(['container', 'row', 'column']);

function newId(prefix = 'block') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyDocument() {
  return {
    schemaVersion: SCHEMA_VERSION,
    sections: [],
  };
}

function isV2Document(value) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Number(value.schemaVersion) === SCHEMA_VERSION &&
    Array.isArray(value.sections)
  );
}

function convertLegacyText(block) {
  return {
    id: newId('rich-text'),
    type: 'rich-text',
    config: {
      html: block.html != null ? String(block.html) : '',
      align: 'left',
    },
  };
}

function convertLegacyImage(block) {
  const columnsRaw = block.columns;
  const columns =
    typeof columnsRaw === 'number' && Number.isFinite(columnsRaw)
      ? Math.min(4, Math.max(2, Math.trunc(columnsRaw)))
      : 3;
  const images = Array.isArray(block.images)
    ? block.images.map((img) => ({
        src: img?.url || '',
        alt: img?.title ? String(img.title).replace(/<[^>]*>/g, '').trim() : '',
        caption: img?.title != null ? String(img.title) : '',
      }))
    : [];
  return {
    id: newId('gallery'),
    type: 'gallery',
    config: {
      title: '',
      columns,
      images,
      animation: 'fade-in',
    },
  };
}

function convertLegacyTextImage(block) {
  const layout = block.layout === 'left' || block.layout === 'right' ? block.layout : 'left';
  return {
    id: newId('image-text'),
    type: 'image-text',
    config: {
      title: '',
      content: '',
      html: block.html != null ? String(block.html) : '',
      image: block.image?.url || '',
      imageAlt: block.caption ? String(block.caption).replace(/<[^>]*>/g, '').trim() : '',
      imagePosition: layout === 'right' ? 'right' : 'left',
      caption: block.caption != null ? String(block.caption) : '',
      animation: 'slide-up',
    },
  };
}

function convertLegacyArray(arr) {
  return arr.map((block) => {
    if (!block || typeof block !== 'object') {
      return { id: newId('rich-text'), type: 'rich-text', config: { html: '' } };
    }
    if (block.type === 'text') return convertLegacyText(block);
    if (block.type === 'image') return convertLegacyImage(block);
    if (block.type === 'text_image') return convertLegacyTextImage(block);
    return convertLegacyText({ html: '' });
  });
}

/**
 * Parse stored content into a mutable v2 document for the editor/renderer.
 * @returns {{ schemaVersion: number, sections: Array, source: 'v2'|'legacy-blocks'|'legacy-html'|'empty' }}
 */
export function parseContentDocument(contentStr) {
  if (contentStr == null || !String(contentStr).trim()) {
    return { ...createEmptyDocument(), source: 'empty' };
  }

  const raw = String(contentStr).trim();

  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const obj = JSON.parse(raw);
      if (isV2Document(obj)) {
        return {
          schemaVersion: SCHEMA_VERSION,
          sections: normalizeSections(obj.sections),
          source: 'v2',
        };
      }
    } catch {
      /* fall through */
    }
  }

  if (raw.startsWith('[') && raw.endsWith(']')) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return {
          schemaVersion: SCHEMA_VERSION,
          sections: convertLegacyArray(arr),
          source: 'legacy-blocks',
        };
      }
    } catch {
      /* fall through */
    }
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    sections: [
      {
        id: newId('rich-text'),
        type: 'rich-text',
        config: { html: raw, align: 'left' },
      },
    ],
    source: 'legacy-html',
  };
}

function normalizeSection(section) {
  if (!section || typeof section !== 'object') return null;
  const type = String(section.type || '').trim();
  if (!type) return null;
  const next = {
    id: section.id || newId(type),
    type,
    config: section.config && typeof section.config === 'object' ? { ...section.config } : {},
  };
  if (LAYOUT_TYPES.has(type) || Array.isArray(section.children)) {
    next.children = normalizeSections(section.children || []);
  }
  return next;
}

export function normalizeSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.map(normalizeSection).filter(Boolean);
}

/**
 * Serialize editor sections to the stored content string (v2 document).
 */
export function serializeContentDocument(sections) {
  const doc = {
    schemaVersion: SCHEMA_VERSION,
    sections: sanitizeSectionsForSave(sections || []),
  };
  return JSON.stringify(doc);
}

function sanitizeSectionsForSave(sections) {
  return (sections || []).map((section) => {
    const out = {
      id: section.id || newId(section.type || 'block'),
      type: section.type,
      config: section.config && typeof section.config === 'object' ? { ...section.config } : {},
    };
    if (Array.isArray(section.children) && section.children.length) {
      out.children = sanitizeSectionsForSave(section.children);
    } else if (LAYOUT_TYPES.has(section.type)) {
      out.children = sanitizeSectionsForSave(section.children || []);
    }
    return out;
  });
}

export function cloneDocument(doc) {
  return JSON.parse(JSON.stringify(doc));
}

export function isBuilderDocument(contentStr) {
  if (!contentStr || !String(contentStr).trim()) return false;
  const raw = String(contentStr).trim();
  if (!raw.startsWith('{')) return false;
  try {
    return isV2Document(JSON.parse(raw));
  } catch {
    return false;
  }
}
