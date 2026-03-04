import { Extension } from '@tiptap/vue-3'
import { Editor } from '@tiptap/core'
import { type RawCommands, PasteRule } from '@tiptap/core'

interface UploadImageCommand {
  uploadImage: () => (props: { editor: Editor; tr: any }) => void
}

interface ImageItem {
  type: string
  file: File
}

const ImageUploadExtension = Extension.create({
  name: 'imageUpload',

  addCommands(): Partial<RawCommands> {
    return {
      uploadImage: () => ({ editor , tr } : {editor:Editor , tr:any}) => {
          // This command is now just a placeholder
          // Actual logic moved to the addPasteRules handler
      }
    } as Partial<RawCommands>
  },

  addPasteRules(): PasteRule[] {
    return [
      {
        match: (item: ImageItem) => item.type === 'file',
        handler: ({ editor, file, ...rest }: { editor: Editor; file: File }) => {
          const reader = new FileReader()
          reader.onload = (e: ProgressEvent<FileReader>) => {
            // Insert the image with a Data URL for immediate preview
            // const src = e.target?.result
            // if (typeof src === 'string') {
            //   editor.chain().focus().setImage({ src }).run()
            //   const pos = editor.state.doc.content.size - 1 // Assuming the image is the last inserted node
            //   editor.view.dispatch(
            //     editor.state.tr.setNodeMarkup(pos, null, { src, class: 'uploading' })
            //   )
            // Now, upload the image to get a permanent URL
            //   uploadImage(file).then((url: string) => {
            //     // Replace the temporary Data URL with the permanent URL
            //     const { tr } = editor.state
            //     const pos = tr.doc.content.size - 1 // Assuming the image is the last inserted node
            //     tr.setNodeMarkup(pos, null, { src: url, class: '' })
            //     editor.view.dispatch(tr)
            //   })
            // }
          }
          reader.readAsDataURL(file)
        }
      }
    ] as unknown as PasteRule[]
  }
})

export default ImageUploadExtension
