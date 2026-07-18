import { defineAsyncComponent } from 'vue';

export const componentMap = {
  hero: defineAsyncComponent(() => import('../blocks/HeroBlock.vue')),
  text: defineAsyncComponent(() => import('../blocks/TextBlock.vue')),
  'rich-text': defineAsyncComponent(() => import('../blocks/RichTextBlock.vue')),
  image: defineAsyncComponent(() => import('../blocks/ImageBlock.vue')),
  'image-text': defineAsyncComponent(() => import('../blocks/ImageTextBlock.vue')),
  gallery: defineAsyncComponent(() => import('../blocks/GalleryBlock.vue')),
  'card-grid': defineAsyncComponent(() => import('../blocks/CardGridBlock.vue')),
  video: defineAsyncComponent(() => import('../blocks/VideoBlock.vue')),
  faq: defineAsyncComponent(() => import('../blocks/FAQBlock.vue')),
  accordion: defineAsyncComponent(() => import('../blocks/AccordionBlock.vue')),
  contact: defineAsyncComponent(() => import('../blocks/ContactBlock.vue')),
  button: defineAsyncComponent(() => import('../blocks/ButtonBlock.vue')),
  divider: defineAsyncComponent(() => import('../blocks/DividerBlock.vue')),
  spacer: defineAsyncComponent(() => import('../blocks/SpacerBlock.vue')),
  container: defineAsyncComponent(() => import('../blocks/ContainerBlock.vue')),
  row: defineAsyncComponent(() => import('../blocks/RowBlock.vue')),
  column: defineAsyncComponent(() => import('../blocks/ColumnBlock.vue')),
};

export function hasComponent(type) {
  return Object.prototype.hasOwnProperty.call(componentMap, type);
}
