/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  subCaption?: string;
  date?: string;
  isCustom?: boolean;
  isEmpty?: boolean;
  emptyIcon?: 'star' | 'heart';
}

export interface QuestionItem {
  id: number;
  question: string;
  answer: string;
  asked: boolean;
}
