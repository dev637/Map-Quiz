import React from 'react';
import { List, Table, Header } from 'semantic-ui-react';

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const capWithSpacing = str => capitalize(str).replace(/_/g, ' ');

export const remUnderscore = str => str.replace(/_/g, ' ');

export const objToArray = obj =>
  Object.entries(obj).map(entry => ({ category: entry[0], ...entry[1] }));

const numDescription = ['', ' thousand', ' million', ' billion', ' trillion'];

export const numScale = number => {
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0) return number;

  // get suffix and determine scale
  const suffix = numDescription[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return scaled + suffix;
};

export const generateParagraphs = text => {
  const lines = text.split('. ');
  let temp = '';
  const paragraphs = [];

  for (let line of lines) {
    if (temp.length + line.length > 300) {
      paragraphs.push(temp);
      temp = line + '. ';
    } else {
      temp += line + '. ';
    }
  }
  paragraphs.push(temp.substring(0, temp.length - 2));

  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: '600px',
        fontSize: '1.2em',
      }}
    >
      {paragraphs.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
};

export const generateList = list => (
  <List bulleted>
    {list.length > 0 ? (
      <>
        {list.map((item, i) => (
          <List.Item key={i} size="large">
            {item}
          </List.Item>
        ))}
      </>
    ) : (
      <List.Item>none</List.Item>
    )}
  </List>
);

export const generateTable = (table, title) => {
  const items = Object.keys(table[0]);

  return (
    <div style={{ overflow: 'auto', margin: '1rem 0' }}>
      {title && (
        <Header size="small" textAlign="center">
          {title}
        </Header>
      )}
      <Table
        definition
        compact
        unstackable
        collapsing
        style={{ margin: '0 auto' }}
      >
        <Table.Body>
          {items.map((item, i) => (
            <Table.Row key={i}>
              <Table.Cell>{capWithSpacing(item)}</Table.Cell>
              {table.map((entry, j) => (
                <Table.Cell key={j}>
                  {typeof entry[item] === 'number'
                    ? numScale(entry[item])
                    : capWithSpacing(entry[item])}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export const generateTableList = data => {
  if (!data) return '';
  const { list, title, note } = data;
  let listA = [...list];
  let listB = listA.splice(Math.ceil(listA.length / 2));
  return (
    <Table columns={2} unstackable celled>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell colSpan="2">{title}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row textAlign="center" verticalAlign="top">
          <Table.Cell>
            <List items={listA} />
          </Table.Cell>
          <Table.Cell>
            <List items={listB} />
          </Table.Cell>
        </Table.Row>
        {note && (
          <Table.Row>
            <Table.Cell colSpan="2">
              <em>Note: {note}</em>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};
