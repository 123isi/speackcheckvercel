import { Global, css } from '@emotion/react'
import color from './color'

const GlobalStyle = () => (
    <Global styles={css`
      @import url('https:

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      input[type='checkbox'],
      input[type='radio'] {
        accent-color: ${color.primary};
        cursor: pointer;
      }

      a {
        display: inline-block;
        text-decoration: none;
        color: inherit;
      }

      label {
        cursor: pointer;
      }

      input,
      textarea {
        -moz-user-select: auto;
        -webkit-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;
        border: none;
        outline: none;
      }

      input:focus {
        outline: none;
      }

      button {
        outline: none;
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
      }

      html,
      body {
        width: 100%;
        height: 100%;
        overflow: auto;

        ::-webkit-scrollbar {
          display: none;
        }

        scrollbar-width: none;
        -ms-overflow-style: none;
      }
    `}
/>
)

export default GlobalStyle