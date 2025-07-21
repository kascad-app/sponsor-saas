import { useState } from "react";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ContentEditable } from "@/src/components/editor/editor-ui/content-editable";
import { ToolbarPlugin } from "@/src/components/editor/plugins/toolbar/toolbar-plugin";
import { BlockFormatDropDown } from "@/src/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/src/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { CounterCharacterPlugin } from "@/src/components/editor/plugins/actions/counter-character-plugin";
import { FormatHeading } from "@/src/components/editor/plugins/toolbar/block-format/format-heading";
import { FormatParagraph } from "@/src/components/editor/plugins/toolbar/block-format/format-paragraph";
import { FormatQuote } from "@/src/components/editor/plugins/toolbar/block-format/format-quote";
import { FormatBulletedList } from "@/src/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatNumberedList } from "@/src/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatCheckList } from "@/src/components/editor/plugins/toolbar/block-format/format-check-list";
import { Separator } from "@/src/components/ui/separator";

const placeholder = "Commencez à taper votre message...";

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-2 bg-background">
            {/* Block Format Dropdown */}
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Font Format Buttons */}
            <div className="flex items-center gap-1">
              <FontFormatToolbarPlugin format="bold" />
              <FontFormatToolbarPlugin format="italic" />
              <FontFormatToolbarPlugin format="underline" />
              <FontFormatToolbarPlugin format="strikethrough" />
              <FontFormatToolbarPlugin format="code" />
            </div>
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-72 min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <CheckListPlugin />
        {/* rest of the plugins */}
      </div>

      {/* actions plugins */}
      <div className="flex items-center justify-between p-2 border-t bg-background">
        <div className="flex-1" />
        <CounterCharacterPlugin charset="UTF-16" />
      </div>
    </div>
  );
}
