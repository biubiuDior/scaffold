## 使用说明


### demo

```js
import React from 'react';
import { Button } from 'antd';
import LyForm from '@/components/LyForm';

const Index = props => {
  let refForm = null;
  const onClick = () => {
    refForm.validateFields((errors, values) => {
      console.log(values, 'values');
    });
  };

  return (
    <div>
      <LyForm
        ref={node => (refForm = node)}
        itemCol={8}
		initialValues={{
			Input: "input"
		}}
        items={[
          {
            label: 'Input',
            name: 'Input',
          },
          {
            type: 'InputMoney',
            label: 'InputMoney',
            name: 'InputMoney',
          },
          {
            type: 'InputNumber',
            label: 'InputNumber',
            name: 'InputNumber',
          },
          {
            type: 'AutoComplete',
            label: 'AutoComplete',
            name: 'AutoComplete',
            dataSource: ['1', '11', '111'],
          },
          {
            type: 'Cascader',
            label: 'Cascader',
            name: 'Cascader',
            options: [],
          },
          {
            type: 'Checkbox',
            label: 'Checkbox',
            name: 'Checkbox',
            options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }],
          },
          {
            type: 'Radio',
            label: 'Radio',
            name: 'Radio',
            options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }],
          },
          {
            type: 'Select',
            label: 'Select',
            name: 'Select',
            options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }],
          },
          {
            type: 'Switch',
            label: 'Switch',
            name: 'Switch',
            options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }],
          },
          {
            type: 'DatePicker',
            label: 'DatePicker',
            name: 'DatePicker',
          },
          {
            type: 'WeekPicker',
            label: 'WeekPicker',
            name: 'WeekPicker',
          },
          {
            type: 'MonthPicker',
            label: 'MonthPicker',
            name: 'MonthPicker',
          },
          {
            type: 'RangePicker',
            label: 'RangePicker',
            name: 'RangePicker',
          },
          {
            type: 'Mention',
            label: 'Mention',
            name: 'Mention',
          },
          {
            type: 'Rate',
            label: 'Rate',
            name: 'Rate',
          },
          {
            type: 'Search',
            label: 'Search',
            name: 'Search',
          },
          {
            type: 'Slider',
            label: 'Slider',
            name: 'Slider',
          },
          {
            type: 'TextArea',
            label: 'TextArea',
            name: 'textArea',
          },
          {
            type: 'TimePicker',
            label: 'TimePicker',
            name: 'TimePicker',
          },
          {
            type: 'TreeSelect',
            label: 'TreeSelect',
            name: 'TreeSelect',
          },
          {
            type: 'Upload',
            label: 'Upload',
            name: 'Upload',
          },
        ]}
      />
      <Button onClick={onClick}>Submit</Button>
    </div>
  );
};

export default Index;
```