import { cn } from './cn';

const ANIMATION_CLASS = {
  'fade-in': 'sb-animate-fade-in',
  'slide-up': 'sb-animate-slide-up',
  'slide-left': 'sb-animate-slide-left',
  'slide-right': 'sb-animate-slide-right',
  none: '',
};

export function blockWrapperClass(options, extra) {
  if (!options) return cn(extra);
  return cn(
    options.className,
    options.animation && options.animation !== 'none'
      ? ANIMATION_CLASS[options.animation]
      : '',
    extra
  );
}

export function blockInlineStyle(options) {
  if (!options) return {};
  const style = {};
  if (options.backgroundColor) style.backgroundColor = options.backgroundColor;
  if (options.textColor) style.color = options.textColor;
  if (options.padding) style.padding = options.padding;
  if (options.margin) style.margin = options.margin;
  return style;
}
