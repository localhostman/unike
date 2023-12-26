import { MaxNumPipe } from './max-num.pipe';

describe('MaxNumPipe', () => {
  it('create an instance', () => {
    const pipe = new MaxNumPipe();
    expect(pipe).toBeTruthy();
  });
});
