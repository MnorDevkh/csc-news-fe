const alignOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const animationOptions = [
  { label: 'Fade in', value: 'fade-in' },
  { label: 'Slide up', value: 'slide-up' },
  { label: 'Slide left', value: 'slide-left' },
  { label: 'Slide right', value: 'slide-right' },
  { label: 'None', value: 'none' },
];

const animationField = {
  key: 'animation',
  label: 'Animation',
  type: 'select',
  options: animationOptions,
};

/** Fields that open the image library picker (URL still editable). */
export const MEDIA_FIELD_KEYS = new Set([
  'image',
  'src',
  'poster',
]);

export const blockCatalog = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Large banner with title and call to action',
    icon: '✦',
    category: 'content',
    defaults: {
      title: 'Welcome',
      subtitle: 'Add a short introduction.',
      align: 'center',
      overlay: true,
      animation: 'fade-in',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'image', label: 'Background image', type: 'media' },
      { key: 'imageAlt', label: 'Image description', type: 'text' },
      { key: 'buttonText', label: 'Button text', type: 'text' },
      { key: 'buttonLink', label: 'Button link', type: 'text' },
      { key: 'align', label: 'Alignment', type: 'select', options: alignOptions },
      { key: 'overlay', label: 'Dark image overlay', type: 'toggle' },
      { key: 'minHeight', label: 'Minimum height', type: 'text', placeholder: '420px' },
      animationField,
    ],
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Heading and plain paragraph content',
    icon: 'T',
    category: 'content',
    defaults: {
      title: 'Section title',
      content: 'Write your content here.',
      align: 'left',
      animation: 'fade-in',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'align', label: 'Alignment', type: 'select', options: alignOptions },
      animationField,
    ],
  },
  {
    type: 'rich-text',
    label: 'Rich text',
    description: 'Formatted HTML content (CKEditor)',
    icon: '¶',
    category: 'content',
    defaults: {
      html: '<p>Write your content here.</p>',
      align: 'left',
      animation: 'fade-in',
    },
    fields: [
      { key: 'html', label: 'Content', type: 'richtext' },
      { key: 'align', label: 'Alignment', type: 'select', options: alignOptions },
      animationField,
    ],
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Responsive image with caption',
    icon: '▧',
    category: 'media',
    defaults: {
      src: '',
      alt: 'Page image',
      rounded: true,
      objectFit: 'cover',
      animation: 'fade-in',
    },
    fields: [
      { key: 'src', label: 'Image', type: 'media' },
      { key: 'alt', label: 'Image description', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'text' },
      { key: 'rounded', label: 'Rounded corners', type: 'toggle' },
      {
        key: 'objectFit',
        label: 'Image fit',
        type: 'select',
        options: [
          { label: 'Fit container (crop)', value: 'cover' },
          { label: 'Fit image size', value: 'natural' },
          { label: 'Fit contain (scale)', value: 'contain' },
        ],
      },
      animationField,
    ],
  },
  {
    type: 'image-text',
    label: 'Image + Text',
    description: 'Two-column image and copy',
    icon: '◫',
    category: 'content',
    defaults: {
      title: 'Section title',
      content: 'Describe this section.',
      html: '',
      image: '',
      imagePosition: 'left',
      objectFit: 'cover',
      animation: 'slide-up',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'html', label: 'Rich content (optional)', type: 'richtext' },
      { key: 'image', label: 'Image', type: 'media' },
      { key: 'imageAlt', label: 'Image description', type: 'text' },
      {
        key: 'imagePosition',
        label: 'Image position',
        type: 'select',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
        ],
      },
      {
        key: 'objectFit',
        label: 'Image fit',
        type: 'select',
        options: [
          { label: 'Fit container (crop)', value: 'cover' },
          { label: 'Fit image size', value: 'natural' },
          { label: 'Fit contain (scale)', value: 'contain' },
        ],
      },
      { key: 'buttonText', label: 'Button text', type: 'text' },
      { key: 'buttonLink', label: 'Button link', type: 'text' },
      animationField,
    ],
  },
  {
    type: 'gallery',
    label: 'Gallery',
    description: 'Responsive collection of images',
    icon: '▥',
    category: 'media',
    defaults: {
      title: 'Image gallery',
      columns: 3,
      images: [],
      animation: 'fade-in',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      {
        key: 'columns',
        label: 'Columns',
        type: 'select',
        options: [
          { label: '2 columns', value: 2 },
          { label: '3 columns', value: 3 },
          { label: '4 columns', value: 4 },
        ],
      },
      animationField,
    ],
  },
  {
    type: 'card-grid',
    label: 'Card Grid',
    description: 'Grid of feature or product cards',
    icon: '▦',
    category: 'content',
    defaults: {
      title: 'Featured items',
      subtitle: 'Add cards from the card editor below.',
      columns: 3,
      cards: [
        { title: 'First card', description: 'Describe this card.', image: '', link: '' },
        { title: 'Second card', description: 'Describe this card.', image: '', link: '' },
        { title: 'Third card', description: 'Describe this card.', image: '', link: '' },
      ],
      animation: 'fade-in',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      {
        key: 'columns',
        label: 'Columns',
        type: 'select',
        options: [
          { label: '2 columns', value: 2 },
          { label: '3 columns', value: 3 },
          { label: '4 columns', value: 4 },
        ],
      },
      animationField,
    ],
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Questions and answers accordion',
    icon: '?',
    category: 'interactive',
    defaults: {
      title: 'Frequently asked questions',
      items: [
        { question: 'Add a question', answer: 'Add the answer here.' },
        { question: 'Add another question', answer: 'Add the answer here.' },
      ],
      animation: 'fade-in',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      animationField,
    ],
  },
  {
    type: 'accordion',
    label: 'Accordion',
    description: 'Expandable content panels',
    icon: '☰',
    category: 'interactive',
    defaults: {
      title: 'More information',
      allowMultiple: false,
      items: [
        { title: 'First item', content: 'Add content here.' },
        { title: 'Second item', content: 'Add content here.' },
      ],
      animation: 'fade-in',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'allowMultiple', label: 'Allow multiple open', type: 'toggle' },
      animationField,
    ],
  },
  {
    type: 'video',
    label: 'Video',
    description: 'YouTube or hosted video',
    icon: '▶',
    category: 'media',
    defaults: {
      title: 'Watch the video',
      src: '',
      controls: true,
      animation: 'fade-in',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'src', label: 'Video URL', type: 'url' },
      { key: 'poster', label: 'Poster image', type: 'media' },
      { key: 'controls', label: 'Show controls', type: 'toggle' },
      { key: 'autoplay', label: 'Autoplay', type: 'toggle' },
      { key: 'loop', label: 'Loop', type: 'toggle' },
      animationField,
    ],
  },
  {
    type: 'contact',
    label: 'Contact',
    description: 'Contact details and form',
    icon: '✉',
    category: 'interactive',
    defaults: {
      title: 'Get in touch',
      subtitle: 'Send us a message.',
      email: '',
      showForm: true,
      animation: 'fade-in',
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'showForm', label: 'Show contact form', type: 'toggle' },
      { key: 'submitText', label: 'Submit button text', type: 'text' },
      animationField,
    ],
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action button',
    icon: '↗',
    category: 'utility',
    defaults: { text: 'Learn more', link: '/', variant: 'primary', align: 'center' },
    fields: [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'link', label: 'Link', type: 'text' },
      {
        key: 'variant',
        label: 'Style',
        type: 'select',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
        ],
      },
      { key: 'align', label: 'Alignment', type: 'select', options: alignOptions },
      { key: 'openInNewTab', label: 'Open in new tab', type: 'toggle' },
    ],
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Horizontal separator',
    icon: '―',
    category: 'utility',
    defaults: { style: 'solid', width: '100%' },
    fields: [
      {
        key: 'style',
        label: 'Line style',
        type: 'select',
        options: [
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
        ],
      },
      { key: 'width', label: 'Width', type: 'text', placeholder: '100%' },
      { key: 'thickness', label: 'Thickness', type: 'text', placeholder: '1px' },
      { key: 'color', label: 'Color', type: 'color' },
    ],
  },
  {
    type: 'spacer',
    label: 'Spacer',
    description: 'Vertical empty space',
    icon: '↕',
    category: 'utility',
    defaults: { height: '3rem', heightMobile: '2rem' },
    fields: [
      { key: 'height', label: 'Desktop height', type: 'text', placeholder: '3rem' },
      { key: 'heightMobile', label: 'Mobile height', type: 'text', placeholder: '2rem' },
    ],
  },
];

export function getBlockDefinition(type) {
  return blockCatalog.find((block) => block.type === type);
}

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createBlock(type) {
  const definition = getBlockDefinition(type);
  return {
    id: newId(type),
    type,
    config: structuredClone(definition?.defaults ?? {}),
  };
}

export function createLayout(columns) {
  const cols = columns === 1 || columns === 2 || columns === 3 ? columns : 1;
  return {
    id: newId('container'),
    type: 'container',
    config: { maxWidth: 'xl', padding: '2rem 0' },
    children: [
      {
        id: newId('row'),
        type: 'row',
        config: { gap: '1.5rem', align: 'stretch' },
        children: Array.from({ length: cols }, () => ({
          id: newId('column'),
          type: 'column',
          config: { span: 12 / cols },
          children: [],
        })),
      },
    ],
  };
}

export const ALLOWED_SECTION_TYPES = [
  ...blockCatalog.map((b) => b.type),
  'container',
  'row',
  'column',
];
