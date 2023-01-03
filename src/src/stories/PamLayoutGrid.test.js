import { render, fireEvent } from '@testing-library/react';
import { getByText } from '@testing-library/react'
import { NoData } from './PamLayoutGrid.stories'  
import '@testing-library/jest-dom' // This is needed to use toBeInTheDocument()

it('Renders No Data when the data prop is an empty array', () => {
    const { container } = render(<NoData { ...NoData.args } />)
    const idColumnHeader = getByText(container, "ID");
    const nameColumnHeader = getByText(container, "Name");
    const typeColumnHeader = getByText(container, "Type");
    
    const noRowsMessage = getByText(container, "No rows");

    expect(container).toMatchSnapshot();
    
    expect(idColumnHeader).toBeInTheDocument();
    expect(nameColumnHeader).toBeInTheDocument();
    expect(typeColumnHeader).toBeInTheDocument();
    expect(noRowsMessage).toBeInTheDocument();
    

    // We should not have an element with the text Status
    expect(container).not.toHaveTextContent("Status");

})
