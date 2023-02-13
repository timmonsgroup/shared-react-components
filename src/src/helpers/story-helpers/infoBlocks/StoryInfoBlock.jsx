import AnyFieldUrlSelectionStoryInfoBlock from "./AnyFieldUrlSelectionStoryInfoBlock";
import DynamicFormConditionalValidationStoryInfoBlock from "./DynamicFormConditionalValidationStoryInfoBlock"

const infoBlocks = {
    AnyFieldUrlSelection: AnyFieldUrlSelectionStoryInfoBlock,
    DynamicFormConditionalValidation: DynamicFormConditionalValidationStoryInfoBlock
};

export function StoryInfoBlock({infoBlockName, options}) {
    if(infoBlockName) { 
        return infoBlocks[infoBlockName](options);
    }   
}