import AnyFieldUrlSelectionStoryInfoBlock from "./AnyFieldUrlSelectionStoryInfoBlock";

const infoBlocks = {
    AnyFieldUrlSelection: AnyFieldUrlSelectionStoryInfoBlock
};

export function StoryInfoBlock({infoBlockName, options}) {
    if(infoBlockName) { 
        return infoBlocks[infoBlockName](options);
    }   
}