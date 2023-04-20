Below is my gluestackUIAliases -

```javascript
const gluestackUIAliases = {
  bg: 'backgroundColor',
  backgroundColor: 'backgroundColor',
  bgColor: 'backgroundColor',
  color: 'color',
  borderColor: 'borderColor',
  shadowColor: 'shadowColor',
  shadowOffset: 'shadowOffset',
  shadowOpacity: 'shadowOpacity',
  shadowRadius: 'shadowRadius',
  elevation: 'elevation',
  // dimension
  h: 'height',
  w: 'width',
  height: 'height',
  width: 'width',
  // padding
  p: 'padding',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  pt: 'paddingTop',
  pb: 'paddingBottom',
  pr: 'paddingRight',
  pl: 'paddingLeft',
  padding: 'padding',
  paddingHorizontal: 'paddingHorizontal',
  paddingVertical: 'paddingVertical',
  paddingTop: 'paddingTop',
  paddingBottom: 'paddingBottom',
  paddingRight: 'paddingRight',
  paddingLeft: 'paddingLeft',
  // margin
  m: 'margin',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  mt: 'marginTop',
  mb: 'marginBottom',
  mr: 'marginRight',
  ml: 'marginLeft',
  margin: 'margin',
  marginHorizontal: 'marginHorizontal',
  marginVertical: 'marginVertical',
  marginTop: 'marginTop',
  marginBottom: 'marginBottom',
  marginRight: 'marginRight',
  marginLeft: 'marginLeft',
  // Borders
  borderWidth: 'borderWidth',
  borderRadius: 'borderRadius',
  borderTopLeftRadius: 'borderTopLeftRadius',
  borderTopRightRadius: 'borderTopRightRadius',
  rounded: 'borderRadius',
  // Typography
  letterSpacing: 'letterSpacing',
  lineHeight: 'lineHeight',
  fontWeight: 'fontWeight',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  shadow: 'shadow',
  // Media Query
  condition: 'condition',
};
```

gluestackUIAliases can be used as the utility prop name and it is mapped to react-native properties.
for example, if I want margin in a Box component - I can write <Box m="$2"></Box>

Always use alias key for all the utility props which is mentioned in gluestackUIAliases.

Below is my gluestackUIPropertyKeyMap -

```javascript
const gluestackUIPropertyKeyMap = {
  gap: 'space',
  gridGap: 'space',
  columnGap: 'space',
  gridColumnGap: 'space',
  rowGap: 'space',
  gridRowGap: 'space',
  inset: 'space',
  insetBlock: 'space',
  insetBlockEnd: 'space',
  insetBlockStart: 'space',
  insetInline: 'space',
  insetInlineEnd: 'space',
  insetInlineStart: 'space',
  margin: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginLeft: 'space',
  marginBlock: 'space',
  marginBlockEnd: 'space',
  marginBlockStart: 'space',
  marginInline: 'space',
  marginInlineEnd: 'space',
  marginInlineStart: 'space',

  marginHorizontal: 'space',
  marginVertical: 'space',
  padding: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingLeft: 'space',

  paddingBlock: 'space',
  paddingBlockEnd: 'space',
  paddingBlockStart: 'space',
  paddingInline: 'space',
  paddingInlineEnd: 'space',
  paddingInlineStart: 'space',

  paddingHorizontal: 'space',
  paddingVertical: 'space',
  paddingStart: 'space',
  paddingEnd: 'space',

  top: 'space',
  right: 'space',
  bottom: 'space',
  left: 'space',
  scrollMargin: 'space',
  scrollMarginTop: 'space',
  scrollMarginRight: 'space',
  scrollMarginBottom: 'space',
  scrollMarginLeft: 'space',
  scrollMarginX: 'space',
  scrollMarginY: 'space',
  scrollMarginBlock: 'space',
  scrollMarginBlockEnd: 'space',
  scrollMarginBlockStart: 'space',
  scrollMarginInline: 'space',
  scrollMarginInlineEnd: 'space',
  scrollMarginInlineStart: 'space',
  scrollPadding: 'space',
  scrollPaddingTop: 'space',
  scrollPaddingRight: 'space',
  scrollPaddingBottom: 'space',
  scrollPaddingLeft: 'space',
  scrollPaddingX: 'space',
  scrollPaddingY: 'space',
  scrollPaddingBlock: 'space',
  scrollPaddingBlockEnd: 'space',
  scrollPaddingBlockStart: 'space',
  scrollPaddingInline: 'space',
  scrollPaddingInlineEnd: 'space',
  scrollPaddingInlineStart: 'space',
  shadowRadius: 'space',
  elevation: 'space',

  fontSize: 'fontSizes',

  background: 'colors',
  backgroundColor: 'colors',
  backgroundImage: 'colors',
  borderImage: 'colors',
  border: 'colors',
  borderBlock: 'colors',
  borderBlockEnd: 'colors',
  borderBlockStart: 'colors',
  borderBottom: 'colors',
  borderBottomColor: 'colors',
  borderColor: 'colors',
  borderInline: 'colors',
  borderInlineEnd: 'colors',
  borderInlineStart: 'colors',
  borderLeft: 'colors',
  borderLeftColor: 'colors',
  borderRight: 'colors',
  borderRightColor: 'colors',
  borderTop: 'colors',
  borderTopColor: 'colors',
  caretColor: 'colors',
  color: 'colors',
  columnRuleColor: 'colors',
  fill: 'colors',
  outline: 'colors',
  outlineColor: 'colors',
  stroke: 'colors',
  textDecorationColor: 'colors',
  shadowColor: 'colors',

  shadowOpacity: 'opacity',

  // Media Query
  condition: 'mediaQueries',

  fontFamily: 'fonts',

  fontWeight: 'fontWeights',

  lineHeight: 'lineHeights',

  letterSpacing: 'letterSpacings',

  blockSize: 'space',
  minBlockSize: 'space',
  maxBlockSize: 'space',
  inlineSize: 'space',
  minInlineSize: 'space',
  maxInlineSize: 'space',
  width: 'space',
  minWidth: 'space',
  maxWidth: 'space',
  height: 'space',
  minHeight: 'space',
  maxHeight: 'space',
  flexBasis: 'space',
  gridTemplateColumns: 'space',
  gridTemplateRows: 'space',

  borderWidth: 'borderWidths',
  borderTopWidth: 'borderWidths',
  borderRightWidth: 'borderWidths',
  borderBottomWidth: 'borderWidths',
  borderLeftWidth: 'borderWidths',

  borderStyle: 'borderStyles',
  borderTopStyle: 'borderStyles',
  borderRightStyle: 'borderStyles',
  borderBottomStyle: 'borderStyles',
  borderLeftStyle: 'borderStyles',

  borderRadius: 'radii',
  borderTopLeftRadius: 'radii',
  borderTopRightRadius: 'radii',
  borderBottomRightRadius: 'radii',
  borderBottomLeftRadius: 'radii',

  boxShadow: 'colors',
  textShadow: 'shadows',

  transition: 'transitions',

  zIndex: 'zIndices',
};
```

Always use utility props from keys of gluestackUIPropertyKeyMap.

Below is my gluestackUITokens for Colors -

- color "rose" ranges from rose50 to rose900
- gluestack ui tokens color for "#fff1f2" is "$rose50", so when I ask for "#fff1f2" then it should be replaced with "$rose50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ffe4e6" is "$rose100", so when I ask for "#ffe4e6" then it should be replaced with "$rose100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fecdd3" is "$rose200", so when I ask for "#fecdd3" then it should be replaced with "$rose200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fda4af" is "$rose300", so when I ask for "#fda4af" then it should be replaced with "$rose300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fb7185" is "$rose400", so when I ask for "#fb7185" then it should be replaced with "$rose400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f43f5e" is "$rose500", so when I ask for "#f43f5e" then it should be replaced with "$rose500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e11d48" is "$rose600", so when I ask for "#e11d48" then it should be replaced with "$rose600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#be123c" is "$rose700", so when I ask for "#be123c" then it should be replaced with "$rose700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9f1239" is "$rose800", so when I ask for "#9f1239" then it should be replaced with "$rose800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#881337" is "$rose900", so when I ask for "#881337" then it should be replaced with "$rose900" and it works vice-versa if and only if you specifically for hex color code
- color "pink" ranges from pink50 to pink900
- gluestack ui tokens color for "#fdf2f8" is "$pink50", so when I ask for "#fdf2f8" then it should be replaced with "$pink50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fce7f3" is "$pink100", so when I ask for "#fce7f3" then it should be replaced with "$pink100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fbcfe8" is "$pink200", so when I ask for "#fbcfe8" then it should be replaced with "$pink200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f9a8d4" is "$pink300", so when I ask for "#f9a8d4" then it should be replaced with "$pink300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f472b6" is "$pink400", so when I ask for "#f472b6" then it should be replaced with "$pink400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ec4899" is "$pink500", so when I ask for "#ec4899" then it should be replaced with "$pink500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#db2777" is "$pink600", so when I ask for "#db2777" then it should be replaced with "$pink600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#be185d" is "$pink700", so when I ask for "#be185d" then it should be replaced with "$pink700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9d174d" is "$pink800", so when I ask for "#9d174d" then it should be replaced with "$pink800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#831843" is "$pink900", so when I ask for "#831843" then it should be replaced with "$pink900" and it works vice-versa if and only if you specifically for hex color code
- color "fuchsia" ranges from fuchsia50 to fuchsia900
- gluestack ui tokens color for "#fdf4ff" is "$fuchsia50", so when I ask for "#fdf4ff" then it should be replaced with "$fuchsia50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fae8ff" is "$fuchsia100", so when I ask for "#fae8ff" then it should be replaced with "$fuchsia100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5d0fe" is "$fuchsia200", so when I ask for "#f5d0fe" then it should be replaced with "$fuchsia200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f0abfc" is "$fuchsia300", so when I ask for "#f0abfc" then it should be replaced with "$fuchsia300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e879f9" is "$fuchsia400", so when I ask for "#e879f9" then it should be replaced with "$fuchsia400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d946ef" is "$fuchsia500", so when I ask for "#d946ef" then it should be replaced with "$fuchsia500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#c026d3" is "$fuchsia600", so when I ask for "#c026d3" then it should be replaced with "$fuchsia600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a21caf" is "$fuchsia700", so when I ask for "#a21caf" then it should be replaced with "$fuchsia700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#86198f" is "$fuchsia800", so when I ask for "#86198f" then it should be replaced with "$fuchsia800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#701a75" is "$fuchsia900", so when I ask for "#701a75" then it should be replaced with "$fuchsia900" and it works vice-versa if and only if you specifically for hex color code
- color "purple" ranges from purple50 to purple900
- gluestack ui tokens color for "#faf5ff" is "$purple50", so when I ask for "#faf5ff" then it should be replaced with "$purple50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f3e8ff" is "$purple100", so when I ask for "#f3e8ff" then it should be replaced with "$purple100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e9d5ff" is "$purple200", so when I ask for "#e9d5ff" then it should be replaced with "$purple200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d8b4fe" is "$purple300", so when I ask for "#d8b4fe" then it should be replaced with "$purple300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#c084fc" is "$purple400", so when I ask for "#c084fc" then it should be replaced with "$purple400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a855f7" is "$purple500", so when I ask for "#a855f7" then it should be replaced with "$purple500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9333ea" is "$purple600", so when I ask for "#9333ea" then it should be replaced with "$purple600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7e22ce" is "$purple700", so when I ask for "#7e22ce" then it should be replaced with "$purple700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#6b21a8" is "$purple800", so when I ask for "#6b21a8" then it should be replaced with "$purple800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#581c87" is "$purple900", so when I ask for "#581c87" then it should be replaced with "$purple900" and it works vice-versa if and only if you specifically for hex color code
- color "violet" ranges from violet50 to violet900
- gluestack ui tokens color for "#f5f3ff" is "$violet50", so when I ask for "#f5f3ff" then it should be replaced with "$violet50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ede9fe" is "$violet100", so when I ask for "#ede9fe" then it should be replaced with "$violet100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ddd6fe" is "$violet200", so when I ask for "#ddd6fe" then it should be replaced with "$violet200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#c4b5fd" is "$violet300", so when I ask for "#c4b5fd" then it should be replaced with "$violet300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a78bfa" is "$violet400", so when I ask for "#a78bfa" then it should be replaced with "$violet400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#8b5cf6" is "$violet500", so when I ask for "#8b5cf6" then it should be replaced with "$violet500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7c3aed" is "$violet600", so when I ask for "#7c3aed" then it should be replaced with "$violet600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#6d28d9" is "$violet700", so when I ask for "#6d28d9" then it should be replaced with "$violet700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#5b21b6" is "$violet800", so when I ask for "#5b21b6" then it should be replaced with "$violet800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4c1d95" is "$violet900", so when I ask for "#4c1d95" then it should be replaced with "$violet900" and it works vice-versa if and only if you specifically for hex color code
- color "indigo" ranges from indigo50 to indigo900
- gluestack ui tokens color for "#eef2ff" is "$indigo50", so when I ask for "#eef2ff" then it should be replaced with "$indigo50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e0e7ff" is "$indigo100", so when I ask for "#e0e7ff" then it should be replaced with "$indigo100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#c7d2fe" is "$indigo200", so when I ask for "#c7d2fe" then it should be replaced with "$indigo200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a5b4fc" is "$indigo300", so when I ask for "#a5b4fc" then it should be replaced with "$indigo300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#818cf8" is "$indigo400", so when I ask for "#818cf8" then it should be replaced with "$indigo400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#6366f1" is "$indigo500", so when I ask for "#6366f1" then it should be replaced with "$indigo500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4f46e5" is "$indigo600", so when I ask for "#4f46e5" then it should be replaced with "$indigo600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4338ca" is "$indigo700", so when I ask for "#4338ca" then it should be replaced with "$indigo700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#3730a3" is "$indigo800", so when I ask for "#3730a3" then it should be replaced with "$indigo800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#312e81" is "$indigo900", so when I ask for "#312e81" then it should be replaced with "$indigo900" and it works vice-versa if and only if you specifically for hex color code
- color "blue" ranges from blue50 to blue900
- gluestack ui tokens color for "#eff6ff" is "$blue50", so when I ask for "#eff6ff" then it should be replaced with "$blue50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dbeafe" is "$blue100", so when I ask for "#dbeafe" then it should be replaced with "$blue100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#bfdbfe" is "$blue200", so when I ask for "#bfdbfe" then it should be replaced with "$blue200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#93c5fd" is "$blue300", so when I ask for "#93c5fd" then it should be replaced with "$blue300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#60a5fa" is "$blue400", so when I ask for "#60a5fa" then it should be replaced with "$blue400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#3b82f6" is "$blue500", so when I ask for "#3b82f6" then it should be replaced with "$blue500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#2563eb" is "$blue600", so when I ask for "#2563eb" then it should be replaced with "$blue600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1d4ed8" is "$blue700", so when I ask for "#1d4ed8" then it should be replaced with "$blue700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1e40af" is "$blue800", so when I ask for "#1e40af" then it should be replaced with "$blue800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1e3a8a" is "$blue900", so when I ask for "#1e3a8a" then it should be replaced with "$blue900" and it works vice-versa if and only if you specifically for hex color code
- color "lightBlue" ranges from lightBlue50 to lightBlue900
- gluestack ui tokens color for "#f0f9ff" is "$lightBlue50", so when I ask for "#f0f9ff" then it should be replaced with "$lightBlue50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e0f2fe" is "$lightBlue100", so when I ask for "#e0f2fe" then it should be replaced with "$lightBlue100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#bae6fd" is "$lightBlue200", so when I ask for "#bae6fd" then it should be replaced with "$lightBlue200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7dd3fc" is "$lightBlue300", so when I ask for "#7dd3fc" then it should be replaced with "$lightBlue300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#38bdf8" is "$lightBlue400", so when I ask for "#38bdf8" then it should be replaced with "$lightBlue400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0ea5e9" is "$lightBlue500", so when I ask for "#0ea5e9" then it should be replaced with "$lightBlue500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0284c7" is "$lightBlue600", so when I ask for "#0284c7" then it should be replaced with "$lightBlue600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0369a1" is "$lightBlue700", so when I ask for "#0369a1" then it should be replaced with "$lightBlue700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#075985" is "$lightBlue800", so when I ask for "#075985" then it should be replaced with "$lightBlue800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0c4a6e" is "$lightBlue900", so when I ask for "#0c4a6e" then it should be replaced with "$lightBlue900" and it works vice-versa if and only if you specifically for hex color code
- color "darkBlue" ranges from darkBlue50 to darkBlue900
- gluestack ui tokens color for "#dbf4ff" is "$darkBlue50", so when I ask for "#dbf4ff" then it should be replaced with "$darkBlue50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#addbff" is "$darkBlue100", so when I ask for "#addbff" then it should be replaced with "$darkBlue100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7cc2ff" is "$darkBlue200", so when I ask for "#7cc2ff" then it should be replaced with "$darkBlue200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4aa9ff" is "$darkBlue300", so when I ask for "#4aa9ff" then it should be replaced with "$darkBlue300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1a91ff" is "$darkBlue400", so when I ask for "#1a91ff" then it should be replaced with "$darkBlue400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0077e6" is "$darkBlue500", so when I ask for "#0077e6" then it should be replaced with "$darkBlue500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#005db4" is "$darkBlue600", so when I ask for "#005db4" then it should be replaced with "$darkBlue600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#004282" is "$darkBlue700", so when I ask for "#004282" then it should be replaced with "$darkBlue700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#002851" is "$darkBlue800", so when I ask for "#002851" then it should be replaced with "$darkBlue800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#000e21" is "$darkBlue900", so when I ask for "#000e21" then it should be replaced with "$darkBlue900" and it works vice-versa if and only if you specifically for hex color code
- color "cyan" ranges from cyan50 to cyan900
- gluestack ui tokens color for "#ecfeff" is "$cyan50", so when I ask for "#ecfeff" then it should be replaced with "$cyan50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#cffafe" is "$cyan100", so when I ask for "#cffafe" then it should be replaced with "$cyan100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a5f3fc" is "$cyan200", so when I ask for "#a5f3fc" then it should be replaced with "$cyan200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#67e8f9" is "$cyan300", so when I ask for "#67e8f9" then it should be replaced with "$cyan300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#22d3ee" is "$cyan400", so when I ask for "#22d3ee" then it should be replaced with "$cyan400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#06b6d4" is "$cyan500", so when I ask for "#06b6d4" then it should be replaced with "$cyan500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0891b2" is "$cyan600", so when I ask for "#0891b2" then it should be replaced with "$cyan600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0e7490" is "$cyan700", so when I ask for "#0e7490" then it should be replaced with "$cyan700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#155e75" is "$cyan800", so when I ask for "#155e75" then it should be replaced with "$cyan800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#164e63" is "$cyan900", so when I ask for "#164e63" then it should be replaced with "$cyan900" and it works vice-versa if and only if you specifically for hex color code
- color "teal" ranges from teal50 to teal900
- gluestack ui tokens color for "#f0fdfa" is "$teal50", so when I ask for "#f0fdfa" then it should be replaced with "$teal50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ccfbf1" is "$teal100", so when I ask for "#ccfbf1" then it should be replaced with "$teal100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#99f6e4" is "$teal200", so when I ask for "#99f6e4" then it should be replaced with "$teal200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#5eead4" is "$teal300", so when I ask for "#5eead4" then it should be replaced with "$teal300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#2dd4bf" is "$teal400", so when I ask for "#2dd4bf" then it should be replaced with "$teal400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#14b8a6" is "$teal500", so when I ask for "#14b8a6" then it should be replaced with "$teal500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0d9488" is "$teal600", so when I ask for "#0d9488" then it should be replaced with "$teal600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0f766e" is "$teal700", so when I ask for "#0f766e" then it should be replaced with "$teal700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#115e59" is "$teal800", so when I ask for "#115e59" then it should be replaced with "$teal800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#134e4a" is "$teal900", so when I ask for "#134e4a" then it should be replaced with "$teal900" and it works vice-versa if and only if you specifically for hex color code
- color "emerald" ranges from emerald50 to emerald900
- gluestack ui tokens color for "#ecfdf5" is "$emerald50", so when I ask for "#ecfdf5" then it should be replaced with "$emerald50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d1fae5" is "$emerald100", so when I ask for "#d1fae5" then it should be replaced with "$emerald100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a7f3d0" is "$emerald200", so when I ask for "#a7f3d0" then it should be replaced with "$emerald200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#6ee7b7" is "$emerald300", so when I ask for "#6ee7b7" then it should be replaced with "$emerald300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#34d399" is "$emerald400", so when I ask for "#34d399" then it should be replaced with "$emerald400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#10b981" is "$emerald500", so when I ask for "#10b981" then it should be replaced with "$emerald500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#059669" is "$emerald600", so when I ask for "#059669" then it should be replaced with "$emerald600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#047857" is "$emerald700", so when I ask for "#047857" then it should be replaced with "$emerald700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#065f46" is "$emerald800", so when I ask for "#065f46" then it should be replaced with "$emerald800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#064e3b" is "$emerald900", so when I ask for "#064e3b" then it should be replaced with "$emerald900" and it works vice-versa if and only if you specifically for hex color code
- color "green" ranges from green50 to green900
- gluestack ui tokens color for "#f0fdf4" is "$green50", so when I ask for "#f0fdf4" then it should be replaced with "$green50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dcfce7" is "$green100", so when I ask for "#dcfce7" then it should be replaced with "$green100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#bbf7d0" is "$green200", so when I ask for "#bbf7d0" then it should be replaced with "$green200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#86efac" is "$green300", so when I ask for "#86efac" then it should be replaced with "$green300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4ade80" is "$green400", so when I ask for "#4ade80" then it should be replaced with "$green400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#22c55e" is "$green500", so when I ask for "#22c55e" then it should be replaced with "$green500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#16a34a" is "$green600", so when I ask for "#16a34a" then it should be replaced with "$green600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#15803d" is "$green700", so when I ask for "#15803d" then it should be replaced with "$green700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#166534" is "$green800", so when I ask for "#166534" then it should be replaced with "$green800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#14532d" is "$green900", so when I ask for "#14532d" then it should be replaced with "$green900" and it works vice-versa if and only if you specifically for hex color code
- color "lime" ranges from lime50 to lime900
- gluestack ui tokens color for "#f7fee7" is "$lime50", so when I ask for "#f7fee7" then it should be replaced with "$lime50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ecfccb" is "$lime100", so when I ask for "#ecfccb" then it should be replaced with "$lime100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d9f99d" is "$lime200", so when I ask for "#d9f99d" then it should be replaced with "$lime200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#bef264" is "$lime300", so when I ask for "#bef264" then it should be replaced with "$lime300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a3e635" is "$lime400", so when I ask for "#a3e635" then it should be replaced with "$lime400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#84cc16" is "$lime500", so when I ask for "#84cc16" then it should be replaced with "$lime500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#65a30d" is "$lime600", so when I ask for "#65a30d" then it should be replaced with "$lime600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4d7c0f" is "$lime700", so when I ask for "#4d7c0f" then it should be replaced with "$lime700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#3f6212" is "$lime800", so when I ask for "#3f6212" then it should be replaced with "$lime800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#365314" is "$lime900", so when I ask for "#365314" then it should be replaced with "$lime900" and it works vice-versa if and only if you specifically for hex color code
- color "yellow" ranges from yellow50 to yellow900
- gluestack ui tokens color for "#fefce8" is "$yellow50", so when I ask for "#fefce8" then it should be replaced with "$yellow50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fef9c3" is "$yellow100", so when I ask for "#fef9c3" then it should be replaced with "$yellow100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fef08a" is "$yellow200", so when I ask for "#fef08a" then it should be replaced with "$yellow200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fde047" is "$yellow300", so when I ask for "#fde047" then it should be replaced with "$yellow300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#facc15" is "$yellow400", so when I ask for "#facc15" then it should be replaced with "$yellow400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#eab308" is "$yellow500", so when I ask for "#eab308" then it should be replaced with "$yellow500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ca8a04" is "$yellow600", so when I ask for "#ca8a04" then it should be replaced with "$yellow600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a16207" is "$yellow700", so when I ask for "#a16207" then it should be replaced with "$yellow700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#854d0e" is "$yellow800", so when I ask for "#854d0e" then it should be replaced with "$yellow800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#713f12" is "$yellow900", so when I ask for "#713f12" then it should be replaced with "$yellow900" and it works vice-versa if and only if you specifically for hex color code
- color "amber" ranges from amber50 to amber900
- gluestack ui tokens color for "#fffbeb" is "$amber50", so when I ask for "#fffbeb" then it should be replaced with "$amber50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fef3c7" is "$amber100", so when I ask for "#fef3c7" then it should be replaced with "$amber100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fde68a" is "$amber200", so when I ask for "#fde68a" then it should be replaced with "$amber200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fcd34d" is "$amber300", so when I ask for "#fcd34d" then it should be replaced with "$amber300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fbbf24" is "$amber400", so when I ask for "#fbbf24" then it should be replaced with "$amber400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f59e0b" is "$amber500", so when I ask for "#f59e0b" then it should be replaced with "$amber500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d97706" is "$amber600", so when I ask for "#d97706" then it should be replaced with "$amber600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#b45309" is "$amber700", so when I ask for "#b45309" then it should be replaced with "$amber700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#92400e" is "$amber800", so when I ask for "#92400e" then it should be replaced with "$amber800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#78350f" is "$amber900", so when I ask for "#78350f" then it should be replaced with "$amber900" and it works vice-versa if and only if you specifically for hex color code
- color "orange" ranges from orange50 to orange900
- gluestack ui tokens color for "#fff7ed" is "$orange50", so when I ask for "#fff7ed" then it should be replaced with "$orange50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ffedd5" is "$orange100", so when I ask for "#ffedd5" then it should be replaced with "$orange100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fed7aa" is "$orange200", so when I ask for "#fed7aa" then it should be replaced with "$orange200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fdba74" is "$orange300", so when I ask for "#fdba74" then it should be replaced with "$orange300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fb923c" is "$orange400", so when I ask for "#fb923c" then it should be replaced with "$orange400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f97316" is "$orange500", so when I ask for "#f97316" then it should be replaced with "$orange500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ea580c" is "$orange600", so when I ask for "#ea580c" then it should be replaced with "$orange600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#c2410c" is "$orange700", so when I ask for "#c2410c" then it should be replaced with "$orange700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9a3412" is "$orange800", so when I ask for "#9a3412" then it should be replaced with "$orange800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7c2d12" is "$orange900", so when I ask for "#7c2d12" then it should be replaced with "$orange900" and it works vice-versa if and only if you specifically for hex color code
- color "red" ranges from red50 to red900
- gluestack ui tokens color for "#fef2f2" is "$red50", so when I ask for "#fef2f2" then it should be replaced with "$red50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fee2e2" is "$red100", so when I ask for "#fee2e2" then it should be replaced with "$red100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fecaca" is "$red200", so when I ask for "#fecaca" then it should be replaced with "$red200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fca5a5" is "$red300", so when I ask for "#fca5a5" then it should be replaced with "$red300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f87171" is "$red400", so when I ask for "#f87171" then it should be replaced with "$red400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ef4444" is "$red500", so when I ask for "#ef4444" then it should be replaced with "$red500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dc2626" is "$red600", so when I ask for "#dc2626" then it should be replaced with "$red600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#b91c1c" is "$red700", so when I ask for "#b91c1c" then it should be replaced with "$red700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#991b1b" is "$red800", so when I ask for "#991b1b" then it should be replaced with "$red800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7f1d1d" is "$red900", so when I ask for "#7f1d1d" then it should be replaced with "$red900" and it works vice-versa if and only if you specifically for hex color code
- color "warmGray" ranges from warmGray50 to warmGray900
- gluestack ui tokens color for "#fafaf9" is "$warmGray50", so when I ask for "#fafaf9" then it should be replaced with "$warmGray50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f4" is "$warmGray100", so when I ask for "#f5f5f4" then it should be replaced with "$warmGray100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e7e5e4" is "$warmGray200", so when I ask for "#e7e5e4" then it should be replaced with "$warmGray200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d6d3d1" is "$warmGray300", so when I ask for "#d6d3d1" then it should be replaced with "$warmGray300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a8a29e" is "$warmGray400", so when I ask for "#a8a29e" then it should be replaced with "$warmGray400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#78716c" is "$warmGray500", so when I ask for "#78716c" then it should be replaced with "$warmGray500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#57534e" is "$warmGray600", so when I ask for "#57534e" then it should be replaced with "$warmGray600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#44403c" is "$warmGray700", so when I ask for "#44403c" then it should be replaced with "$warmGray700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#292524" is "$warmGray800", so when I ask for "#292524" then it should be replaced with "$warmGray800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1c1917" is "$warmGray900", so when I ask for "#1c1917" then it should be replaced with "$warmGray900" and it works vice-versa if and only if you specifically for hex color code
- color "trueGray" ranges from trueGray50 to trueGray900
- gluestack ui tokens color for "#fafafa" is "$trueGray50", so when I ask for "#fafafa" then it should be replaced with "$trueGray50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f5" is "$trueGray100", so when I ask for "#f5f5f5" then it should be replaced with "$trueGray100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e5e5" is "$trueGray200", so when I ask for "#e5e5e5" then it should be replaced with "$trueGray200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d4" is "$trueGray300", so when I ask for "#d4d4d4" then it should be replaced with "$trueGray300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a3a3a3" is "$trueGray400", so when I ask for "#a3a3a3" then it should be replaced with "$trueGray400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#737373" is "$trueGray500", so when I ask for "#737373" then it should be replaced with "$trueGray500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#525252" is "$trueGray600", so when I ask for "#525252" then it should be replaced with "$trueGray600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#404040" is "$trueGray700", so when I ask for "#404040" then it should be replaced with "$trueGray700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#262626" is "$trueGray800", so when I ask for "#262626" then it should be replaced with "$trueGray800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#171717" is "$trueGray900", so when I ask for "#171717" then it should be replaced with "$trueGray900" and it works vice-versa if and only if you specifically for hex color code
- color "gray" ranges from gray50 to gray900
- gluestack ui tokens color for "#fafafa" is "$gray50", so when I ask for "#fafafa" then it should be replaced with "$gray50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f4f4f5" is "$gray100", so when I ask for "#f4f4f5" then it should be replaced with "$gray100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e4e4e7" is "$gray200", so when I ask for "#e4e4e7" then it should be replaced with "$gray200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d8" is "$gray300", so when I ask for "#d4d4d8" then it should be replaced with "$gray300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a1a1aa" is "$gray400", so when I ask for "#a1a1aa" then it should be replaced with "$gray400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#71717a" is "$gray500", so when I ask for "#71717a" then it should be replaced with "$gray500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#52525b" is "$gray600", so when I ask for "#52525b" then it should be replaced with "$gray600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#3f3f46" is "$gray700", so when I ask for "#3f3f46" then it should be replaced with "$gray700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#27272a" is "$gray800", so when I ask for "#27272a" then it should be replaced with "$gray800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#18181b" is "$gray900", so when I ask for "#18181b" then it should be replaced with "$gray900" and it works vice-versa if and only if you specifically for hex color code
- color "coolGray" ranges from coolGray50 to coolGray900
- gluestack ui tokens color for "#f9fafb" is "$coolGray50", so when I ask for "#f9fafb" then it should be replaced with "$coolGray50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f3f4f6" is "$coolGray100", so when I ask for "#f3f4f6" then it should be replaced with "$coolGray100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e7eb" is "$coolGray200", so when I ask for "#e5e7eb" then it should be replaced with "$coolGray200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d1d5db" is "$coolGray300", so when I ask for "#d1d5db" then it should be replaced with "$coolGray300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9ca3af" is "$coolGray400", so when I ask for "#9ca3af" then it should be replaced with "$coolGray400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#6b7280" is "$coolGray500", so when I ask for "#6b7280" then it should be replaced with "$coolGray500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4b5563" is "$coolGray600", so when I ask for "#4b5563" then it should be replaced with "$coolGray600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#374151" is "$coolGray700", so when I ask for "#374151" then it should be replaced with "$coolGray700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1f2937" is "$coolGray800", so when I ask for "#1f2937" then it should be replaced with "$coolGray800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#111827" is "$coolGray900", so when I ask for "#111827" then it should be replaced with "$coolGray900" and it works vice-versa if and only if you specifically for hex color code
- color "blueGray" ranges from blueGray50 to blueGray900
- gluestack ui tokens color for "#f8fafc" is "$blueGray50", so when I ask for "#f8fafc" then it should be replaced with "$blueGray50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f1f5f9" is "$blueGray100", so when I ask for "#f1f5f9" then it should be replaced with "$blueGray100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e2e8f0" is "$blueGray200", so when I ask for "#e2e8f0" then it should be replaced with "$blueGray200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#cbd5e1" is "$blueGray300", so when I ask for "#cbd5e1" then it should be replaced with "$blueGray300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#94a3b8" is "$blueGray400", so when I ask for "#94a3b8" then it should be replaced with "$blueGray400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#64748b" is "$blueGray500", so when I ask for "#64748b" then it should be replaced with "$blueGray500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#475569" is "$blueGray600", so when I ask for "#475569" then it should be replaced with "$blueGray600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#334155" is "$blueGray700", so when I ask for "#334155" then it should be replaced with "$blueGray700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1e293b" is "$blueGray800", so when I ask for "#1e293b" then it should be replaced with "$blueGray800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0f172a" is "$blueGray900", so when I ask for "#0f172a" then it should be replaced with "$blueGray900" and it works vice-versa if and only if you specifically for hex color code
- color "dark" ranges from dark50 to dark900
- gluestack ui tokens color for "#18181b" is "$dark50", so when I ask for "#18181b" then it should be replaced with "$dark50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#27272a" is "$dark100", so when I ask for "#27272a" then it should be replaced with "$dark100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#3f3f46" is "$dark200", so when I ask for "#3f3f46" then it should be replaced with "$dark200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#52525b" is "$dark300", so when I ask for "#52525b" then it should be replaced with "$dark300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#71717a" is "$dark400", so when I ask for "#71717a" then it should be replaced with "$dark400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a1a1aa" is "$dark500", so when I ask for "#a1a1aa" then it should be replaced with "$dark500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d8" is "$dark600", so when I ask for "#d4d4d8" then it should be replaced with "$dark600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e4e4e7" is "$dark700", so when I ask for "#e4e4e7" then it should be replaced with "$dark700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f4f4f5" is "$dark800", so when I ask for "#f4f4f5" then it should be replaced with "$dark800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fafafa" is "$dark900", so when I ask for "#fafafa" then it should be replaced with "$dark900" and it works vice-versa if and only if you specifically for hex color code
- color "text" ranges from text50 to text900
- gluestack ui tokens color for "#fafafa" is "$text50", so when I ask for "#fafafa" then it should be replaced with "$text50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f5" is "$text100", so when I ask for "#f5f5f5" then it should be replaced with "$text100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e5e5" is "$text200", so when I ask for "#e5e5e5" then it should be replaced with "$text200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d4" is "$text300", so when I ask for "#d4d4d4" then it should be replaced with "$text300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a3a3a3" is "$text400", so when I ask for "#a3a3a3" then it should be replaced with "$text400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#737373" is "$text500", so when I ask for "#737373" then it should be replaced with "$text500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#525252" is "$text600", so when I ask for "#525252" then it should be replaced with "$text600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#404040" is "$text700", so when I ask for "#404040" then it should be replaced with "$text700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#262626" is "$text800", so when I ask for "#262626" then it should be replaced with "$text800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#171717" is "$text900", so when I ask for "#171717" then it should be replaced with "$text900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ffffff" is "$white", so when I ask for "#ffffff" then it should be replaced with "$white" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#000000" is "$black", so when I ask for "#000000" then it should be replaced with "$black" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ffffff" is "$lightText", so when I ask for "#ffffff" then it should be replaced with "$lightText" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#000000" is "$darkText", so when I ask for "#000000" then it should be replaced with "$darkText" and it works vice-versa if and only if you specifically for hex color code
- color "secondary" ranges from secondary0 to secondary900
- gluestack ui tokens color for "#f8fafc" is "$secondary0", so when I ask for "#f8fafc" then it should be replaced with "$secondary0" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f1f5f9" is "$secondary50", so when I ask for "#f1f5f9" then it should be replaced with "$secondary50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e4e9f0" is "$secondary100", so when I ask for "#e4e9f0" then it should be replaced with "$secondary100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dbe1e9" is "$secondary200", so when I ask for "#dbe1e9" then it should be replaced with "$secondary200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#cbd5e1" is "$secondary300", so when I ask for "#cbd5e1" then it should be replaced with "$secondary300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#b6c3d5" is "$secondary400", so when I ask for "#b6c3d5" then it should be replaced with "$secondary400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#94a3b8" is "$secondary500", so when I ask for "#94a3b8" then it should be replaced with "$secondary500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#64748b" is "$secondary600", so when I ask for "#64748b" then it should be replaced with "$secondary600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#475569" is "$secondary700", so when I ask for "#475569" then it should be replaced with "$secondary700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#334155" is "$secondary800", so when I ask for "#334155" then it should be replaced with "$secondary800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1e293b" is "$secondary900", so when I ask for "#1e293b" then it should be replaced with "$secondary900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0f172a" is "$secondary950", so when I ask for "#0f172a" then it should be replaced with "$secondary950" and it works vice-versa if and only if you specifically for hex color code
- color "tertiary" ranges from tertiary50 to tertiary900
- gluestack ui tokens color for "#ecfdf5" is "$tertiary50", so when I ask for "#ecfdf5" then it should be replaced with "$tertiary50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d1fae5" is "$tertiary100", so when I ask for "#d1fae5" then it should be replaced with "$tertiary100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a7f3d0" is "$tertiary200", so when I ask for "#a7f3d0" then it should be replaced with "$tertiary200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#6ee7b7" is "$tertiary300", so when I ask for "#6ee7b7" then it should be replaced with "$tertiary300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#34d399" is "$tertiary400", so when I ask for "#34d399" then it should be replaced with "$tertiary400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#10b981" is "$tertiary500", so when I ask for "#10b981" then it should be replaced with "$tertiary500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#059669" is "$tertiary600", so when I ask for "#059669" then it should be replaced with "$tertiary600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#047857" is "$tertiary700", so when I ask for "#047857" then it should be replaced with "$tertiary700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#065f46" is "$tertiary800", so when I ask for "#065f46" then it should be replaced with "$tertiary800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#064e3b" is "$tertiary900", so when I ask for "#064e3b" then it should be replaced with "$tertiary900" and it works vice-versa if and only if you specifically for hex color code
- color "danger" ranges from danger50 to danger900
- gluestack ui tokens color for "#fff1f2" is "$danger50", so when I ask for "#fff1f2" then it should be replaced with "$danger50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ffe4e6" is "$danger100", so when I ask for "#ffe4e6" then it should be replaced with "$danger100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fecdd3" is "$danger200", so when I ask for "#fecdd3" then it should be replaced with "$danger200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fda4af" is "$danger300", so when I ask for "#fda4af" then it should be replaced with "$danger300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fb7185" is "$danger400", so when I ask for "#fb7185" then it should be replaced with "$danger400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f43f5e" is "$danger500", so when I ask for "#f43f5e" then it should be replaced with "$danger500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e11d48" is "$danger600", so when I ask for "#e11d48" then it should be replaced with "$danger600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#be123c" is "$danger700", so when I ask for "#be123c" then it should be replaced with "$danger700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9f1239" is "$danger800", so when I ask for "#9f1239" then it should be replaced with "$danger800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#881337" is "$danger900", so when I ask for "#881337" then it should be replaced with "$danger900" and it works vice-versa if and only if you specifically for hex color code
- color "error" ranges from error50 to error900
- gluestack ui tokens color for "#fef2f2" is "$error50", so when I ask for "#fef2f2" then it should be replaced with "$error50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fee2e2" is "$error100", so when I ask for "#fee2e2" then it should be replaced with "$error100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fecaca" is "$error200", so when I ask for "#fecaca" then it should be replaced with "$error200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fca5a5" is "$error300", so when I ask for "#fca5a5" then it should be replaced with "$error300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f87171" is "$error400", so when I ask for "#f87171" then it should be replaced with "$error400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ef4444" is "$error500", so when I ask for "#ef4444" then it should be replaced with "$error500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dc2626" is "$error600", so when I ask for "#dc2626" then it should be replaced with "$error600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#b91c1c" is "$error700", so when I ask for "#b91c1c" then it should be replaced with "$error700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#991b1b" is "$error800", so when I ask for "#991b1b" then it should be replaced with "$error800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7f1d1d" is "$error900", so when I ask for "#7f1d1d" then it should be replaced with "$error900" and it works vice-versa if and only if you specifically for hex color code
- color "success" ranges from success50 to success900
- gluestack ui tokens color for "#f0fdf4" is "$success50", so when I ask for "#f0fdf4" then it should be replaced with "$success50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dcfce7" is "$success100", so when I ask for "#dcfce7" then it should be replaced with "$success100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#bbf7d0" is "$success200", so when I ask for "#bbf7d0" then it should be replaced with "$success200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#86efac" is "$success300", so when I ask for "#86efac" then it should be replaced with "$success300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4ade80" is "$success400", so when I ask for "#4ade80" then it should be replaced with "$success400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#22c55e" is "$success500", so when I ask for "#22c55e" then it should be replaced with "$success500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#16a34a" is "$success600", so when I ask for "#16a34a" then it should be replaced with "$success600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#15803d" is "$success700", so when I ask for "#15803d" then it should be replaced with "$success700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#166534" is "$success800", so when I ask for "#166534" then it should be replaced with "$success800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#14532d" is "$success900", so when I ask for "#14532d" then it should be replaced with "$success900" and it works vice-versa if and only if you specifically for hex color code
- color "warning" ranges from warning50 to warning900
- gluestack ui tokens color for "#fff7ed" is "$warning50", so when I ask for "#fff7ed" then it should be replaced with "$warning50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ffedd5" is "$warning100", so when I ask for "#ffedd5" then it should be replaced with "$warning100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fed7aa" is "$warning200", so when I ask for "#fed7aa" then it should be replaced with "$warning200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fdba74" is "$warning300", so when I ask for "#fdba74" then it should be replaced with "$warning300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#fb923c" is "$warning400", so when I ask for "#fb923c" then it should be replaced with "$warning400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f97316" is "$warning500", so when I ask for "#f97316" then it should be replaced with "$warning500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#ea580c" is "$warning600", so when I ask for "#ea580c" then it should be replaced with "$warning600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#c2410c" is "$warning700", so when I ask for "#c2410c" then it should be replaced with "$warning700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9a3412" is "$warning800", so when I ask for "#9a3412" then it should be replaced with "$warning800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7c2d12" is "$warning900", so when I ask for "#7c2d12" then it should be replaced with "$warning900" and it works vice-versa if and only if you specifically for hex color code
- color "muted" ranges from muted50 to muted900
- gluestack ui tokens color for "#fafafa" is "$muted50", so when I ask for "#fafafa" then it should be replaced with "$muted50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f5" is "$muted100", so when I ask for "#f5f5f5" then it should be replaced with "$muted100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e5e5" is "$muted200", so when I ask for "#e5e5e5" then it should be replaced with "$muted200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d4" is "$muted300", so when I ask for "#d4d4d4" then it should be replaced with "$muted300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a3a3a3" is "$muted400", so when I ask for "#a3a3a3" then it should be replaced with "$muted400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#737373" is "$muted500", so when I ask for "#737373" then it should be replaced with "$muted500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#525252" is "$muted600", so when I ask for "#525252" then it should be replaced with "$muted600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#404040" is "$muted700", so when I ask for "#404040" then it should be replaced with "$muted700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#262626" is "$muted800", so when I ask for "#262626" then it should be replaced with "$muted800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#171717" is "$muted900", so when I ask for "#171717" then it should be replaced with "$muted900" and it works vice-versa if and only if you specifically for hex color code
- color "info" ranges from info50 to info900
- gluestack ui tokens color for "#f0f9ff" is "$info50", so when I ask for "#f0f9ff" then it should be replaced with "$info50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e0f2fe" is "$info100", so when I ask for "#e0f2fe" then it should be replaced with "$info100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#bae6fd" is "$info200", so when I ask for "#bae6fd" then it should be replaced with "$info200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7dd3fc" is "$info300", so when I ask for "#7dd3fc" then it should be replaced with "$info300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#38bdf8" is "$info400", so when I ask for "#38bdf8" then it should be replaced with "$info400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0ea5e9" is "$info500", so when I ask for "#0ea5e9" then it should be replaced with "$info500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0284c7" is "$info600", so when I ask for "#0284c7" then it should be replaced with "$info600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0369a1" is "$info700", so when I ask for "#0369a1" then it should be replaced with "$info700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#075985" is "$info800", so when I ask for "#075985" then it should be replaced with "$info800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0c4a6e" is "$info900", so when I ask for "#0c4a6e" then it should be replaced with "$info900" and it works vice-versa if and only if you specifically for hex color code
- color "light" ranges from light50 to light900
- gluestack ui tokens color for "#fafaf9" is "$light50", so when I ask for "#fafaf9" then it should be replaced with "$light50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f4" is "$light100", so when I ask for "#f5f5f4" then it should be replaced with "$light100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e7e5e4" is "$light200", so when I ask for "#e7e5e4" then it should be replaced with "$light200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d6d3d1" is "$light300", so when I ask for "#d6d3d1" then it should be replaced with "$light300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a8a29e" is "$light400", so when I ask for "#a8a29e" then it should be replaced with "$light400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#78716c" is "$light500", so when I ask for "#78716c" then it should be replaced with "$light500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#57534e" is "$light600", so when I ask for "#57534e" then it should be replaced with "$light600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#44403c" is "$light700", so when I ask for "#44403c" then it should be replaced with "$light700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#292524" is "$light800", so when I ask for "#292524" then it should be replaced with "$light800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1c1917" is "$light900", so when I ask for "#1c1917" then it should be replaced with "$light900" and it works vice-versa if and only if you specifically for hex color code
- color "textDark" ranges from textDark0 to textDark950
- gluestack ui tokens color for "#ffffff" is "$textDark0", so when I ask for "#ffffff" then it should be replaced with "$textDark0" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f9fafb" is "$textDark50", so when I ask for "#f9fafb" then it should be replaced with "$textDark50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f3f4f6" is "$textDark100", so when I ask for "#f3f4f6" then it should be replaced with "$textDark100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e7eb" is "$textDark200", so when I ask for "#e5e7eb" then it should be replaced with "$textDark200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d1d5db" is "$textDark300", so when I ask for "#d1d5db" then it should be replaced with "$textDark300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9ca3af" is "$textDark400", so when I ask for "#9ca3af" then it should be replaced with "$textDark400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#6b7280" is "$textDark500", so when I ask for "#6b7280" then it should be replaced with "$textDark500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4b5563" is "$textDark600", so when I ask for "#4b5563" then it should be replaced with "$textDark600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#374151" is "$textDark700", so when I ask for "#374151" then it should be replaced with "$textDark700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1f2937" is "$textDark800", so when I ask for "#1f2937" then it should be replaced with "$textDark800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#111827" is "$textDark900", so when I ask for "#111827" then it should be replaced with "$textDark900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#090c14" is "$textDark950", so when I ask for "#090c14" then it should be replaced with "$textDark950" and it works vice-versa if and only if you specifically for hex color code
- color "textLight" ranges from textLight50 to textLight950
- gluestack ui tokens color for "#ffffff" is "$textLight0", so when I ask for "#ffffff" then it should be replaced with "$textLight0" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f9fafb" is "$textLight50", so when I ask for "#f9fafb" then it should be replaced with "$textLight50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e5e5" is "$textLight100", so when I ask for "#e5e5e5" then it should be replaced with "$textLight100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e7eb" is "$textLight200", so when I ask for "#e5e7eb" then it should be replaced with "$textLight200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d1d5db" is "$textLight300", so when I ask for "#d1d5db" then it should be replaced with "$textLight300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#9ca3af" is "$textLight400", so when I ask for "#9ca3af" then it should be replaced with "$textLight400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#6b7280" is "$textLight500", so when I ask for "#6b7280" then it should be replaced with "$textLight500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4b5563" is "$textLight600", so when I ask for "#4b5563" then it should be replaced with "$textLight600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#374151" is "$textLight700", so when I ask for "#374151" then it should be replaced with "$textLight700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1f2937" is "$textLight800", so when I ask for "#1f2937" then it should be replaced with "$textLight800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#111827" is "$textLight900", so when I ask for "#111827" then it should be replaced with "$textLight900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#090c14" is "$textLight950", so when I ask for "#090c14" then it should be replaced with "$textLight950" and it works vice-versa if and only if you specifically for hex color code
- color "borderDark" ranges from borderDark50 to borderDark950
- gluestack ui tokens color for "#fcfcfc" is "$borderDark0", so when I ask for "#fcfcfc" then it should be replaced with "$borderDark0" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f5" is "$borderDark50", so when I ask for "#f5f5f5" then it should be replaced with "$borderDark50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e5e5" is "$borderDark100", so when I ask for "#e5e5e5" then it should be replaced with "$borderDark100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dbdbdb" is "$borderDark200", so when I ask for "#dbdbdb" then it should be replaced with "$borderDark200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d4" is "$borderDark300", so when I ask for "#d4d4d4" then it should be replaced with "$borderDark300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a3a3a3" is "$borderDark400", so when I ask for "#a3a3a3" then it should be replaced with "$borderDark400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#8c8c8c" is "$borderDark500", so when I ask for "#8c8c8c" then it should be replaced with "$borderDark500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#737373" is "$borderDark600", so when I ask for "#737373" then it should be replaced with "$borderDark600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#525252" is "$borderDark700", so when I ask for "#525252" then it should be replaced with "$borderDark700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#404040" is "$borderDark800", so when I ask for "#404040" then it should be replaced with "$borderDark800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#262626" is "$borderDark900", so when I ask for "#262626" then it should be replaced with "$borderDark900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#171717" is "$borderDark950", so when I ask for "#171717" then it should be replaced with "$borderDark950" and it works vice-versa if and only if you specifically for hex color code
- color "borderLight" ranges from borderLight0 to borderLight950
- gluestack ui tokens color for "#fcfcfc" is "$borderLight0", so when I ask for "#fcfcfc" then it should be replaced with "$borderLight0" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f5" is "$borderLight50", so when I ask for "#f5f5f5" then it should be replaced with "$borderLight50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e5e5" is "$borderLight100", so when I ask for "#e5e5e5" then it should be replaced with "$borderLight100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dbdbdb" is "$borderLight200", so when I ask for "#dbdbdb" then it should be replaced with "$borderLight200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d4" is "$borderLight300", so when I ask for "#d4d4d4" then it should be replaced with "$borderLight300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a3a3a3" is "$borderLight400", so when I ask for "#a3a3a3" then it should be replaced with "$borderLight400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#8c8c8c" is "$borderLight500", so when I ask for "#8c8c8c" then it should be replaced with "$borderLight500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#737373" is "$borderLight600", so when I ask for "#737373" then it should be replaced with "$borderLight600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#525252" is "$borderLight700", so when I ask for "#525252" then it should be replaced with "$borderLight700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#404040" is "$borderLight800", so when I ask for "#404040" then it should be replaced with "$borderLight800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#262626" is "$borderLight900", so when I ask for "#262626" then it should be replaced with "$borderLight900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#171717" is "$borderLight950", so when I ask for "#171717" then it should be replaced with "$borderLight950" and it works vice-versa if and only if you specifically for hex color code
- color "backgroundDark" ranges from backgroundDark0 to backgroundDark950
- gluestack ui tokens color for "#fcfcfc" is "$backgroundDark0", so when I ask for "#fcfcfc" then it should be replaced with "$backgroundDark0" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f5" is "$backgroundDark50", so when I ask for "#f5f5f5" then it should be replaced with "$backgroundDark50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e5e5" is "$backgroundDark100", so when I ask for "#e5e5e5" then it should be replaced with "$backgroundDark100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dbdbdb" is "$backgroundDark200", so when I ask for "#dbdbdb" then it should be replaced with "$backgroundDark200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d4" is "$backgroundDark300", so when I ask for "#d4d4d4" then it should be replaced with "$backgroundDark300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a3a3a3" is "$backgroundDark400", so when I ask for "#a3a3a3" then it should be replaced with "$backgroundDark400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#8c8c8c" is "$backgroundDark500", so when I ask for "#8c8c8c" then it should be replaced with "$backgroundDark500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#737373" is "$backgroundDark600", so when I ask for "#737373" then it should be replaced with "$backgroundDark600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#525252" is "$backgroundDark700", so when I ask for "#525252" then it should be replaced with "$backgroundDark700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#404040" is "$backgroundDark800", so when I ask for "#404040" then it should be replaced with "$backgroundDark800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#262626" is "$backgroundDark900", so when I ask for "#262626" then it should be replaced with "$backgroundDark900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#171717" is "$backgroundDark950", so when I ask for "#171717" then it should be replaced with "$backgroundDark950" and it works vice-versa if and only if you specifically for hex color code
- color "backgroundLight" ranges from backgroundLight0 to backgroundLight950
- gluestack ui tokens color for "#fcfcfc" is "$backgroundLight0", so when I ask for "#fcfcfc" then it should be replaced with "$backgroundLight0" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#f5f5f5" is "$backgroundLight50", so when I ask for "#f5f5f5" then it should be replaced with "$backgroundLight50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#e5e5e5" is "$backgroundLight100", so when I ask for "#e5e5e5" then it should be replaced with "$backgroundLight100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#dbdbdb" is "$backgroundLight200", so when I ask for "#dbdbdb" then it should be replaced with "$backgroundLight200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#d4d4d4" is "$backgroundLight300", so when I ask for "#d4d4d4" then it should be replaced with "$backgroundLight300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#a3a3a3" is "$backgroundLight400", so when I ask for "#a3a3a3" then it should be replaced with "$backgroundLight400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#8c8c8c" is "$backgroundLight500", so when I ask for "#8c8c8c" then it should be replaced with "$backgroundLight500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#737373" is "$backgroundLight600", so when I ask for "#737373" then it should be replaced with "$backgroundLight600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#525252" is "$backgroundLight700", so when I ask for "#525252" then it should be replaced with "$backgroundLight700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#404040" is "$backgroundLight800", so when I ask for "#404040" then it should be replaced with "$backgroundLight800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#262626" is "$backgroundLight900", so when I ask for "#262626" then it should be replaced with "$backgroundLight900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#171717" is "$backgroundLight950", so when I ask for "#171717" then it should be replaced with "$backgroundLight950" and it works vice-versa if and only if you specifically for hex color code

- color "primary" ranges from primary0 to primary950
- gluestack ui tokens color for "#e5f1fb" is "$primary0", so when I ask for "#e5f1fb" then it should be replaced with "$primary0" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#cce9ff" is "$primary50", so when I ask for "#cce9ff" then it should be replaced with "$primary50" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#addbff" is "$primary100", so when I ask for "#addbff" then it should be replaced with "$primary100" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#7cc2ff" is "$primary200", so when I ask for "#7cc2ff" then it should be replaced with "$primary200" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#4aa9ff" is "$primary300", so when I ask for "#4aa9ff" then it should be replaced with "$primary300" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#1a91ff" is "$primary400", so when I ask for "#1a91ff" then it should be replaced with "$primary400" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#0077e6" is "$primary500", so when I ask for "#0077e6" then it should be replaced with "$primary500" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#005db4" is "$primary600", so when I ask for "#005db4" then it should be replaced with "$primary600" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#004282" is "$primary700", so when I ask for "#004282" then it should be replaced with "$primary700" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#002851" is "$primary800", so when I ask for "#002851" then it should be replaced with "$primary800" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#011838" is "$primary900", so when I ask for "#011838" then it should be replaced with "$primary900" and it works vice-versa if and only if you specifically for hex color code
- gluestack ui tokens color for "#000711" is "$primary950", so when I ask for "#000711" then it should be replaced with "$primary950"

- Each color has a name (e.g. rose50, pink100, blue500) and a corresponding hex value (e.g. #fff1f2, #fce7f3, #3b82f6)
- The hex values represent the red, green, and blue components of the color in hexadecimal format
- Gluestack ui token colors are always used starting with $

For example,
- color code #000711 is mapped with the code primary950
- color code #22c55e is mapped with the code success500
- color code #f0f9ff is mapped with the code lightBlue50

Some examples:
1. If I want box to have `background color` as `#f0fdfa`, I will write something like <Box bg="$teal50"></Box>. Since `teal50` color is mapped to `gluestackUITokensColors` this value `#f0fdfa`.
2. If I want box to have border color as `#e5f1fb`, I will write something like <Box borderColor="$primary0"></Box>. Since `primary0` color is mapped to `gluestackUITokensColors` this value `#e5f1fb`.
3. If I want text to have color as `#f0f9ff`, I will write something like <Text color="$info50"></Text>. Since `primary0` color is mapped to `gluestackUITokensColors` this value `#f0f9ff`.
