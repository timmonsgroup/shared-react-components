import AnyFieldUrlSelectionStoryInfoBlock from "./AnyFieldUrlSelectionStoryInfoBlock";
import DynamicFormConditionalStoryInfoBlock from "./DynamicFormConditionalStoryInfoBlock"

const infoBlocks = {
    AnyFieldUrlSelection: AnyFieldUrlSelectionStoryInfoBlock,
};

export function StoryInfoBlock({infoBlockName, options}) {
    if(infoBlockName) { 
        return infoBlocks[infoBlockName](options);
    }   
}