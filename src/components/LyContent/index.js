import LyContent from './content';
import LyWrapper from '../LyWrapper';
import { Component } from 'react';
// 如果设置了maxHeight，Ly的高度为maxHeight。没有设置则用wrapper计算高度。

const EnhancedComponent = LyWrapper(LyContent, 'height');
export default EnhancedComponent;
