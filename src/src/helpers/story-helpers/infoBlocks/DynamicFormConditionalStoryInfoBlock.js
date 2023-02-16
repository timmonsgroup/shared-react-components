import React from 'react';

export default function DynamicFormConditionalStoryInfoBlock(options) {

const exampleConditional = 
`[ 
    {when: "section1TEXT1path", isValid: true, then: ${options.conditionalThen}},
    {when: "section1TEXT1path", isValid: false, then: {}}
]
`;

    return (
        <div style={{marginTop: "32px"}}>
        <hr/>
            <p style={{marginTop: "25px"}}>TEXT FIELD 1 is a required field. If TEXT FIELD 1 has a valid value, {options.fieldWithConditionalsSetName} {options.explanation}</p>

            <h4>{options.fieldWithConditionalsSetName}'s conditional property:</h4>
            <pre>
                {exampleConditional}
            </pre>
            <br/>

            {options.exampleAPIResponse &&
                <div>
                    <h4>Example API Response</h4>
                    <pre>
                        {options.exampleAPIResponse}
                    </pre>
                </div>
            }
            {options.exampleCustomChoiceFormatter &&
                <div>
                    <h4>Custom Choice Formatter Used</h4>
                    <pre>
                        {options.exampleCustomChoiceFormatter}
                    </pre>
                </div>
            }
        </div>
    );
}