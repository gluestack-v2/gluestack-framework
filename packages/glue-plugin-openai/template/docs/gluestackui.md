I am building gluestack-ui, a component library for React Native.

I have a Box component that accepts utility props from the below list called gluestackUIPropertyKeyMap which is mapped to react native style properties.

These are the only acceptable utility props -

`gap`, `gridGap`, `columnGap`, `gridColumnGap`, `rowGap`, `gridRowGap`, `inset`, `insetBlock`, `insetBlockEnd`, `insetBlockStart`, `insetInline`, `insetInlineEnd`, `insetInlineStart`, `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `marginBlock`, `marginBlockEnd`, `marginBlockStart`, `marginInline`, `marginInlineEnd`, `marginInlineStart`, `marginHorizontal`, `marginVertical`, `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `paddingBlock`, `paddingBlockEnd`, `paddingBlockStart`, `paddingInline`, `paddingInlineEnd`, `paddingInlineStart`, `paddingHorizontal`, `paddingVertical`, `paddingStart`, `paddingEnd`, ` top`, `right`, `bottom`, `left`, `scrollMargin`, `scrollMarginTop`, `scrollMarginRight`, `scrollMarginBottom`, `scrollMarginLeft`, `scrollMarginX`, `scrollMarginY`, `scrollMarginBlock`, `scrollMarginBlockEnd`, `scrollMarginBlockStart`, `scrollMarginInline`, `scrollMarginInlineEnd`, `scrollMarginInlineStart`, `scrollPadding`, `scrollPaddingTop`, `scrollPaddingRight`, `scrollPaddingBottom`, `scrollPaddingLeft`, `scrollPaddingX`, `scrollPaddingY`, `scrollPaddingBlock`, `scrollPaddingBlockEnd`, `scrollPaddingBlockStart`, `scrollPaddingInline`, `scrollPaddingInlineEnd`, `scrollPaddingInlineStart`, `shadowRadius`, `elevation`, `fontSize`, `background`, `backgroundColor`, `backgroundImage`, `borderImage`, `border`, `borderBlock`, `borderBlockEnd`, `borderBlockStart`, `borderBottom`, `borderBottomColor`, `borderColor`, `borderInline`, `borderInlineEnd`, `borderInlineStart`, `borderLeft`, `borderLeftColor`, `borderRight`, `borderRightColor`, `borderTop`, `borderTopColor`, `caretColor`, `color`, `columnRuleColor`, `fill`, `outline`, `outlineColor`, `stroke`, `textDecorationColor`, ` shadowOpacity`, `condition`, `fontFamily`, `fontWeight`, `lineHeight`, `letterSpacing`, `blockSize`, `minBlockSize`, `maxBlockSize`, `inlineSize`, `minInlineSize`, `maxInlineSize`, `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`, `flexBasis`, `gridTemplateColumns`, `gridTemplateRows`, `borderWidth`, `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth`, `borderStyle`, `borderTopStyle`, `borderRightStyle`, `borderBottomStyle`, `borderLeftStyle`, `borderRadius`, `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomRightRadius`, `borderBottomLeftRadius`, `boxShadow`, `textShadow`, `transition`, `zIndex`.

Some examples:

1. A box with blue background: <Box backgroundColor="$blue500" />
2. Two boxes nested: <Box padding="$1"><Box padding="$2"></Box></Box>
3. A box with some margin and backgroundColor: <Box marginTop="$1" backgroundColor="$red500" />

Below's how each property is mapped to the gluestackUIPropertyKeyMap -

- property `gap` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `gridGap` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `columnGap` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `gridColumnGap` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `rowGap` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `gridRowGap` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `inset` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `insetBlock` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `insetBlockEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `insetBlockStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `insetInline` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `insetInlineEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `insetInlineStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `margin` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginTop` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginRight` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginBottom` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginLeft` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginBlock` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginBlockEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginBlockStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginInline` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginInlineEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginInlineStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginHorizontal` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `marginVertical` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `padding` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingTop` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingRight` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingBottom` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingLeft` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingBlock` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingBlockEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingBlockStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingInline` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingInlineEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingInlineStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingHorizontal` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingVertical` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `paddingEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `top` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `right` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `bottom` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `left` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMargin` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginTop` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginRight` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginBottom` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginLeft` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginX` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginY` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginBlock` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginBlockEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginBlockStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginInline` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginInlineEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollMarginInlineStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPadding` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingTop` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingRight` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingBottom` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingLeft` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingX` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingY` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingBlock` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingBlockEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingBlockStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingInline` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingInlineEnd` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `scrollPaddingInlineStart` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `shadowOffset` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `shadowRadius` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `elevation` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `fontSize` is mapped to token of gluestackUIPropertyKeyMap value `fontSizes`
- property `background` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `backgroundColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `backgroundImage` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderImage` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `border` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderBlock` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderBlockEnd` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderBlockStart` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderBottom` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderBottomColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderInline` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderInlineEnd` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderInlineStart` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderLeft` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderLeftColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderRight` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderRightColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderTop` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `borderTopColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `caretColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `color` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `columnRuleColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `fill` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `outline` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `outlineColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `stroke` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `textDecorationColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `shadowColor` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `shadowOpacity` is mapped to token of gluestackUIPropertyKeyMap value `opacity`
- property `shadow` is mapped to token of gluestackUIPropertyKeyMap value `shadows`
- property `condition` is mapped to token of gluestackUIPropertyKeyMap value `mediaQueries`
- property `fontFamily` is mapped to token of gluestackUIPropertyKeyMap value `fonts`
- property `fontWeight` is mapped to token of gluestackUIPropertyKeyMap value `fontWeights`
- property `lineHeight` is mapped to token of gluestackUIPropertyKeyMap value `lineHeights`
- property `letterSpacing` is mapped to token of gluestackUIPropertyKeyMap value `letterSpacings`
- property `blockSize` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `minBlockSize` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `maxBlockSize` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `inlineSize` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `minInlineSize` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `maxInlineSize` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `width` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `minWidth` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `maxWidth` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `height` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `minHeight` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `maxHeight` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `flexBasis` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `gridTemplateColumns` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `gridTemplateRows` is mapped to token of gluestackUIPropertyKeyMap value `space`
- property `borderWidth` is mapped to token of gluestackUIPropertyKeyMap value `borderWidths`
- property `borderTopWidth` is mapped to token of gluestackUIPropertyKeyMap value `borderWidths`
- property `borderRightWidth` is mapped to token of gluestackUIPropertyKeyMap value `borderWidths`
- property `borderBottomWidth` is mapped to token of gluestackUIPropertyKeyMap value `borderWidths`
- property `borderLeftWidth` is mapped to token of gluestackUIPropertyKeyMap value `borderWidths`
- property `borderStyle` is mapped to token of gluestackUIPropertyKeyMap value `borderStyles`
- property `borderTopStyle` is mapped to token of gluestackUIPropertyKeyMap value `borderStyles`
- property `borderRightStyle` is mapped to token of gluestackUIPropertyKeyMap value `borderStyles`
- property `borderBottomStyle` is mapped to token of gluestackUIPropertyKeyMap value `borderStyles`
- property `borderLeftStyle` is mapped to token of gluestackUIPropertyKeyMap value `borderStyles`
- property `borderRadius` is mapped to token of gluestackUIPropertyKeyMap value `radii`
- property `borderTopLeftRadius` is mapped to token of gluestackUIPropertyKeyMap value `radii`
- property `borderTopRightRadius` is mapped to token of gluestackUIPropertyKeyMap value `radii`
- property `borderBottomRightRadius` is mapped to token of gluestackUIPropertyKeyMap value `radii`
- property `borderBottomLeftRadius` is mapped to token of gluestackUIPropertyKeyMap value `radii`
- property `boxShadow` is mapped to token of gluestackUIPropertyKeyMap value `colors`
- property `textShadow` is mapped to token of gluestackUIPropertyKeyMap value `shadows`
- property `transition` is mapped to token of gluestackUIPropertyKeyMap value `transitions`
- property `zIndex` is mapped to token of gluestackUIPropertyKeyMap value `zIndices`

Aliases allow you to give a shorthand name to a theme token or configuration value, making it easier to reference them in your code.
To use aliases. Below is the full list of available aliases with alias name and the corresponding utility props from gluestackUIPropertyKeyMap -

- `bg` is an alias for `backgroundColor`
- `bgColor` is an alias for `backgroundColor`
- `color` is an alias for `color`
- `borderColor` is an alias for `borderColor`
- `shadowColor` is an alias for `shadowColor`
- `shadowOffset` is an alias for `shadowOffset`
- `shadowOpacity` is an alias for `shadowOpacity`
- `shadowRadius` is an alias for `shadowRadius`
- `elevation` is an alias for `elevation`
- `h` is an alias for `height`
- `w` is an alias for `width`
- `p` is an alias for `padding`
- `px` is an alias for `paddingHorizontal`
- `xyx_py` is an alias for `paddingVertical`
- `pt` is an alias for `paddingTop`
- `pb` is an alias for `paddingBottom`
- `pr` is an alias for `paddingRight`
- `pl` is an alias for `paddingLeft`
- `m` is an alias for `margin`
- `mx` is an alias for `marginHorizontal`
- `my` is an alias for `marginVertical`
- `mt` is an alias for `marginTop`
- `mb` is an alias for `marginBottom`
- `mr` is an alias for `marginRight`
- `ml` is an alias for `marginLeft`
- `borderWidth` is an alias for `borderWidth`
- `borderRadius` is an alias for `borderRadius`
- `borderTopLeftRadius` is an alias for `borderTopLeftRadius`
- `borderTopRightRadius` is an alias for `borderTopRightRadius`
- `rounded` is an alias for `borderRadius`
- `letterSpacing` is an alias for `letterSpacing`
- `lineHeight` is an alias for `lineHeight`
- `fontWeight` is an alias for `fontWeight`
- `fontFamily` is an alias for `fontFamily`
- `fontSize` is an alias for `fontSize`
- `shadow` is an alias for `shadow`
- `condition` is an alias for `condition`

Some examples:

1. A Box component with margin top `16`: <Box mt="$4" />, is correct using tokens and aliases
2. A Box component with padding bottom `24`: <Box pb="$6" />, is correct using tokens and aliases

Design tokens are a set of design values that are abstracted from the visual elements of a user interface, such as colors, typography like fonts, font size, line height, letter spacing, font weight etc, spacing, border widths, border radius etc. They are a way to define and manage the styles and design of an application or website in a more structured and scalable way.

Below are the available `colors tokens` & should be applied to all kinds of props and it's aliases like `backgroundColor`, `color`,
`backgroundImage`, `borderImage`, `border`, `borderBlock`, `borderBlockEnd`, `borderBlockStart`, `borderBottom`, `borderBottomColor`, `borderColor`, `borderInline`, `borderInlineEnd`, `borderInlineStart`, `borderLeft`, `borderLeftColor`, `borderRight`, `borderRightColor`, `borderTop`, `borderTopColor` and many other props from property tokens which accepts `colors tokens`, also to use these tokens you will need to prefix it with `$` -

- `rose50` is mapped to color '#fff1f2',
- `rose100` is mapped to color '#ffe4e6',
- `rose200` is mapped to color '#fecdd3',
- `rose300` is mapped to color '#fda4af',
- `rose400` is mapped to color '#fb7185',
- `rose500` is mapped to color '#f43f5e',
- `rose600` is mapped to color '#e11d48',
- `rose700` is mapped to color '#be123c',
- `rose800` is mapped to color '#9f1239',
- `rose900` is mapped to color '#881337',
- `pink50` is mapped to color '#fdf2f8'
- `pink100` is mapped to color '#fce7f3'
- `pink200` is mapped to color '#fbcfe8'
- `pink300` is mapped to color '#f9a8d4'
- `pink400` is mapped to color '#f472b6'
- `pink500` is mapped to color '#ec4899'
- `pink600` is mapped to color '#db2777'
- `pink700` is mapped to color '#be185d'
- `pink800` is mapped to color '#9d174d'
- `pink900` is mapped to color '#831843'
- `fuchsia50` is mapped to color '#fdf4ff'
- `fuchsia100` is mapped to color '#fae8ff'
- `fuchsia200` is mapped to color '#f5d0fe'
- `fuchsia300` is mapped to color '#f0abfc'
- `fuchsia400` is mapped to color '#e879f9'
- `fuchsia500` is mapped to color '#d946ef'
- `fuchsia600` is mapped to color '#c026d3'
- `fuchsia700` is mapped to color '#a21caf'
- `fuchsia800` is mapped to color '#86198f'
- `fuchsia900` is mapped to color '#701a75'
- `purple50` is mapped to color '#faf5ff'
- `purple100` is mapped to color '#f3e8ff'
- `purple200` is mapped to color '#e9d5ff'
- `purple300` is mapped to color '#d8b4fe'
- `purple400` is mapped to color '#c084fc'
- `purple500` is mapped to color '#a855f7'
- `purple600` is mapped to color '#9333ea'
- `purple700` is mapped to color '#7e22ce'
- `purple800` is mapped to color '#6b21a8'
- `purple900` is mapped to color '#581c87'
- `violet50` is mapped to color '#f5f3ff'
- `violet100` is mapped to color '#ede9fe'
- `violet200` is mapped to color '#ddd6fe'
- `violet300` is mapped to color '#c4b5fd'
- `violet400` is mapped to color '#a78bfa'
- `violet500` is mapped to color '#8b5cf6'
- `violet600` is mapped to color '#7c3aed'
- `violet700` is mapped to color '#6d28d9'
- `violet800` is mapped to color '#5b21b6'
- `violet900` is mapped to color '#4c1d95'
- `indigo50` is mapped to color '#eef2ff'
- `indigo100` is mapped to color '#e0e7ff'
- `indigo200` is mapped to color '#c7d2fe'
- `indigo300` is mapped to color '#a5b4fc'
- `indigo400` is mapped to color '#818cf8'
- `indigo500` is mapped to color '#6366f1'
- `indigo600` is mapped to color '#4f46e5'
- `indigo700` is mapped to color '#4338ca'
- `indigo800` is mapped to color '#3730a3'
- `indigo900` is mapped to color '#312e81'
- `blue50` is mapped to color '#eff6ff'
- `blue100` is mapped to color '#dbeafe'
- `blue200` is mapped to color '#bfdbfe'
- `blue300` is mapped to color '#93c5fd'
- `blue400` is mapped to color '#60a5fa'
- `blue500` is mapped to color '#3b82f6'
- `blue600` is mapped to color '#2563eb'
- `blue600_alpha10` is mapped to color '#06b6d41a'
- `blue600_alpha20` is mapped to color '#06b6d433'
- `blue700` is mapped to color '#1d4ed8'
- `blue800` is mapped to color '#1e40af'
- `blue900` is mapped to color '#1e3a8a'
- `lightBlue50` is mapped to color '#f0f9ff'
- `lightBlue100` is mapped to color '#e0f2fe'
- `lightBlue200` is mapped to color '#bae6fd'
- `lightBlue300` is mapped to color '#7dd3fc'
- `lightBlue400` is mapped to color '#38bdf8'
- `lightBlue500` is mapped to color '#0ea5e9'
- `lightBlue600` is mapped to color '#0284c7'
- `lightBlue700` is mapped to color '#0369a1'
- `lightBlue800` is mapped to color '#075985'
- `lightBlue900` is mapped to color '#0c4a6e'
- `darkBlue50` is mapped to color '#dbf4ff'
- `darkBlue100` is mapped to color '#addbff'
- `darkBlue200` is mapped to color '#7cc2ff'
- `darkBlue300` is mapped to color '#4aa9ff'
- `darkBlue400` is mapped to color '#1a91ff'
- `darkBlue500` is mapped to color '#0077e6'
- `darkBlue600` is mapped to color '#005db4'
- `darkBlue700` is mapped to color '#004282'
- `darkBlue800` is mapped to color '#002851'
- `darkBlue900` is mapped to color '#000e21'
- `cyan50` is mapped to color '#ecfeff'
- `cyan100` is mapped to color '#cffafe'
- `cyan200` is mapped to color '#a5f3fc'
- `cyan300` is mapped to color '#67e8f9'
- `cyan400` is mapped to color '#22d3ee'
- `cyan500` is mapped to color '#06b6d4'
- `cyan600` is mapped to color '#0891b2'
- `cyan700` is mapped to color '#0e7490'
- `cyan800` is mapped to color '#155e75'
- `cyan900` is mapped to color '#164e63'
- `teal50` is mapped to color '#f0fdfa'
- `teal100` is mapped to color '#ccfbf1'
- `teal200` is mapped to color '#99f6e4'
- `teal300` is mapped to color '#5eead4'
- `teal400` is mapped to color '#2dd4bf'
- `teal500` is mapped to color '#14b8a6'
- `teal600` is mapped to color '#0d9488'
- `teal700` is mapped to color '#0f766e'
- `teal800` is mapped to color '#115e59'
- `teal900` is mapped to color '#134e4a'
- `emerald50` is mapped to color '#ecfdf5'
- `emerald100` is mapped to color '#d1fae5'
- `emerald200` is mapped to color '#a7f3d0'
- `emerald300` is mapped to color '#6ee7b7'
- `emerald400` is mapped to color '#34d399'
- `emerald500` is mapped to color '#10b981'
- `emerald600` is mapped to color '#059669'
- `emerald700` is mapped to color '#047857'
- `emerald800` is mapped to color '#065f46'
- `emerald900` is mapped to color '#064e3b'
- `green50` is mapped to color '#f0fdf4'
- `green100` is mapped to color '#dcfce7'
- `green200` is mapped to color '#bbf7d0'
- `green300` is mapped to color '#86efac'
- `green400` is mapped to color '#4ade80'
- `green500` is mapped to color '#22c55e'
- `green600` is mapped to color '#16a34a'
- `green700` is mapped to color '#15803d'
- `green800` is mapped to color '#166534'
- `green900` is mapped to color '#14532d'
- `lime50` is mapped to color '#f7fee7'
- `lime100` is mapped to color '#ecfccb'
- `lime200` is mapped to color '#d9f99d'
- `lime300` is mapped to color '#bef264'
- `lime400` is mapped to color '#a3e635'
- `lime500` is mapped to color '#84cc16'
- `lime600` is mapped to color '#65a30d'
- `lime700` is mapped to color '#4d7c0f'
- `lime800` is mapped to color '#3f6212'
- `lime900` is mapped to color '#365314'
- `yellow50` is mapped to color '#fefce8'
- `yellow100` is mapped to color '#fef9c3'
- `yellow200` is mapped to color '#fef08a'
- `yellow300` is mapped to color '#fde047'
- `yellow400` is mapped to color '#facc15'
- `yellow500` is mapped to color '#eab308'
- `yellow600` is mapped to color '#ca8a04'
- `yellow700` is mapped to color '#a16207'
- `yellow800` is mapped to color '#854d0e'
- `yellow900` is mapped to color '#713f12'
- `amber50` is mapped to color '#fffbeb'
- `amber100` is mapped to color '#fef3c7'
- `amber200` is mapped to color '#fde68a'
- `amber300` is mapped to color '#fcd34d'
- `amber400` is mapped to color '#fbbf24'
- `amber500` is mapped to color '#f59e0b'
- `amber600` is mapped to color '#d97706'
- `amber700` is mapped to color '#b45309'
- `amber800` is mapped to color '#92400e'
- `amber900` is mapped to color '#78350f'
- `orange50` is mapped to color '#fff7ed'
- `orange100` is mapped to color '#ffedd5'
- `orange200` is mapped to color '#fed7aa'
- `orange300` is mapped to color '#fdba74'
- `orange400` is mapped to color '#fb923c'
- `orange500` is mapped to color '#f97316'
- `orange600` is mapped to color '#ea580c'
- `orange700` is mapped to color '#c2410c'
- `orange800` is mapped to color '#9a3412'
- `orange900` is mapped to color '#7c2d12'
- `red50` is mapped to color '#fef2f2'
- `red100` is mapped to color '#fee2e2'
- `red200` is mapped to color '#fecaca'
- `red300` is mapped to color '#fca5a5'
- `red400` is mapped to color '#f87171'
- `red500` is mapped to color '#ef4444'
- `red600` is mapped to color '#dc2626'
- `red700` is mapped to color '#b91c1c'
- `red800` is mapped to color '#991b1b'
- `red900` is mapped to color '#7f1d1d'
- `warmGray50` is mapped to color '#fafaf9'
- `warmGray100` is mapped to color '#f5f5f4'
- `warmGray200` is mapped to color '#e7e5e4'
- `warmGray300` is mapped to color '#d6d3d1'
- `warmGray400` is mapped to color '#a8a29e'
- `warmGray500` is mapped to color '#78716c'
- `warmGray600` is mapped to color '#57534e'
- `warmGray700` is mapped to color '#44403c'
- `warmGray800` is mapped to color '#292524'
- `warmGray900` is mapped to color '#1c1917'
- `trueGray50` is mapped to color '#fafafa'
- `trueGray100` is mapped to color '#f5f5f5'
- `trueGray200` is mapped to color '#e5e5e5'
- `trueGray300` is mapped to color '#d4d4d4'
- `trueGray400` is mapped to color '#a3a3a3'
- `trueGray500` is mapped to color '#737373'
- `trueGray600` is mapped to color '#525252'
- `trueGray700` is mapped to color '#404040'
- `trueGray800` is mapped to color '#262626'
- `trueGray900` is mapped to color '#171717'
- `gray50` is mapped to color '#fafafa'
- `gray100` is mapped to color '#f4f4f5'
- `gray200` is mapped to color '#e4e4e7'
- `gray300` is mapped to color '#d4d4d8'
- `gray400` is mapped to color '#a1a1aa'
- `gray500` is mapped to color '#71717a'
- `gray600` is mapped to color '#52525b'
- `gray700` is mapped to color '#3f3f46'
- `gray800` is mapped to color '#27272a'
- `gray900` is mapped to color '#18181b'
- `coolGray50` is mapped to color '#f9fafb'
- `coolGray100` is mapped to color '#f3f4f6'
- `coolGray200` is mapped to color '#e5e7eb'
- `coolGray300` is mapped to color '#d1d5db'
- `coolGray400` is mapped to color '#9ca3af'
- `coolGray500` is mapped to color '#6b7280'
- `coolGray600` is mapped to color '#4b5563'
- `coolGray700` is mapped to color '#374151'
- `coolGray800` is mapped to color '#1f2937'
- `coolGray900` is mapped to color '#111827'
- `blueGray50` is mapped to color '#f8fafc'
- `blueGray100` is mapped to color '#f1f5f9'
- `blueGray200` is mapped to color '#e2e8f0'
- `blueGray300` is mapped to color '#cbd5e1'
- `blueGray400` is mapped to color '#94a3b8'
- `blueGray500` is mapped to color '#64748b'
- `blueGray600` is mapped to color '#475569'
- `blueGray700` is mapped to color '#334155'
- `blueGray800` is mapped to color '#1e293b'
- `blueGray900` is mapped to color '#0f172a'
- `dark50` is mapped to color '#18181b'
- `dark100` is mapped to color '#27272a'
- `dark200` is mapped to color '#3f3f46'
- `dark300` is mapped to color '#52525b'
- `dark400` is mapped to color '#71717a'
- `dark500` is mapped to color '#a1a1aa'
- `dark600` is mapped to color '#d4d4d8'
- `dark700` is mapped to color '#e4e4e7'
- `dark800` is mapped to color '#f4f4f5'
- `dark900` is mapped to color '#fafafa'
- `text50` is mapped to color '#fafafa'
- `text100` is mapped to color '#f5f5f5'
- `text200` is mapped to color '#e5e5e5'
- `text300` is mapped to color '#d4d4d4'
- `text400` is mapped to color '#a3a3a3'
- `text500` is mapped to color '#737373'
- `text600` is mapped to color '#525252'
- `text700` is mapped to color '#404040'
- `text800` is mapped to color '#262626'
- `text900` is mapped to color '#171717'
- `white` is mapped to color '#FFFFFF'
- `black` is mapped to color '#000000'
- `lightText` is mapped to color '#FFFFFF'
- `darkText` is mapped to color '#000000'
- `secondary0` is mapped to color '#F8FAFC'
- `secondary50` is mapped to color '#F1F5F9'
- `secondary100` is mapped to color '#E4E9F0'
- `secondary200` is mapped to color '#DBE1E9'
- `secondary300` is mapped to color '#CBD5E1'
- `secondary400` is mapped to color '#B6C3D5'
- `secondary500` is mapped to color '#94A3B8'
- `secondary600` is mapped to color '#64748B'
- `secondary700` is mapped to color '#475569'
- `secondary800` is mapped to color '#334155'
- `secondary900` is mapped to color '#1E293B'
- `secondary950` is mapped to color '#0F172A'
- `tertiary50` is mapped to color '#ecfdf5'
- `tertiary100` is mapped to color '#d1fae5'
- `tertiary200` is mapped to color '#a7f3d0'
- `tertiary300` is mapped to color '#6ee7b7'
- `tertiary400` is mapped to color '#34d399'
- `tertiary500` is mapped to color '#10b981'
- `tertiary600` is mapped to color '#059669'
- `tertiary700` is mapped to color '#047857'
- `tertiary800` is mapped to color '#065f46'
- `tertiary900` is mapped to color '#064e3b'
- `danger50` is mapped to color '#fff1f2'
- `danger100` is mapped to color '#ffe4e6'
- `danger200` is mapped to color '#fecdd3'
- `danger300` is mapped to color '#fda4af'
- `danger400` is mapped to color '#fb7185'
- `danger500` is mapped to color '#f43f5e'
- `danger600` is mapped to color '#e11d48'
- `danger700` is mapped to color '#be123c'
- `danger800` is mapped to color '#9f1239'
- `danger900` is mapped to color '#881337'
- `error50` is mapped to color '#fef2f2'
- `error100` is mapped to color '#fee2e2'
- `error200` is mapped to color '#fecaca'
- `error300` is mapped to color '#fca5a5'
- `error400` is mapped to color '#f87171'
- `error500` is mapped to color '#ef4444'
- `error600` is mapped to color '#dc2626'
- `error700` is mapped to color '#b91c1c'
- `error800` is mapped to color '#991b1b'
- `error900` is mapped to color '#7f1d1d'
- `success50` is mapped to color '#f0fdf4'
- `success100` is mapped to color '#dcfce7'
- `success200` is mapped to color '#bbf7d0'
- `success300` is mapped to color '#86efac'
- `success400` is mapped to color '#4ade80'
- `success500` is mapped to color '#22c55e'
- `success600` is mapped to color '#16a34a'
- `success700` is mapped to color '#15803d'
- `success800` is mapped to color '#166534'
- `success900` is mapped to color '#14532d'
- `warning50` is mapped to color '#fff7ed'
- `warning100` is mapped to color '#ffedd5'
- `warning200` is mapped to color '#fed7aa'
- `warning300` is mapped to color '#fdba74'
- `warning400` is mapped to color '#fb923c'
- `warning500` is mapped to color '#f97316'
- `warning600` is mapped to color '#ea580c'
- `warning700` is mapped to color '#c2410c'
- `warning800` is mapped to color '#9a3412'
- `warning900` is mapped to color '#7c2d12'
- `muted50` is mapped to color '#fafafa'
- `muted100` is mapped to color '#f5f5f5'
- `muted200` is mapped to color '#e5e5e5'
- `muted300` is mapped to color '#d4d4d4'
- `muted400` is mapped to color '#a3a3a3'
- `muted500` is mapped to color '#737373'
- `muted600` is mapped to color '#525252'
- `muted700` is mapped to color '#404040'
- `muted800` is mapped to color '#262626'
- `muted900` is mapped to color '#171717'
- `info50` is mapped to color '#f0f9ff'
- `info100` is mapped to color '#e0f2fe'
- `info200` is mapped to color '#bae6fd'
- `info300` is mapped to color '#7dd3fc'
- `info400` is mapped to color '#38bdf8'
- `info500` is mapped to color '#0ea5e9'
- `info600` is mapped to color '#0284c7'
- `info700` is mapped to color '#0369a1'
- `info800` is mapped to color '#075985'
- `info900` is mapped to color '#0c4a6e'
- `light50` is mapped to color '#fafaf9'
- `light100` is mapped to color '#f5f5f4'
- `light200` is mapped to color '#e7e5e4'
- `light300` is mapped to color '#d6d3d1'
- `light400` is mapped to color '#a8a29e'
- `light500` is mapped to color '#78716c'
- `light600` is mapped to color '#57534e'
- `light700` is mapped to color '#44403c'
- `light800` is mapped to color '#292524'
- `light900` is mapped to color '#1c1917'
- `textDark0` is mapped to color '#ffffff'
- `textDark50` is mapped to color '#f9fafb'
- `textDark100` is mapped to color '#f3f4f6'
- `textDark200` is mapped to color '#e5e7eb'
- `textDark300` is mapped to color '#d1d5db'
- `textDark400` is mapped to color '#9ca3af'
- `textDark500` is mapped to color '#6b7280'
- `textDark600` is mapped to color '#4b5563'
- `textDark700` is mapped to color '#374151'
- `textDark800` is mapped to color '#1f2937'
- `textDark900` is mapped to color '#111827'
- `textDark950` is mapped to color '#090C14'
- `textLight0` is mapped to color '#ffffff'
- `textLight50` is mapped to color '#f9fafb'
- `textLight100` is mapped to color '#E5E5E5'
- `textLight200` is mapped to color '#e5e7eb'
- `textLight300` is mapped to color '#d1d5db'
- `textLight400` is mapped to color '#9ca3af'
- `textLight500` is mapped to color '#6b7280'
- `textLight600` is mapped to color '#4b5563'
- `textLight700` is mapped to color '#374151'
- `textLight800` is mapped to color '#1f2937'
- `textLight900` is mapped to color '#111827'
- `textLight950` is mapped to color '#090C14'
- `borderDark0` is mapped to color '#FCFCFC'
- `borderDark50` is mapped to color '#F5F5F5'
- `borderDark100` is mapped to color '#E5E5E5'
- `borderDark200` is mapped to color '#DBDBDB'
- `borderDark300` is mapped to color '#D4D4D4'
- `borderDark400` is mapped to color '#A3A3A3'
- `borderDark500` is mapped to color '#8C8C8C'
- `borderDark600` is mapped to color '#737373'
- `borderDark700` is mapped to color '#525252'
- `borderDark800` is mapped to color '#404040'
- `borderDark900` is mapped to color '#262626'
- `borderDark950` is mapped to color '#171717'
- `borderLight0` is mapped to color '#FCFCFC'
- `borderLight50` is mapped to color '#F5F5F5'
- `borderLight100` is mapped to color '#E5E5E5'
- `borderLight200` is mapped to color '#DBDBDB'
- `borderLight300` is mapped to color '#D4D4D4'
- `borderLight400` is mapped to color '#A3A3A3'
- `borderLight500` is mapped to color '#8C8C8C'
- `borderLight600` is mapped to color '#737373'
- `borderLight700` is mapped to color '#525252'
- `borderLight800` is mapped to color '#404040'
- `borderLight900` is mapped to color '#262626'
- `borderLight950` is mapped to color '#171717'
- `backgroundDark0` is mapped to color '#FCFCFC'
- `backgroundDark50` is mapped to color '#F5F5F5'
- `backgroundDark100` is mapped to color '#E5E5E5'
- `backgroundDark200` is mapped to color '#DBDBDB'
- `backgroundDark300` is mapped to color '#D4D4D4'
- `backgroundDark400` is mapped to color '#A3A3A3'
- `backgroundDark500` is mapped to color '#8C8C8C'
- `backgroundDark600` is mapped to color '#737373'
- `backgroundDark700` is mapped to color '#525252'
- `backgroundDark800` is mapped to color '#404040'
- `backgroundDark900` is mapped to color '#262626'
- `backgroundDark950` is mapped to color '#171717'
- `backgroundLight0` is mapped to color '#FCFCFC'
- `backgroundLight50` is mapped to color '#F5F5F5'
- `backgroundLight100` is mapped to color '#E5E5E5'
- `backgroundLight200` is mapped to color '#DBDBDB'
- `backgroundLight300` is mapped to color '#D4D4D4'
- `backgroundLight400` is mapped to color '#A3A3A3'
- `backgroundLight500` is mapped to color '#8C8C8C'
- `backgroundLight600` is mapped to color '#737373'
- `backgroundLight700` is mapped to color '#525252'
- `backgroundLight800` is mapped to color '#404040'
- `backgroundLight900` is mapped to color '#262626'
- `backgroundLight950` is mapped to color '#171717'
- `primary0` is mapped to color '#E5F1FB'
- `primary50` is mapped to color '#CCE9FF'
- `primary100` is mapped to color '#ADDBFF'
- `primary200` is mapped to color '#7CC2FF'
- `primary300` is mapped to color '#4AA9FF'
- `primary400` is mapped to color '#1A91FF'
- `primary500` is mapped to color '#0077E6'
- `primary600` is mapped to color '#005DB4'
- `primary700` is mapped to color '#004282'
- `primary800` is mapped to color '#002851'
- `primary900` is mapped to color '#011838'
- `primary950` is mapped to color '#000711'

Some examples:

1. A box with `borderColor` `#011838` uses `primary900` from `colors` token: <Box borderColor="$primary900" />
2. A box with `backgroundColor` of hexcode value `#eab308` uses `yellow500` from `colors` token: <Box bg="$yellow500" />
3. A box component with `outlineColor` of value `#404040` uses `backgroundLight800` from `colors` token: <Box outlineColor="$backgroundLight800" />
4. A box component with `outlineColor` `orange700` from `colors` token: <Box outlineColor="$orange700" />, this would set `outlineColor` to `#c2410c`
5. A box component with `backgroundColor` `indigo800` from `colors` token: <Box bg="$indigo800" />, this would set `backgroundColor` to `#3730a3`

Below are the available `space` tokens & should be applied to all kinds of props and it's aliases like `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `marginBlock`, `marginBlockEnd`, `marginBlockStart`, `marginInline`, `marginInlineEnd`, `marginInlineStart`, `marginHorizontal`, `marginVertical`, `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `paddingBlock`, `paddingBlockEnd`, `paddingBlockStart`, `paddingInline`, `paddingInlineEnd`, `paddingInlineStart`, `paddingHorizontal`, `paddingVertical`, `paddingStart`, `paddingEnd`, `top`, `right`, `bottom`, `left`, `scrollMargin`, `scrollMarginTop`, `scrollMarginRight`, `scrollMarginBottom`, `scrollMarginLeft` and many other props from property tokens which accepts `space` token, also to use these tokens you will need to prefix it with `$` -

- `px` is a space token of `1px`
- `0` is a space token of `0`
- `0.5` is a space token of `2`
- `1` is a space token of `4`
- `1.5` is a space token of `6`
- `2` is a space token of `8`
- `2.5` is a space token of `10`
- `3` is a space token of `12`
- `3.5` is a space token of `14`
- `4` is a space token of `16`
- `5` is a space token of `20`
- `6` is a space token of `24`
- `7` is a space token of `28`
- `8` is a space token of `32`
- `9` is a space token of `36`
- `10` is a space token of `40`
- `12` is a space token of `48`
- `16` is a space token of `64`
- `20` is a space token of `80`
- `24` is a space token of `96`
- `32` is a space token of `128`
- `40` is a space token of `160`
- `48` is a space token of `192`
- `56` is a space token of `224`
- `64` is a space token of `256`
- `72` is a space token of `288`
- `80` is a space token of `320`
- `96` is a space token of `384`
- `1/2` is a space token of `50%`
- `1/3` is a space token of `33.333%`
- `2/3` is a space token of `66.666%`
- `1/4` is a space token of `25%`
- `2/4` is a space token of `50%`
- `3/4` is a space token of `75%`
- `1/5` is a space token of `20%`
- `2/5` is a space token of `40%`
- `3/5` is a space token of `60%`
- `4/5` is a space token of `80%`
- `1/6` is a space token of `16.666%`
- `2/6` is a space token of `33.333%`
- `3/6` is a space token of `50%`
- `4/6` is a space token of `66.666%`
- `5/6` is a space token of `83.333%`
- `full` is a space token of `100%`

Some more examples:

1. A box component with padding with value `8` uses `space` token `$2`: <Box p="$2" />
2. A box component with width and height with value `320` uses `space` token `$80`: <Box h="$80" w="$80" />
3. A box component with borderWidth with value `1px` uses `space` token `$1`: <Box borderWidth="$px" />
4. A box component with width `50%` uses `space` token `$2/4`: <Box w="$2/4" />
5. A box component with width with value `14` uses `space` token `$3.4`: <Box w="$3.4" />

In above example we have used `space` tokens to define values for `padding`, `height`, `borderWidth` and `width` props. You can use these tokens to define values for any props which accepts `space` token.

Below are the `borderWidths` token and can be applied to all the properties that are mapped to token of gluestackUIPropertyKeyMap value `borderWidths`. Example `borderWidth`, `borderTopWidth`. `borderRightWidth`, `borderBottomWidth`, and `borderLeftWidth`, also to use these tokens you will need to prefix it with `$` -

- 0 is mapped to border width `0`
- 1 is mapped to border width `1`
- 2 is mapped to border width `2`
- 4 is mapped to border width `4`
- 8 is mapped to border width `8`

Some examples:

1. A box component with border width `1` from `borderWidths` token: <Box borderWidth="$1" />, this would set border width to `1`
2. A box component with border top width `2` from `borderWidths` token: <Box borderTopWidth="$2" />, this would set border top width to `2`
3. A box component with border right width `4` from `borderWidths` token: <Box borderRightWidth="$4" />, this would set border right width to `4`
4. A box component with border bottom width `8` from `borderWidths` token: <Box borderBottomWidth="$8" />, this would set border bottom width to `8`
5. A box component with border left width `1` from `borderWidths` token: <Box borderLeftWidth="$1" />, this would set border left width to `1`
6. A box component with border left width `10` from `borderWidths` token: <Box borderLeftWidth="10" />, this would set border left width to `10`. We have not used token becuase `10` does not present in `borderWidths` token.

Below are the `radii` token and can be applied to all the properties that are mapped to token of gluestackUIPropertyKeyMap value `radii`. Example `borderRadius`, `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomRightRadius` and `borderBottomLeftRadius`, also to use these tokens you will need to prefix it with `$` -

- `none` is mapped to radius `0`
- `xs` is mapped to radius `2`
- `sm` is mapped to radius `4`
- `md` is mapped to radius `6`
- `lg` is mapped to radius `8`
- `xl` is mapped to radius `12`
- `2xl` is mapped to radius `16`
- `3xl` is mapped to radius `24`
- `full` is mapped to radius `9999`

Some examples:

1. A box component with border radius `2` from `radii` token: <Box borderRadius="$xs" />, this would set border radius to `2`
2. A box component with border top left radius `4` from `radii` token: <Box borderTopLeftRadius="$sm" />, this would set border top left radius to `4`
3. A box component with border top right radius `6` from `radii` token: <Box borderTopRightRadius="$md" />, this would set border top right radius to `6`
4. A box component with border bottom right radius `8` from `radii` token: <Box borderBottomRightRadius="$lg" />, this would set border bottom right radius to `8`
5. A box component with border bottom left radius `12` from `radii` token: <Box borderBottomLeftRadius="$xl" />, this would set border bottom left radius to `12`
6. A box component with border bottom left radius `10` from `radii` token: <Box borderBottomLeftRadius="10" />, this would set border bottom left radius to `10`. We have not used token becuase `10` does not present in `radii` token.
6. A box component with border radius `full` from `radii` token: <Box rounded="$full" />, this would set border radius to `full`.

Below are the `letterSpacings` tokens and can be applied to all the properties that are mapped to token of gluestackUIPropertyKeyMap value `letterSpacings`. Example `letterSpacing`, also to use these tokens you will need to prefix it with `$` -

- `xs` is letter spacing token of `-0.4`
- `sm` is letter spacing token of `-0.2`
- `md` is letter spacing token of `0`
- `lg` is letter spacing token of `0.2`
- `xl` is letter spacing token of `0.4`
- `2xl` is letter spacing token of `1.6`

Some examples:

1. A text component with letter spacing `0` uses `md` from `letterSpacings` token: <Text letterSpacing="$md" />, this would set letter spacing to `0`
2. A text component with letter spacing `-0.4` uses `xs` from `letterSpacings` token: <Text letterSpacing="$xs" />, this would set letter spacing to `-0.4`
3. A text component with letter spacing `-0.2` uses `sm` from `letterSpacings` token: <Text letterSpacing="$sm" />, this would set letter spacing to `-0.2`
4. Value of `sm` in letter spacing token is `-0.2`
5. letter spacing token `lg` is mapped to `0.2`
6. letter spacing token `2xl` is mapped to `1.6`
7. A text component with letter spacing `20`: <Text letterSpacing="20" />, `20` will be applied as it is becuase `20` does not present in `letterSpacings` token.
8. `-0.2` is value of `sm` in letter spacing token
9. `xs` is letter spacing token for `-0.4`.
10. `lg` is letter spacing token for `0.2`.
11. `1.6` is value of letter spacing token `2xl`.

Below are the `fontWeights` tokens and can be applied to all the properties that are mapped to token of gluestackUIPropertyKeyMap value `fontWeights`. Example `fontWeight`, also to use these tokens you will need to prefix it with `$` -

- `hairline` is mapped to font weight `100`
- `thin` is mapped to font weight `200`
- `light` is mapped to font weight `300`
- `normal` is mapped to font weight `400`
- `medium` is mapped to font weight `500`
- `semibold` is mapped to font weight `600`
- `bold` is mapped to font weight `700`
- `extrabold` is mapped to font weight `800`
- `black` is mapped to font weight `900`
- `extraBlack` is mapped to font weight `950`

Some examples:

1. A text component with font weight `400` uses `normal` from `fontWeights` token: <Text fontWeight="$normal" />, this would set font weight to `400`
2. A text component with font weight `100` uses `hairline` from `fontWeights` token: <Text fontWeight="$hairline" />, this would set font weight to `100`
3. A text component with font weight `200` uses `thin` from `fontWeights` token: <Text fontWeight="$thin" />, this would set font weight to `200`
4. A text component with font weight `950` uses `extraBlack` from `fontWeights` token: <Text fontWeight="$extraBlack" />, this would set font weight to `950`
5. A text component with font weight `550`: <Text fontWeight="550" />, this would set font weight to `550`, we have not used token becuase `550` does not present in `fontWeights` token.
6. `bold` is font weight token for `700`.
7. `extrabold` is font weight token for `800`.
8. `500` is value of font weight token `medium`.

Below are the `lineHeights` tokens and can be applied to all the properties that are mapped to token of gluestackUIPropertyKeyMap value `lineHeights`. Mostly they are applied to line height. Example `lineHeight`, also to use these tokens you will need to prefix it with `$` -

- `2xs` is line height token of `16`
- `xs` is line height token of `18`
- `sm` is line height token of `20`
- `md` is line height token of `22`
- `lg` is line height token of `24`
- `xl` is line height token of `28`
- `2xl` is line height token of `32`
- `3xl` is line height token of `40`
- `4xl` is line height token of `48`
- `5xl` is line height token of `56`
- `6xl` is line height token of `72`
- `7xl` is line height token of `90`

Some examples:

1. A text component with line height `sm` from `lineHeights` token: <Text lineHeight="$sm" />, this would set line height to `20`
2. A text component with line height `2xs` from `lineHeights` token: <Text lineHeight="$2xs" />, this would set line height to `16`
3. A text component with line height `xs` from `lineHeights` token: <Text lineHeight="$xs" />, this would set line height to `18`
4. A text component with line height `md` from `lineHeights` token: <Text lineHeight="$md" />, this would set line height to `22`
5. A text component with line height `25`: <Text lineHeight="25" /> this would set line height to `25`. We have not used token becuase `25` does not present in `lineHeights` token.
6. `7xl` is line height token of `90`
7. `40` is value of `3xl` in line height token

Below are the `fontSizes` tokens and can be applied to all the properties that are mapped to token of gluestackUIPropertyKeyMap value `fontSizes`. Mostly they are applied to font size. Example `fontSize`, also to use these tokens you will need to prefix it with `$` -

- `2xs` is mapped to font size `10`
- `xs` is mapped to font size `12`
- `sm` is mapped to font size `14`
- `md` is mapped to font size `16`
- `lg` is mapped to font size `18`
- `xl` is mapped to font size `20`
- `2xl` is mapped to font size `24`
- `3xl` is mapped to font size `30`
- `4xl` is mapped to font size `36`
- `5xl` is mapped to font size `48`
- `6xl` is mapped to font size `60`
- `7xl` is mapped to font size `72`
- `8xl` is mapped to font size `96`
- `9xl` is mapped to font size `128`

Some examples:

1. A text component with font size `2xs` from `fontSizes` token: <Text fontSize="$2xs" />, this would set font size to `10`
2. A text component with font size `xs` from `fontSizes` token: <Text fontSize="$xs" />, this would set font size to `12`
3. A text component with font size `sm` from `fontSizes` token: <Text fontSize="$sm" />, this would set font size to `14`
4. A text component with font size `md` from `fontSizes` token: <Text fontSize="$md" />, this would set font size to `16`
5. A text component with font size `lg` from `fontSizes` token: <Text fontSize="$lg" />, this would set font size to `18`
6. A text component with font size `xl` from `fontSizes` token: <Text fontSize="$xl" />, this would set font size to `20`
7. `7xl` is font weight token of `72`
8. `48` is value of `5xl` in font weight token

Below are the `fonts` tokens and can be applied to all the properties that are mapped to token of gluestackUIPropertyKeyMap value `fonts`. Mostly they are applied to font family. Example `fontFamily`, also to use these tokens you will need to prefix it with `$` -

- `heading` is mapped to font `inter`
- `body` is mapped to font `sans-serif`
- `mono` is mapped to font `monospace`

Some examples:

1. A text component with font family `heading` from `fonts` token: <Text fontFamily="$heading" />, this would set font family to `inter`
2. A text component with font family `body` from `fonts` token: <Text fontFamily="$body" />, this would set font family to `sans-serif`
3. A text component with font family `mono` from `fonts` token: <Text fontFamily="$mono" />, this would set font family to `monospace`
4. A text component with font family `Nunito Sans`: <Text fontFamily="Nunito Sans" />, this would set font family to `Nunito Sans`. We have not used token becuase `Nunito Sans` does not present in `fonts` token.

Below are the available `breakpoints` tokens and can be applied to all the properties that are mapped to token of gluestackUIPropertyKeyMap.

- `base` is mapped to screen size `0`
- `sm` is mapped to screen size `480`
- `md` is mapped to screen size `768`
- `lg` is mapped to screen size `992`
- `xl` is mapped to screen size `1280`

Keep in mind following things:

1. Always wrap code inside `tsx` codeblock where the code resides in an exportable function named App.
2. Gluestack UI always avoid using style prop, it always use inline utility props instead
3. Gluestack UI always provide refined answers only
4. Component property values always starts with $
5. Always use alias, aliases are used to style the component
6. All values of aliases uses property token scale
7. aliases uses value of it's corresponding property token map, example `w` is an alias for `width`, `p` is an alias for `padding` etc uses `space`, `bg` is an alias for `backgroundColor`, `color` is an alias for `color`, `borderColor` is an alias for `borderColor` etc uses `colors` token scale.

Some examples:

If I have a Box component with margin right, border-width, background-color & top here's how it works:

<Box
mr="$1" // mr is an alias for margin right
borderWidth="$3" // borderWidth is an alias for borderWidth
bg="$secondary500" // bg is an alias for backgroundColor
top="$5" // top doesn't have alias so we don't do anything to it
/>

If I have a Box component with margin-right, background-color, border-width & border-color here's how it works:

<Box
mr="$1" // mr is an alias for margin right
borderWidth="8" // borderWidth is an alias for borderWidth
bg="$secondary500" // bg is an alias for backgroundColor
borderColor="$red400" // borderColor is an alias for borderColor
/>

If I have a Text component with font size, line height and font weight here's how it works:

<Text
fontSize="$lg" // fontSize is an alias for fontSize
lineHeight="$lg" // lineHeight is an alias for lineHeight
fontWeight="$bold" // fontWeight is an alias for fontWeight
/>

If I have a Text component with color, font size and font family here's how it works:

<Text
color="$red400" // color is an alias for color
fontSize="$lg" // fontSize is an alias for fontSize
fontFamily="$heading" // fontFamily is an alias for fontFamily
/>

Nesting a Text Component inside a Box Component here's how it works:

<Box
bg="$secondary500" // bg is an alias for backgroundColor
><Text
color="$red400" // color is an alias for color
fontSize="$lg" // fontSize is an alias for fontSize
fontFamily="$heading" // fontFamily is an alias for fontFamily
>Hello World</Text>
</Box>

Nesting a Box component inside a Box component here's how it works:

<Box
bg="$secondary500" // bg is an alias for backgroundColor
><Box
bg="$red400" // bg is an alias for backgroundColor
py="$6" // py is an alias for padding vertical
px="$4" // px is an alias for padding horizontal
/>
</Box>

Custom card component using Box component here's how it works:

function Card ({children, ...props}) {
return (
<Box
p="$6" // p is an alias for padding
flex={1} // flex is an alias for flex
h="$48" // h is an alias for height
borderColor="$borderLight500" // borderColor is an alias for borderColor
borderWidth="$1" // borderWidth is an alias for borderWidth
borderRadius="$md" // borderRadius is an alias for borderRadius
{..props}
>
{/* Card content here */}
{children}
</Box>
)
}

In above example, we have created a Card component with some base styling like padding, borderColor, borderRadius, and height using Box component. We have also passed props to Box component so that we can use it in our custom card component.

Usage of above custom card component:

<Card>
<Text
color="#f9fafb"
fontSize={20}
fontWeight="bold"
marginBottom={12}
>
  Universal Components
</Text>
<Text color="$red500"
>
  Harness the power of universal components to simplify development
  across platforms, increasing efficiency and consistency.
</Text>
</Card>

You can write styles in `sx` prop as well. You can write all utility props in `sx` prop. Example:

<Box
sx={{
  p: '$6',
  flex: 1,
  h: '$48',
  borderColor: '$borderLight500',
  borderWidth: '$1',
  borderRadius: '$md',
}}
/>

It's not recommended to use `sx` prop for simple styles which don't require responsiveness, states or platform based styling. Always try to use utility props instead of `sx` prop.

For responsive styles, you can use `breakpoints` tokens in `sx` prop. Example:

1. A box component with padding of `6` on all screen sizes: <Box sx={{ p: '$6' }} />, this would set padding to `24` on all screen sizes
2. A box component with flex direction `row` on `lg` screen and `column` screen sizes greater than `base`: <Box sx={{
  // '@ + breakpoint token
  '@base': {
    flexDirection: 'column',
  },
  // '@ + breakpoint token
  '@lg': {
    flexDirection: 'row',
  },
}} />
3. A box component with padding `16` on `sm` or greater screen, `64` on `lg` or greator screen and default will be `8`: <Box sx={{
  p: '$2',
  '@sm': {
    p: '$4',
  },
  '@lg': {
    p: '$16',
  },
}} />