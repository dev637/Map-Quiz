import React from 'react';
import { Table } from 'semantic-ui-react';
import styled from 'styled-components';
import { capWithSpacing } from '../../helpers/textHelpers';

const SubHeader = styled.p`
  font-size: 0.7em;
`;

export const generateAirportsTable = (obj = {}) => {
  if (typeof obj !== 'object') return;
  const { paved, unpaved, total } = obj;
  if (!paved || !unpaved) return;
  const date = total?.date;
  const airports = total?.airports;
  const global_rank = total?.global_rank;
  paved.category = 'Paved';
  unpaved.category = 'Unpaved';

  const cols = [
    'category',
    'date',
    'under_914_metres',
    '914_to_1523_metres',
    '1524_to_2437_metres',
    '2438_to_3047_metres',
    'over_3047_metres',
    'total',
  ];

  return (
    <Table unstackable celled compact collapsing>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan={cols.length}>
            Airports
            {airports && (
              <SubHeader>
                ( Total: {airports.toLocaleString()}
                {date && ` - Date: ${date}`}
                {global_rank && ` - Global rank: ${global_rank}`} )
              </SubHeader>
            )}
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row textAlign="center">
          {cols.map(col => (
            <Table.HeaderCell key={col}>{capWithSpacing(col)}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[paved, unpaved].map((obj, idx) => (
          <Table.Row key={idx} textAlign="center">
            <Table.Cell textAlign="left">{obj.category}</Table.Cell>
            {cols.slice(1).map(col => (
              <Table.Cell key={col}>
                {obj[col] && obj[col].toLocaleString()}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
