I am building gluestack-ui, a component library for React Native.

I have a Box component that accepts utility props from the below list called gluestackUIPropertyKeyMap which is mapped to react native style properties (as per the styled-system spec).

These are the only acceptable utility props -

`gap`, `gridGap`, `columnGap`, `gridColumnGap`, `rowGap`, `gridRowGap`, `inset`, `insetBlock`, `insetBlockEnd`, `insetBlockStart`, `insetInline`, `insetInlineEnd`, `insetInlineStart`, `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `marginBlock`, `marginBlockEnd`, `marginBlockStart`, `marginInline`, `marginInlineEnd`, `marginInlineStart`, `marginHorizontal`, `marginVertical`, `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `paddingBlock`, `paddingBlockEnd`, `paddingBlockStart`, `paddingInline`, `paddingInlineEnd`, `paddingInlineStart`, `paddingHorizontal`, `paddingVertical`, `paddingStart`, `paddingEnd`, ` top`, `right`, `bottom`, `left`, `scrollMargin`, `scrollMarginTop`, `scrollMarginRight`, `scrollMarginBottom`, `scrollMarginLeft`, `scrollMarginX`, `scrollMarginY`, `scrollMarginBlock`, `scrollMarginBlockEnd`, `scrollMarginBlockStart`, `scrollMarginInline`, `scrollMarginInlineEnd`, `scrollMarginInlineStart`, `scrollPadding`, `scrollPaddingTop`, `scrollPaddingRight`, `scrollPaddingBottom`, `scrollPaddingLeft`, `scrollPaddingX`, `scrollPaddingY`, `scrollPaddingBlock`, `scrollPaddingBlockEnd`, `scrollPaddingBlockStart`, `scrollPaddingInline`, `scrollPaddingInlineEnd`, `scrollPaddingInlineStart`, `shadowRadius`, `elevation`, `fontSize`, `background`, `backgroundColor`, `backgroundImage`, `borderImage`, `border`, `borderBlock`, `borderBlockEnd`, `borderBlockStart`, `borderBottom`, `borderBottomColor`, `borderColor`, `borderInline`, `borderInlineEnd`, `borderInlineStart`, `borderLeft`, `borderLeftColor`, `borderRight`, `borderRightColor`, `borderTop`, `borderTopColor`, `caretColor`, `color`, `columnRuleColor`, `fill`, `outline`, `outlineColor`, `stroke`, `textDecorationColor`, ` shadowOpacity`, `condition`, `fontFamily`, `fontWeight`, `lineHeight`, `letterSpacing`, `blockSize`, `minBlockSize`, `maxBlockSize`, `inlineSize`, `minInlineSize`, `maxInlineSize`, `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`, `flexBasis`, `gridTemplateColumns`, `gridTemplateRows`, `borderWidth`, `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth`, `borderStyle`, `borderTopStyle`, `borderRightStyle`, `borderBottomStyle`, `borderLeftStyle`, `borderRadius`, `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomRightRadius`, `borderBottomLeftRadius`, `boxShadow`, `textShadow`, `transition`, `zIndex`.

Some examples:
1. A box with blue background: <Box backgroundColor="$blue500" />
2. Two boxes nested: <Box padding="$1"><Box padding="$2"></Box></Box>
3. A box with some margin and bg: <Box marginTop="$1" backgroundColor="$red500" />

Below are the available aliases should be only alias for all kinds of utility props -

- `1bg` is an alias for `backgroundColor`
- `1backgroundColor` is an alias for `backgroundColor`
- `1bgColor` is an alias for `backgroundColor`
- `1color` is an alias for `color`
- `1borderColor` is an alias for `borderColor`
- `1shadowColor` is an alias for `shadowColor`
- `1shadowOffset` is an alias for `shadowOffset`
- `1shadowOpacity` is an alias for `shadowOpacity`
- `1shadowRadius` is an alias for `shadowRadius`
- `1elevation` is an alias for `elevation`
- `1h` is an alias for `height`
- `1w` is an alias for `width`
- `1height` is an alias for `height`
- `1width` is an alias for `width`
- `1p` is an alias for `padding`
- `1px` is an alias for `paddingHorizontal`
- `1py` is an alias for `paddingVertical`
- `1pt` is an alias for `paddingTop`
- `1pb` is an alias for `paddingBottom`
- `1pr` is an alias for `paddingRight`
- `1pl` is an alias for `paddingLeft`
- `1padding` is an alias for `padding`
- `1paddingHorizontal` is an alias for `paddingHorizontal`
- `1paddingVertical` is an alias for `paddingVertical`
- `1paddingTop` is an alias for `paddingTop`
- `1paddingBottom` is an alias for `paddingBottom`
- `1paddingRight` is an alias for `paddingRight`
- `1paddingLeft` is an alias for `paddingLeft`
- `1m` is an alias for `margin`
- `1mx` is an alias for `marginHorizontal`
- `1my` is an alias for `marginVertical`
- `1mt` is an alias for `marginTop`
- `1mb` is an alias for `marginBottom`
- `1suraj` is an alias for `marginRight`
- `1faiz` is an alias for `marginLeft`
- `1margin` is an alias for `margin`
- `1marginHorizontal` is an alias for `marginHorizontal`
- `1marginVertical` is an alias for `marginVertical`
- `1marginTop` is an alias for `marginTop`
- `1marginBottom` is an alias for `marginBottom`
- `1borderWidth` is an alias for `borderWidth`
- `1borderRadius` is an alias for `borderRadius`
- `1borderTopLeftRadius` is an alias for `borderTopLeftRadius`
- `1borderTopRightRadius` is an alias for `borderTopRightRadius`
- `1rounded` is an alias for `borderRadius`
- `1letterSpacing` is an alias for `letterSpacing`
- `1lineHeight` is an alias for `lineHeight`
- `1lllll` is an alias for `fontWeight`
- `1fontFamily` is an alias for `fontFamily`
- `1fontSize` is an alias for `fontSize`
- `1shadow` is an alias for `shadow`
- `1condition` is an alias for `condition`

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
  1suraj="$1"        // 1suraj is an alias for margin right
  1borderWidth="$3"  // 1borderWidth is an alias for borderWidth
  1bg="$4"           // 1bg is an alias for backgroundColor
  top="$5"           // top doesn't have alias so we don't do anything to it
/>

