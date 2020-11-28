//todo: figure out how to use this so (Vue as any) isnt needed in other locations
//https://stackoverflow.com/questions/54826912/vue-resource-typescript-property-http-does-not-exist-on-type-vueconstructo
// https://vuejs.org/v2/guide/typescript.html

// declare module 'vuejs-dialog' {
//   import { PluginFunction } from 'vue'

//   export const install: PluginFunction<Record<string, unknown>>

//   interface DialogOptions {
//     html?: boolean
//     loader?: boolean
//     reverse?: boolean
//     okText?: string
//     cancelText?: string
//     animation?: 'zoom' | 'bounce' | 'fade'
//     type?: 'basic' | 'soft' | 'hard'
//     verification?: string
//     verificationHelp?: string
//     clicksCount?: number
//     backdropClose?: true
//     customClass?: string
//   }

//   interface DialogResult {
//     close?: () => void
//     loading?: () => void
//     node?: Element
//     data?: unknown
//   }

//   module 'vue/types/vue' {
//     interface Vue {
//       $dialog: {
//         alert(message: string, options?: DialogOptions): DialogResult 
//         confirm(message: string, options?: DialogOptions): DialogResult 
//       },
//       dialog: {
//         alert(message: string, options?: DialogOptions): DialogResult 
//         confirm(message: string, options?: DialogOptions): DialogResult 
//       }
//     }
//   }

//   module '@nuxt/types' {
//     interface NuxtAppOptions {
//       $dialog: {
//         alert(message: string, options?: DialogOptions):DialogResult 
//         confirm(message: string, options?: DialogOptions): DialogResult 
//       },
//       dialog: {
//         alert(message: string, options?: DialogOptions): DialogResult 
//         confirm(message: string, options?: DialogOptions): DialogResult 
//       }
//     }
//   }

//   module 'vuex/types/index' {
//     interface Store<S> {
//       $dialog: {
//         alert(message: string, options?: DialogOptions): DialogResult 
//         confirm(message: string, options?: DialogOptions): DialogResult 
//       },
//       dialog: {
//         alert(message: string, options?: DialogOptions): DialogResult 
//         confirm(message: string, options?: DialogOptions): DialogResult 
//       }
//     }
//   }
// }

declare module 'vuejs-dialog';

declare module 'vue/types/vue' {
  interface VueConstructor { 
    dialog: any;
  }
}