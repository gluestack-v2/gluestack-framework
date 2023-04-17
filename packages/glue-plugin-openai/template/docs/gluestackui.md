I am building gluestack-ui, a component library for React Native.

I have a Box component that accepts utility props from the below list called gluestackUIPropertyKeyMap which is mapped to react native style properties (as per the styled-system spec).

These are the only acceptable utility props -

`gap`, `gridGap`, `columnGap`, `gridColumnGap`, `rowGap`, `gridRowGap`, `inset`, `insetBlock`, `insetBlockEnd`, `insetBlockStart`, `insetInline`, `insetInlineEnd`, `insetInlineStart`, `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `marginBlock`, `marginBlockEnd`, `marginBlockStart`, `marginInline`, `marginInlineEnd`, `marginInlineStart`, `marginHorizontal`, `marginVertical`, `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `paddingBlock`, `paddingBlockEnd`, `paddingBlockStart`, `paddingInline`, `paddingInlineEnd`, `paddingInlineStart`, `paddingHorizontal`, `paddingVertical`, `paddingStart`, `paddingEnd`, ` top`, `right`, `bottom`, `left`, `scrollMargin`, `scrollMarginTop`, `scrollMarginRight`, `scrollMarginBottom`, `scrollMarginLeft`, `scrollMarginX`, `scrollMarginY`, `scrollMarginBlock`, `scrollMarginBlockEnd`, `scrollMarginBlockStart`, `scrollMarginInline`, `scrollMarginInlineEnd`, `scrollMarginInlineStart`, `scrollPadding`, `scrollPaddingTop`, `scrollPaddingRight`, `scrollPaddingBottom`, `scrollPaddingLeft`, `scrollPaddingX`, `scrollPaddingY`, `scrollPaddingBlock`, `scrollPaddingBlockEnd`, `scrollPaddingBlockStart`, `scrollPaddingInline`, `scrollPaddingInlineEnd`, `scrollPaddingInlineStart`, `shadowRadius`, `elevation`, `fontSize`, `background`, `backgroundColor`, `backgroundImage`, `borderImage`, `border`, `borderBlock`, `borderBlockEnd`, `borderBlockStart`, `borderBottom`, `borderBottomColor`, `borderColor`, `borderInline`, `borderInlineEnd`, `borderInlineStart`, `borderLeft`, `borderLeftColor`, `borderRight`, `borderRightColor`, `borderTop`, `borderTopColor`, `caretColor`, `color`, `columnRuleColor`, `fill`, `outline`, `outlineColor`, `stroke`, `textDecorationColor`, ` shadowOpacity`, `condition`, `fontFamily`, `fontWeight`, `lineHeight`, `letterSpacing`, `blockSize`, `minBlockSize`, `maxBlockSize`, `inlineSize`, `minInlineSize`, `maxInlineSize`, `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`, `flexBasis`, `gridTemplateColumns`, `gridTemplateRows`, `borderWidth`, `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth`, `borderStyle`, `borderTopStyle`, `borderRightStyle`, `borderBottomStyle`, `borderLeftStyle`, `borderRadius`, `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomRightRadius`, `borderBottomLeftRadius`, `boxShadow`, `textShadow`, `transition`, `zIndex`.

Some examples:
1. A box with blue background: <Box backgroundColor="$blue500" />
2. Two boxes nested: <Box padding="$1"><Box padding="$2"></Box></Box>
3. A box with some margin and bg: <Box marginTop="$1" backgroundColor="$red500" />

Below are the available aliases should be only alias for all kinds of utility props -

- `bg` is an alias for `backgroundColor`
- `backgroundColor` is an alias for `backgroundColor`
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
- `height` is an alias for `height`
- `width` is an alias for `width`
- `p` is an alias for `padding`
- `px` is an alias for `paddingHorizontal`
- `py` is an alias for `paddingVertical`
- `pt` is an alias for `paddingTop`
- `pb` is an alias for `paddingBottom`
- `pr` is an alias for `paddingRight`
- `pl` is an alias for `paddingLeft`
- `padding` is an alias for `padding`
- `paddingHorizontal` is an alias for `paddingHorizontal`
- `paddingVertical` is an alias for `paddingVertical`
- `paddingTop` is an alias for `paddingTop`
- `paddingBottom` is an alias for `paddingBottom`
- `paddingRight` is an alias for `paddingRight`
- `paddingLeft` is an alias for `paddingLeft`
- `m` is an alias for `margin`
- `mx` is an alias for `marginHorizontal`
- `my` is an alias for `marginVertical`
- `mt` is an alias for `marginTop`
- `mb` is an alias for `marginBottom`
- `mr` is an alias for `marginRight`
- `ml` is an alias for `marginLeft`
- `margin` is an alias for `margin`
- `marginHorizontal` is an alias for `marginHorizontal`
- `marginVertical` is an alias for `marginVertical`
- `marginTop` is an alias for `marginTop`
- `marginBottom` is an alias for `marginBottom`
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
1. A box with blue background: <Box 1bg="$blue500" /> is correct using alias
2. Two boxes nested: <Box 1p="$1"><Box 1p="$2"></Box></Box> is correct using alias
3. A box with some margin and bg: <Box 1mt="$1" 1bg="$red500" /> is correct using alias

Keep in mind following things:
1. Always wrap code inside ```tsx ``` codeblock where the code resides in an exportable function named App.
2. Gluestack UI always avoid using style prop, it always use inline utility props instead
3. Gluestack UI always provide refined answers only
4. Component property values always starts with $
5. Always use alias

Some examples:

If I have a Box component with margin right, border-width, background-color & top here's how it works:

<Box
  mr="$1"             // mr is an alias for margin right
  borderWidth="$3"    // borderWidth is an alias for borderWidth
  bg="$4"             // bg is an alias for backgroundColor
  top="$5"            // top doesn't have alias so we don't do anything to it
/>

