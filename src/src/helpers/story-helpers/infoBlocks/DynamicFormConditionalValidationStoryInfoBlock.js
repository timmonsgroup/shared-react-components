import React from 'react';

export default function DynamicFormConditionalValidationMaxValueStoryInfoBlock(options) {

const floatField1ExampleConditional = 
`[ 
    {when: "section1TEXT1path", isValid: true, then: ${options.conditionalThen}},
    {when: "section1TEXT1path", isValid: false, then: {}}
]
`;

    return (
        <div style={{marginTop: "32px"}}>
        <hr/>
            <p style={{marginTop: "25px"}}>TEXT FIELD 1 is a required field. If TEXT FIELD 1 has a valid value, FLOAT FIELD 1 will enable the {options.explanation}</p>

            <h4>FLOAT FIELD 1's conditional property:</h4>
            <pre>
                {floatField1ExampleConditional}
            </pre>
            <br/>
        </div>
    );
}