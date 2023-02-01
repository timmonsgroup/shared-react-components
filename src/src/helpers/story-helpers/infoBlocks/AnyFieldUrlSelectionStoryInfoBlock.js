import React from 'react';

export default function AnyFieldUrlSelectionStoryInfoBlock(options) {

const exampleChoiceFormatter = 
    `const choiceFormatter = (fieldId, response, options) => {
        const { data } = response;

        const choiceDataList = data.facts;

        const formattedChoices = choiceDataList.map((choiceDataItem, index) => {
            return { id: index, label: choiceDataItem };
        })

        return formattedChoices;
    }`;

const exampleAPIResponse = 
    `{
        "facts": [
            "The largest breed of dog is the Irish Wolfhound.",
            "Toto in The Wizard of Oz was played by a female Cairn Terrier named Terry.",
            "Why are dogs’ noses so wet? Dogs’ noses secrete a thin layer of mucous that helps them absorb scent. They then lick their noses to sample the scent through their mouth.",
            "In 2002 alone, more people in the U.S. were killed by dogs than by sharks in the past 100 years.",
            "It is not possible to know how many puppies a dog will have just by looking. The appearance can be very deceptive."
        ],
        "success": true
    }`;


    return (
        <div style={{marginTop: "32px"}}>
            <hr/>
            <h2 style={{marginTop: "25px"}}>Example Inputs</h2>

            <h3>URL:</h3>
            <p>{options.url}</p>

            <h3>Custom Formatter Function</h3>
            <pre>
                {exampleChoiceFormatter}
            </pre>

            <h3>API Response</h3>
            <pre>
                {exampleAPIResponse}
            </pre>


            <hr style={{margin: "32px 0"}}/>

            <p>AnyFields setup as selection inputs can set an url property.
                The anyField will call this url and populate the selection input with the data it receives.<br />
                <br />
                Developers can handle the retrieved data in one of two ways:<br />

                <ol>
                    <li>
                        If the retrieved data is an array, then parseFormLayout will iterate through it looking for an id property and a label property on each element.
                        It will then set the id and label of each option to match the id and label it finds. The developer has the option of setting
                         an idField property and a labelField property. ParseFormLayout will then look for keys by these names to set as the id and label of each option instead.

                         i.e.
                         <pre>
                            <code>data.map((d) =&gt; (&#123; id: d[idField] || d.id, label: d[labelField] || d.name &#125;))</code>
                         </pre>
                    </li>
                    <li>
                        The developer can supply a custom formatter function to format the retrieved data appropriately for the selection input with the following function signature: <br />
                        (fieldId, response, options) <br />
                        <br />
                        <b>fieldId:</b> <br />
                        the id of the field that the data is being processed for.<br /><br />
                        <b>response:</b> <br />
                        the response from the network call that retrieved the data.<br /><br />
                        <b>options:</b> <br />
                        an options object that currently brings in the values set for idField and labelField.<br /> <br />
                        <b>options.mappedId:</b> <br />
                          the set idField.<br /> <br />
                          <b>options.mappedLabel:</b> <br />
                          the set labelField
                    </li>
                </ol>
            </p>
        </div>
    );
}