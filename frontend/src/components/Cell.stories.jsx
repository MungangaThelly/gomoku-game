import React from 'react';
import Cell from './Cell';

export default {
  title: 'Game/Cell',
  component: Cell,
  argTypes: {
    player1Color: { control: 'color' },
    player2Color: { control: 'color' },
    onClick: { action: 'clicked' },
  },
};

const Template = (args) => <Cell {...args} />;

export const Empty = Template.bind({});
Empty.args = { value: null };

export const Player1 = Template.bind({});
Player1.args = { value: 'player1' };

export const Player2 = Template.bind({});
Player2.args = { value: 'player2' };

export const CustomColors = Template.bind({});
CustomColors.args = {
  value: 'player1',
  player1Color: '#4caf50',
  player2Color: '#ff9800',
};