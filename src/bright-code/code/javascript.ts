const IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*'
const KEYWORDS = [
  'as',
  'in',
  'of',
  'if',
  'for',
  'while',
  'finally',
  'var',
  'new',
  'function',
  'do',
  'return',
  'void',
  'else',
  'break',
  'catch',
  'instanceof',
  'with',
  'throw',
  'case',
  'default',
  'try',
  'switch',
  'continue',
  'typeof',
  'delete',
  'let',
  'yield',
  'const',
  'class',
  'debugger',
  'async',
  'await',
  'static',
  'import',
  'from',
  'export',
  'extends'
] as const
const LITERALS = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'] as const

const TYPES = [
  'Object',
  'Function',
  'Boolean',
  'Symbol',
  'Math',
  'Date',
  'Number',
  'BigInt',
  'String',
  'RegExp',
  'Array',
  'Float32Array',
  'Float64Array',
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Int32Array',
  'Uint16Array',
  'Uint32Array',
  'BigInt64Array',
  'BigUint64Array',
  'Set',
  'Map',
  'WeakSet',
  'WeakMap',
  'ArrayBuffer',
  'SharedArrayBuffer',
  'Atomics',
  'DataView',
  'JSON',
  'Promise',
  'Generator',
  'GeneratorFunction',
  'AsyncFunction',
  'Reflect',
  'Proxy',
  'Intl',
  'WebAssembly'
] as const

const ERROR_TYPES = [
  'Error',
  'EvalError',
  'InternalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError'
] as const

const BUILT_IN_GLOBALS = [
  'setInterval',
  'setTimeout',
  'clearInterval',
  'clearTimeout',
  'require',
  'exports',
  'eval',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'escape',
  'unescape'
] as const

const BUILT_IN_VARIABLES = [
  'arguments',
  'this',
  'super',
  'console',
  'window',
  'document',
  'localStorage',
  'module',
  'global'
] as const

const BUILT_INS = [].concat(BUILT_IN_GLOBALS, TYPES, ERROR_TYPES)

export const javascript = hljs => {
  const regex = hljs.regex
  const hasClosingTag = (match, { after }) => {
    const tag = '</' + match[0].slice(1)
    const pos = match.input.indexOf(tag, after)
    return pos !== -1
  }

  const IDENT_RE$1 = IDENT_RE
  const FRAGMENT = {
    begin: '<>',
    end: '</>'
  }
  const XML_SELF_CLOSING: RegExp = /<[A-Za-z0-9\\._:-]+\s*\/>/
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index
      const nextChar = match.input[afterMatchIndex]
      if (
        nextChar === '<' ||
        nextChar === ','
      ) {
        response.ignoreMatch()
        return
      }
      if (nextChar === '>') {
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch()
        }
      }
      let m
      const afterMatch = match.input.substr(afterMatchIndex)
      if ((m = afterMatch.match(/^\s+extends\s+/))) {
        if (m.index === 0) {
          response.ignoreMatch()
          return
        }
      }
    }
  }
  const KEYWORDS$1 = {
    $pattern: IDENT_RE,
    keyword: KEYWORDS,
    literal: LITERALS,
    built_in: BUILT_INS,
    'variable.language': BUILT_IN_VARIABLES
  }

  const decimalDigits = '[0-9](_?[0-9])*'
  const frac = `\\.(${decimalDigits})`
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`
  const NUMBER = {
    className: 'number',
    variants: [
      {
        begin:
          `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
          `[eE][+-]?(${decimalDigits})\\b`
      },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },

      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },

      { begin: '\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b' },
      { begin: '\\b0[bB][0-1](_?[0-1])*n?\\b' },
      { begin: '\\b0[oO][0-7](_?[0-7])*n?\\b' },

      { begin: '\\b0[0-7]+n?\\b' }
    ],
    relevance: 0
  }

  const SUBST = {
    className: 'subst',
    begin: '\\$\\{',
    end: '\\}',
    keywords: KEYWORDS$1,
    contains: []
  }
  const HTML_TEMPLATE = {
    begin: 'html`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, SUBST],
      subLanguage: 'xml'
    }
  }
  const CSS_TEMPLATE = {
    begin: 'css`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, SUBST],
      subLanguage: 'css'
    }
  }
  const TEMPLATE_STRING = {
    className: 'string',
    begin: '`',
    end: '`',
    contains: [hljs.BACKSLASH_ESCAPE, SUBST]
  }
  const JSDOC_COMMENT = hljs.COMMENT(/\/\*\*(?!\/)/, '\\*/', {
    relevance: 0,
    contains: [
      {
        begin: '(?=@[A-Za-z]+)',
        relevance: 0,
        contains: [
          {
            className: 'doctag',
            begin: '@[A-Za-z]+'
          },
          {
            className: 'type',
            begin: '\\{',
            end: '\\}',
            excludeEnd: true,
            excludeBegin: true,
            relevance: 0
          },
          {
            className: 'variable',
            begin: IDENT_RE$1 + '(?=\\s*(-)|$)',
            endsParent: true,
            relevance: 0
          },
          {
            begin: /(?=[^\n])\s/,
            relevance: 0
          }
        ]
      }
    ]
  })
  const COMMENT = {
    className: 'comment',
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  }
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    TEMPLATE_STRING,
    NUMBER
  ]
  SUBST.contains = SUBST_INTERNALS.concat({
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS$1,
    contains: ['self'].concat(SUBST_INTERNALS)
  })
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains)
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    {
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ['self'].concat(SUBST_AND_COMMENTS)
    }
  ])
  const PARAMS = {
    className: 'params',
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  }

  const CLASS_OR_EXTENDS = {
    variants: [
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, '(', regex.concat(/\./, IDENT_RE$1), ')*')
        ],
        scope: {
          1: 'keyword',
          3: 'title.class',
          5: 'keyword',
          7: 'title.class.inherited'
        }
      },
      {
        match: [/class/, /\s+/, IDENT_RE$1],
        scope: {
          1: 'keyword',
          3: 'title.class'
        }
      }
    ]
  }

  const CLASS_REFERENCE = {
    relevance: 0,
    match: regex.either(
      /\bJSON/,
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
    ),
    className: 'title.class',
    keywords: {
      _: [
        ...TYPES,
        ...ERROR_TYPES
      ]
    }
  }

  const USE_STRICT = {
    label: 'use_strict',
    className: 'meta',
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }

  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [/function/, /\s+/, IDENT_RE$1, /(?=\s*\()/]
      },
      {
        match: [/function/, /\s*(?=\()/]
      }
    ],
    className: {
      1: 'keyword',
      3: 'title.function'
    },
    label: 'func.def',
    contains: [PARAMS],
    illegal: /%/
  }

  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: 'variable.constant'
  }

  function noneOf(list) {
    return regex.concat('(?!', list.join('|'), ')')
  }

  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([...BUILT_IN_GLOBALS, 'super']),
      IDENT_RE$1,
      regex.lookahead(/\(/)
    ),
    className: 'title.function',
    relevance: 0
  }

  const PROPERTY_ACCESS = {
    begin: regex.concat(
      /\./,
      regex.lookahead(regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/))
    ),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: 'prototype',
    className: 'property',
    relevance: 0
  }

  const GETTER_OR_SETTER = {
    match: [/get|set/, /\s+/, IDENT_RE$1, /(?=\()/],
    className: {
      1: 'keyword',
      3: 'title.function'
    },
    contains: [
      {
        begin: /\(\)/
      },
      PARAMS
    ]
  }

  const FUNC_LEAD_IN_RE =
    '(\\(' +
    '[^()]*(\\(' +
    '[^()]*(\\(' +
    '[^()]*' +
    '\\)[^()]*)*' +
    '\\)[^()]*)*' +
    '\\)|' +
    hljs.UNDERSCORE_IDENT_RE +
    ')\\s*=>'

  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/,
      /\s+/,
      IDENT_RE$1,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: 'async',
    className: {
      1: 'keyword',
      3: 'title.function'
    },
    contains: [PARAMS]
  }

  return {
    name: 'Javascript',
    aliases: ['js', 'jsx', 'mjs', 'cjs'],
    keywords: KEYWORDS$1,
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: 'shebang',
        binary: 'node',
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      NUMBER,
      CLASS_REFERENCE,
      {
        className: 'attr',
        begin: IDENT_RE$1 + regex.lookahead(':'),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      {
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: 'function',
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: '\\s*=>',
            contains: [
              {
                className: 'params',
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                'on:begin': XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: 'xml',
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ['self']
              }
            ]
          }
        ]
      },
      FUNCTION_DEFINITION,
      {
        beginKeywords: 'while if switch catch for'
      },
      {
        begin:
          '\\b(?!function)' +
          hljs.UNDERSCORE_IDENT_RE +
          '\\(' +
          '[^()]*(\\(' +
          '[^()]*(\\(' +
          '[^()]*' +
          '\\)[^()]*)*' +
          '\\)[^()]*)*' +
          '\\)\\s*\\{',
        returnBegin: true,
        label: 'func.def',
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, {
            begin: IDENT_RE$1,
            className: 'title.function'
          })
        ]
      },
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      {
        match: '\\$' + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: 'title.function' },
        contains: [PARAMS]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/
      }
    ]
  }
}
