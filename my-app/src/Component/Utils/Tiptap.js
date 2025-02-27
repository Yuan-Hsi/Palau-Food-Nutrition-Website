import React, { useEffect, Fragment, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import SizeHelper from "./utils.js";
import FileHandler from '@tiptap-pro/extension-file-handler'
import Image from '@tiptap/extension-image'
import { Node, mergeAttributes,findParentNode } from "@tiptap/core";


import "./Tiptap.css";

// Create a CustomImage to add the style attribute
const CustomImage = Image.configure({
  inline: true,
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: `width: 300px; height: auto; max-width: 450px;`, // Add the default style
      },
    };
  },
});

const Tiptap = (props) => {
  const mySize = new SizeHelper(props.size);

  const editor = useEditor({
    extensions: [StarterKit, Color,TextStyle,TextAlign.configure({types: ['heading', 'paragraph']}),
    CustomImage,FileHandler.configure({
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      onDrop: (currentEditor, files, pos) => {
        files.forEach(file => {
          const fileReader = new FileReader()

          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            currentEditor.chain().insertContentAt(pos, {
              type: 'image',
              attrs: {
                src: fileReader.result,
              },
            }).focus().run()
          }
        })
      },
      onPaste: (currentEditor, files, htmlContent) => {
        const transfer = new DataTransfer();

        for (let i = 0; i < files.length; i++) {
          transfer.items.add(files[i])
        }
        
        const newFiles = Array.from(transfer.files)

        newFiles.forEach(file => {
          const fileReader = new FileReader();

          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            currentEditor.chain().focus().insertContent({
              type: 'image',
              attrs: {
                src: fileReader.result,
              },
            }).run();
          };
        });
      },

    }),],
    content: `<p><span style="color: #858585">Write down here...</span></p>`,
  });

  const mainFunction = ["Font","Color","Align","List","Quote","Media"];
  const [selected, setSelected] = useState("Font");
  const [initializing,setInitializing] = useState(true);
  const [imageSize, setImageSize] = useState("medium");

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        props.setContent(editor.getHTML());
      });
    }
  }, [editor, props.setContent]);

  const handleEditorClick = () => {
    if(initializing){
      setInitializing(false);
      editor.chain().focus().clearContent().run(); // 清除内容
    }
  };

  const setImageStyle = (size) => {
    setImageSize(size);
    const { state } = editor;
    //find the selected image
    const { from, to } = state.selection;
    const image = state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "image") {
        return { node, pos };
      }
    });
    if (image.length > 0){
      const {node,pos} = image[0]
      editor.chain().focus().command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          style: `width: ${size}; height: auto; max-width:450px;`, // Modify the style attribute
        });
      return true
      }).run();
    }
  };

  return (
    <div style={{ marginTop: "2%", backgroundColor: "#efefef", width: "70%", borderRadius: "10px", padding: "3%",}} onClick={handleEditorClick}>
      <div style={{ marginBottom: "10px" }}>
        {mainFunction.map(item=>(
          <button type="button" key={item}
          onClick={() => setSelected(item)} style={{
            backgroundColor: selected === item ? "#0097fd" : "#feb900",
            color: selected === item ? "white" : "black",
          }}> {item}  </button>
        ))}
        <button type="button" onClick={() => editor.chain().focus().clearNodes().run()}>Clear</button>
      </div>
      
      <div style={{ marginBottom: "10px" }}>
          {selected === "Font" && <Fragment>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active Font' : 'Font'}>
            H1
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active Font' : 'Font'}>
            H2
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active Font' : 'Font'}>
            H3
          </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor?.can().toggleBold()} className="Font">
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor?.can().toggleItalic()} className="Font">
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().setStrike().run()} disabled={editor.isActive('strike')}>
            Set strike
        </button>
          <button type="button" onClick={() => editor.chain().focus().unsetStrike().run()} disabled={!editor.isActive('strike')} >
            Unset strike
          </button></Fragment>}

          {selected === "Color" && <Fragment>
          <input type="color" onInput={event => editor.chain().focus().setColor(event.target.value).run()} value={editor.getAttributes('textStyle').color}data-testid="setColor" />
          <button type="button" onClick={() => editor.chain().focus().setColor('#f76759').run()} className={editor.isActive('textStyle', { color: '#f76759' }) ? 'is-active' : ''}
            data-testid="setOrange">
            Orange
          </button>
          <button type="button" onClick={() => editor.chain().focus().setColor('#feb900').run()} className={editor.isActive('textStyle', { color: '#feb900' }) ? 'is-active' : ''}
            data-testid="setYellow">
            Yellow
          </button>
          <button type="button" onClick={() => editor.chain().focus().setColor('#0097fd').run()} className={editor.isActive('textStyle', { color: '#0097fd' }) ? 'is-active' : ''}
            data-testid="setBlue">
            Blue
          </button>
          <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} data-testid="unsetColor">
            Unset color
          </button>
          </Fragment>}

          {selected === "Align" && <Fragment>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''} >
            Left
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''} >
            Center
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}  >
            Right
          </button>
            </Fragment>}
         
         {selected === "List" && <Fragment>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active List' : 'List'} >
            Toggle bullet list
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active List' : 'List'} >
            Toggle ordered list
          </button>
        <button type="button" onClick={() => editor.chain().focus().splitListItem('listItem').run()} disabled={!editor.can().splitListItem('listItem')} className="List">
            Split list item
          </button>
          <button type="button" onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} className="List">
            Sink list item
          </button>
          <button type="button" onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} className="List">
            Lift list item
          </button>
          </Fragment>}

          {selected === 'Quote' && <Fragment><button type="button"  onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active Quote' : 'Quote'}>
            Toggle blockquote
          </button>
          <button type="button" onClick={() => editor.chain().focus().setBlockquote().run()} disabled={!editor.can().setBlockquote()} className="Quote">
            Set blockquote
          </button>
          <button type="button" onClick={() => editor.chain().focus().unsetBlockquote().run()} disabled={!editor.can().unsetBlockquote()} className="Quote">
            Unset blockquote
          </button></Fragment>}

          {selected === "Media" && <Fragment>
            <button type="button" onClick={() => setImageStyle("25%")}
            >
              Small
            </button>
            <button type="button" onClick={() => setImageStyle("50%")} >
              Medium
            </button>
            <button type="button" onClick={() => setImageStyle("100%")}>
              Large
            </button>
          </Fragment>}
      </div>
      
      <div style={{ height: "30vh", overflow: "auto", padding: "20px", background: "#fff" }} onClick={handleEditorClick}>
        <EditorContent editor={editor} style={{ minHeight: "100%" }}  />
      </div>

    </div>
  );
};

export default Tiptap;
